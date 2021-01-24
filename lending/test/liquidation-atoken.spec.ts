import BigNumber from "bignumber.js";
import { web3 } from "hardhat";
import {
  APPROVAL_AMOUNT_LENDING_POOL_CORE,
  ETHEREUM_ADDRESS,
  oneEther,
  RATEMODE_STABLE,
} from "../helpers/constants";
import { convertToCurrencyDecimals } from "../helpers/contracts-helpers";
import {
  IPriceOracle,
  LendingPool,
  LendingPoolAddressesProvider,
  LendingPoolCore,
  PriceOracle,
} from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";

const expectRevert = require("@openzeppelin/test-helpers").expectRevert;

const { expect } = require("chai");

const almostEqual: any = function (this: any, expected: any, actual: any): any {
  this.assert(
    expected.plus(new BigNumber(1)).eq(actual) ||
      expected.plus(new BigNumber(2)).eq(actual) ||
      actual.plus(new BigNumber(1)).eq(expected) ||
      actual.plus(new BigNumber(2)).eq(expected) ||
      expected.eq(actual),
    "expected #{act} to be almost equal #{exp}",
    "expected #{act} to be different from #{exp}",
    expected.toString(),
    actual.toString()
  );
};

require("chai").use(function (chai: any, utils: any) {
  chai.Assertion.overwriteMethod("almostEqual", function (original: any) {
    return function (this: any, value: any) {
      if (utils.flag(this, "bignumber")) {
        var expected = new BigNumber(value);
        var actual = new BigNumber(this._obj);
        almostEqual.apply(this, [expected, actual]);
      } else {
        original.apply(this, arguments);
      }
    };
  });
});

makeSuite(
  "LendingPool liquidation - liquidator receiving mToken",
  (testEnv: TestEnv) => {
    let _lendingPoolInstance: LendingPool;
    let _lendingPoolCoreInstance: LendingPoolCore;
    let _lendingPoolAddressesProviderInstance: LendingPoolAddressesProvider;
    let _priceOracleInstance: PriceOracle;
    // let _mTokenInstances: ImTokenInstances;
    // let _tokenInstances: ITokenInstances;

    let _daiAddress: string;

    //let _reservesParams: IReservesParams;

    // let _depositorAddress: string;
    // let _borrowerAddress: string;

    let _initialDepositorETHBalance: string;

    const halfEther = (0.5 * Math.pow(10, 18)).toString();

    before("Initializing LendingPool test variables", async () => {
      //_reservesParams = await getReservesParams();
      _lendingPoolInstance = testEnv.pool;
      _lendingPoolCoreInstance = testEnv.core;
      _priceOracleInstance = testEnv.oracle;
      //_mTokenInstances = mTokenInstances;
      _lendingPoolAddressesProviderInstance = testEnv.addressesProvider;
      //_tokenInstances = await getAllTokenInstances();
      _daiAddress = testEnv.dai.address;
      // _depositorAddress = await getFirstDepositorAddressOnTests();
      // _borrowerAddress = await getFirstBorrowerAddressOnTests();

      _initialDepositorETHBalance = await web3.eth.getBalance(
        testEnv.users[1].address
      );
    });

    it("LIQUIDATION - Deposits ETH, borrows DAI/Check liquidation fails because health factor is above 1", async () => {
      const { dai, users } = testEnv;

      //mints DAI to depositor
      await dai
        .connect(users[1].signer)
        .mint(await convertToCurrencyDecimals(dai.address, "1000"), {
          //from: _depositorAddress,
        });

      //approve protocol to access depositor wallet
      await dai
        .connect(users[1].signer)
        .approve(
          _lendingPoolCoreInstance.address,
          APPROVAL_AMOUNT_LENDING_POOL_CORE,
          {
            //from: _depositorAddress,
          }
        );

      //user 1 deposits 1000 DAI
      const amountDAItoDeposit = await convertToCurrencyDecimals(
        _daiAddress,
        "1000"
      );

      await _lendingPoolInstance
        .connect(users[1].signer)
        .deposit(_daiAddress, amountDAItoDeposit, "0", {
          // from: _depositorAddress,
        });

      //user 2 deposits 1 ETH
      const amountETHtoDeposit = await convertToCurrencyDecimals(
        ETHEREUM_ADDRESS,
        "1"
      );

      await _lendingPoolInstance
        .connect(users[2].signer)
        .deposit(ETHEREUM_ADDRESS, amountETHtoDeposit, "0", {
          // from: _borrowerAddress,
          value: amountETHtoDeposit,
        });

      //user 2 borrows

      const userGlobalData: any = await _lendingPoolInstance.getUserAccountData(
        users[2].address
      );
      const daiPrice = await _priceOracleInstance.getAssetPrice(_daiAddress);

      const amountDAIToBorrow = new BigNumber(
        userGlobalData.availableBorrowsBNB
      )
        .div(new BigNumber(daiPrice.toString()))
        .times(0.95)
        .dp(0);

      console.log(
        "userGlobalData.availableBorrowsBNB: ",
        userGlobalData.availableBorrowsBNB.toString()
      );
      console.log("Dai price: ", daiPrice.toString());
      console.log("amountDAIToBorrow: ", amountDAIToBorrow.toString());
      await _lendingPoolInstance
        .connect(users[2].signer)
        .borrow(
          _daiAddress,
          amountDAIToBorrow.toString(),
          RATEMODE_STABLE,
          "0",
          {
            // from: _borrowerAddress,
          }
        );

      const userGlobalDataAfter: any = await _lendingPoolInstance.getUserAccountData(
        users[2].address
      );

      expect(
        userGlobalDataAfter.currentLiquidationThreshold
      ).to.be.bignumber.equal("80", "Invalid liquidation threshold");

      //user 2 tries to borrow
      await expectRevert(
        _lendingPoolInstance.liquidationCall(
          ETHEREUM_ADDRESS,
          _daiAddress,
          users[2].address,
          amountDAIToBorrow.toString(),
          true
        ),
        "Health factor is not below the threshold"
      );
    });

    it("LIQUIDATION - Drop the health factor below 1", async () => {
      const { users } = testEnv;
      const daiPrice = await _priceOracleInstance.getAssetPrice(_daiAddress);

      //halving the price of ETH - means doubling the DAIETH exchange rate

      const _borrowerAddress = users[2];
      const userGlobalDataBefore: any = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );

      await _priceOracleInstance.setAssetPrice(
        _daiAddress,
        new BigNumber(daiPrice.toString()).multipliedBy(1.15).toFixed(0)
      );

      const userGlobalData: any = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );

      expect(userGlobalData.healthFactor).to.be.bignumber.lt(
        oneEther.toFixed(0),
        "Invalid health factor"
      );
    });

    it("LIQUIDATION - Tries to liquidate a different currency than the loan principal", async () => {
      const { users } = testEnv;
      const _borrowerAddress = users[2];
      //user 2 tries to borrow
      await expectRevert(
        _lendingPoolInstance.liquidationCall(
          ETHEREUM_ADDRESS,
          ETHEREUM_ADDRESS,
          _borrowerAddress.address,
          oneEther.toString(),
          true
        ),
        "User did not borrow the specified currency"
      );
    });

    it("LIQUIDATION - Tries to liquidate a different collateral than the borrower collateral", async () => {
      const { users } = testEnv;
      const _borrowerAddress = users[2];
      //user 2 tries to borrow
      await expectRevert(
        _lendingPoolInstance.liquidationCall(
          _daiAddress,
          _daiAddress,
          _borrowerAddress.address,
          oneEther.toString(),
          true
        ),
        "Invalid collateral to liquidate"
      );
    });

    it("LIQUIDATION - Liquidates the borrow", async () => {
      const { users, dai, deployer } = testEnv;
      const _borrowerAddress = users[2];

      //mints dai to the caller

      await dai.mint(await convertToCurrencyDecimals(dai.address, "1000"));

      //approve protocol to access depositor wallet
      await dai.approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE
      );

      const daiPrice = await _priceOracleInstance.getAssetPrice(_daiAddress);

      const userReserveDataBefore: any = await _lendingPoolInstance.getUserReserveData(
        _daiAddress,
        _borrowerAddress.address
      );

      const daiReserveDataBefore = await _lendingPoolInstance.getReserveData(
        _daiAddress
      );

      const amountToLiquidate = new BigNumber(
        userReserveDataBefore.currentBorrowBalance
      )
        .div(2)
        .toFixed(0);

      await _lendingPoolInstance.liquidationCall(
        ETHEREUM_ADDRESS,
        _daiAddress,
        _borrowerAddress.address,
        amountToLiquidate,
        true
      );

      const userReserveDataAfter: any = await _lendingPoolInstance.getUserReserveData(
        _daiAddress,
        _borrowerAddress.address
      );

      const userGlobalDataAfter: any = await _lendingPoolInstance.getUserAccountData(
        _borrowerAddress.address
      );

      const liquidatorData: any = await _lendingPoolInstance.getUserReserveData(
        ETHEREUM_ADDRESS,
        deployer.address
      );

      const daiReserveDataAfter: any = await _lendingPoolInstance.getReserveData(
        _daiAddress
      );

      const feeAddress = await _lendingPoolAddressesProviderInstance.getTokenDistributor();

      const feeAddressBalance = await web3.eth.getBalance(feeAddress);

      expect(userGlobalDataAfter.healthFactor).to.be.bignumber.gt(
        oneEther.toFixed(0),
        "Invalid health factor"
      );

      expect(userReserveDataAfter.originationFee).to.be.bignumber.eq(
        "0",
        "Origination fee should be repaid"
      );

      expect(feeAddressBalance).to.be.bignumber.gt("0");

      expect(
        userReserveDataAfter.principalBorrowBalance
      ).to.be.bignumber.almostEqual(
        new BigNumber(userReserveDataBefore.currentBorrowBalance)
          .minus(amountToLiquidate)
          .toFixed(0),
        "Invalid user borrow balance after liquidation"
      );
    });
  }
);

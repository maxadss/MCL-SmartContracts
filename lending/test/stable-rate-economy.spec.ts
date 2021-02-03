import { MintableERC20 } from "./../types/MintableErc20.d";
import { LendingPool, LendingPoolCore, MToken } from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";
import { convertToCurrencyDecimals } from "../helpers/contracts-helpers";
import {
  APPROVAL_AMOUNT_LENDING_POOL_CORE,
  ETHEREUM_ADDRESS,
  RATEMODE_STABLE,
} from "../helpers/constants";
import { expect } from "chai";

const expectRevert = require("@openzeppelin/test-helpers").expectRevert;
makeSuite("LendingPool - stable rate economy tests", (testEnv: TestEnv) => {
  let _lendingPoolInstance: LendingPool;
  let _lendingPoolCoreInstance: LendingPoolCore;
  //let _mTokenInstances: MToken;
  //let _tokenInstances: MintableERC20;
  let _daiAddress: string;
  let _depositorAddress: string;
  let _borrowerAddress: string;

  before("Initializing LendingPool test variables", async () => {
    _lendingPoolInstance = testEnv.pool;
    _lendingPoolCoreInstance = testEnv.core;
    // _mTokenInstances = mTokenInstances;
    // _tokenInstances = await getAllTokenInstances();
    _daiAddress = testEnv.dai.address;
    _depositorAddress = testEnv.users[1].address;
    _borrowerAddress = testEnv.users[2].address;
  });

  it("BORROW - Test user cannot borrow using the same currency as collateral", async () => {
    const { mDAI, dai, users } = testEnv;

    //mints DAI to depositor
    await dai
      .connect(users[1].signer)
      .mint(await convertToCurrencyDecimals(dai.address, "1000"), {
        //from: _depositorAddress,
      });

    //mints DAI to borrower
    await dai
      .connect(users[2].signer)
      .mint(await convertToCurrencyDecimals(dai.address, "1000"), {
        // from: _borrowerAddress,
      });

    //approve protocol to access depositor wallet
    await dai
      .connect(users[1].signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {
          //  from: _depositorAddress,
        }
      );

    //approve protocol to access borrower wallet
    await dai
      .connect(users[2].signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {
          // from: _borrowerAddress,
        }
      );

    const amountDAItoDeposit = await convertToCurrencyDecimals(
      _daiAddress,
      "1000"
    );

    //user 1 deposits 1000 DAI
    const txResult = await _lendingPoolInstance
      .connect(users[1].signer)
      .deposit(_daiAddress, amountDAItoDeposit, "0", {
        // from: _depositorAddress,
      });

    //user 2 deposits 1000 DAI, tries to borrow. Needs to be reverted as you can't borrow at a stable rate with the same collateral as the currency.
    const amountDAIToDepositBorrower = await convertToCurrencyDecimals(
      _daiAddress,
      "1000"
    );
    await _lendingPoolInstance
      .connect(users[2].signer)
      .deposit(_daiAddress, amountDAIToDepositBorrower, "0", {
        // from: _borrowerAddress,
      });

    const data: any = await _lendingPoolInstance.getReserveData(_daiAddress);

    //user 2 tries to borrow
    const amountDAIToBorrow = await convertToCurrencyDecimals(
      _daiAddress,
      "250"
    );

    //user 2 tries to borrow
    await expectRevert(
      _lendingPoolInstance
        .connect(users[2].signer)
        .borrow(_daiAddress, amountDAIToBorrow, RATEMODE_STABLE, "0", {
          // from: _borrowerAddress,
        }),
      "User cannot borrow the selected amount with a stable rate"
    );
  });

  it("BORROW - Test user cannot borrow more than 25% of the liquidity available", async () => {
    const { mDAI, dai, users } = testEnv;
    //redeem the DAI previously deposited
    const amountADAIToRedeem = await convertToCurrencyDecimals(
      mDAI.address,
      "1000"
    );
    await mDAI.connect(users[2].signer).redeem(amountADAIToRedeem, {
      // from: _borrowerAddress,
    });

    //user 2 deposits 5 ETH tries to borrow. needs to be reverted as you can't borrow more than 25% of the available reserve (250 DAI)
    const amountETHToDeposit = await convertToCurrencyDecimals(
      ETHEREUM_ADDRESS,
      "30"
    );
    await _lendingPoolInstance
      .connect(users[2].signer)
      .deposit(ETHEREUM_ADDRESS, amountETHToDeposit, "0", {
        // from: _borrowerAddress,
        value: amountETHToDeposit,
      });

    const data = await _lendingPoolInstance.getReserveData(_daiAddress);
    console.log("data.availableLiquidity ", data.availableLiquidity.toString());

    const amountDAIToBorrow = await convertToCurrencyDecimals(
      _daiAddress,
      "255"
    );

    //user 2 tries to borrow
    await expectRevert(
      _lendingPoolInstance
        .connect(users[2].signer)
        .borrow(_daiAddress, amountDAIToBorrow, RATEMODE_STABLE, "0", {
          //  from: _borrowerAddress,
        }),
      "User is trying to borrow too much liquidity at a stable rate"
    );
  });

  it("BORROW - Test user can still borrow  a currency that he previously deposited as a collateral but he transferred/redeemed", async () => {
    const { mDAI, dai, users } = testEnv;

    const user = users[2];

    //user deposits 1000 DAI
    await dai
      .connect(user.signer)
      .mint(await convertToCurrencyDecimals(dai.address, "1000"), {
        //  from: user,
      });
    await dai
      .connect(user.signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {
          // from: user,
        }
      );

    const amountDAIToDeposit = await convertToCurrencyDecimals(
      dai.address,
      "1000"
    );
    await _lendingPoolInstance
      .connect(user.signer)
      .deposit(dai.address, amountDAIToDeposit, "0", {
        // from: user,
      });

    //user deposits 5 ETH as collateral
    const amountETHToDeposit = await convertToCurrencyDecimals(
      ETHEREUM_ADDRESS,
      "5"
    );
    await _lendingPoolInstance
      .connect(user.signer)
      .deposit(ETHEREUM_ADDRESS, amountETHToDeposit, "0", {
        // from: user,
        value: amountETHToDeposit,
      });

    //user transfers to another address all the overlying aDAI

    const aDAIBalance = await mDAI.balanceOf(user.address);

    await mDAI.connect(user.signer).transfer(users[3].address, aDAIBalance, {
      //from: user,
    });

    //check the underlying balance is 0
    const userData = await _lendingPoolInstance.getUserReserveData(
      dai.address,
      user.address
    );

    expect(userData.currentMTokenBalance.toString()).to.be.equal("0");

    //user tries to borrow the DAI at a stable rate using the ETH as collateral
    const amountDAIToBorrow = await convertToCurrencyDecimals(
      _daiAddress,
      "100"
    );

    //user tries to borrow. No revert expected
    await _lendingPoolInstance
      .connect(user.signer)
      .borrow(_daiAddress, amountDAIToBorrow, RATEMODE_STABLE, "0", {
        //from: user,
      });
  });
});

import { web3 } from "hardhat";
import {
  ETHEREUM_ADDRESS,
  oneEther,
  RATEMODE_STABLE,
  RATEMODE_VARIABLE,
} from "../helpers/constants";
import { convertToCurrencyDecimals } from "../helpers/contracts-helpers";
import {
  LendingPool,
  LendingPoolConfigurator,
  LendingPoolCore,
} from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";

const expectRevert = require("@openzeppelin/test-helpers").expectRevert;

makeSuite("LendingPool: Modifiers", (testEnv: TestEnv) => {
  let _lendingPoolConfiguratorInstance: LendingPoolConfigurator;
  let _lendingPoolInstance: LendingPool;
  let _lendingPoolCoreInstance: LendingPoolCore;

  before("Initializing LendingPool test variables", async () => {
    _lendingPoolConfiguratorInstance = testEnv.configurator;
    _lendingPoolInstance = testEnv.pool;
    _lendingPoolCoreInstance = testEnv.core;
    console.log("Init .....");
  });

  it("Tries to deposit in an inactive reserve", async () => {
    const { deployer } = testEnv;
    //using the deployer address as a fake reserve address
    await expectRevert(
      _lendingPoolInstance
        .connect(deployer.signer)
        .deposit(deployer.address, "1", "0"),
      "Action requires an active reserve"
    );
  });

  it("Tries to invoke redeemUnderlying on an reserve, from a non-mToken address", async () => {
    const { deployer } = testEnv;
    await expectRevert(
      _lendingPoolInstance.redeemUnderlying(
        ETHEREUM_ADDRESS,
        deployer.address,
        "1",
        "0"
      ),
      "The caller of this function can only be the mToken contract of this reserve"
    );
  });

  it("Tries to borrow from an inactive reserve", async () => {
    const { deployer } = testEnv;
    //using the deployer address as a fake reserve address
    await expectRevert(
      _lendingPoolInstance.borrow(deployer.address, "1", "0", RATEMODE_STABLE),
      "Action requires an active reserve"
    );
  });

  it("Tries to repay in an inactive reserve", async () => {
    const { deployer } = testEnv;

    //using the deployer address as a fake reserve address
    await expectRevert(
      _lendingPoolInstance.repay(deployer.address, "1", deployer.address),
      "Action requires an active reserve"
    );
  });

  it("Tries to swapBorrowRateMode on an inactive reserve", async () => {
    const { deployer } = testEnv;

    //using the deployer address as a fake reserve address
    await expectRevert(
      _lendingPoolInstance.swapBorrowRateMode(deployer.address),
      "Action requires an active reserve"
    );
  });

  it("Tries to rebalanceStableBorrowRate on an inactive reserve", async () => {
    const { deployer } = testEnv;

    //using the deployer address as a fake reserve address
    await expectRevert(
      _lendingPoolInstance.rebalanceStableBorrowRate(
        deployer.address,
        deployer.address
      ),
      "Action requires an active reserve"
    );
  });

  it("Tries to setUserUseReserveAsCollateral on an inactive reserve", async () => {
    const { deployer } = testEnv;
    //using the deployer address as a fake reserve address
    await expectRevert(
      _lendingPoolInstance.setUserUseReserveAsCollateral(
        deployer.address,
        true
      ),
      "Action requires an active reserve"
    );
  });

  it("Tries to invoke liquidationCall on an inactive reserve", async () => {
    const { deployer } = testEnv;

    //using the deployer address as a fake reserve address
    await expectRevert(
      _lendingPoolInstance.liquidationCall(
        ETHEREUM_ADDRESS,
        deployer.address,
        deployer.address,
        "1",
        false
      ),
      "Action requires an active reserve"
    );
  });

  it("Tries to invoke liquidationCall on an inactive collateral", async () => {
    const { deployer } = testEnv;

    //using the deployer address as a fake reserve address
    await expectRevert(
      _lendingPoolInstance.liquidationCall(
        deployer.address,
        ETHEREUM_ADDRESS,
        deployer.address,
        "1",
        false
      ),
      "Action requires an active reserve"
    );
  });

  it("Freezes the ETH reserve", async () => {
    await _lendingPoolConfiguratorInstance.freezeReserve(ETHEREUM_ADDRESS);
  });

  it("tries to deposit in a freezed reserve", async () => {
    await expectRevert(
      _lendingPoolInstance.deposit(ETHEREUM_ADDRESS, "1", "0"),
      "Action requires an unfreezed reserve"
    );
  });

  it("tries to borrow from a freezed reserve", async () => {
    await expectRevert(
      _lendingPoolInstance.borrow(ETHEREUM_ADDRESS, "1", "0", "0"),
      "Action requires an unfreezed reserve"
    );
  });

  it("tries to swap interest rate mode in a freezed reserve", async () => {
    await expectRevert(
      _lendingPoolInstance.swapBorrowRateMode(ETHEREUM_ADDRESS),
      "Action requires an unfreezed reserve"
    );
  });

  it("tries to disable as collateral a freezed reserve", async () => {
    await expectRevert(
      _lendingPoolInstance.setUserUseReserveAsCollateral(
        ETHEREUM_ADDRESS,
        false
      ),
      "Action requires an unfreezed reserve"
    );
  });

  it("unfreezes the reserve, user deposits 1 ETH, freezes the reserve, check that the user can redeem", async () => {
    const { deployer, mETH } = testEnv;

    //unfreezes the reserve
    await _lendingPoolConfiguratorInstance.unfreezeReserve(ETHEREUM_ADDRESS);

    //deposit 1 ETH
    await _lendingPoolInstance.deposit(
      ETHEREUM_ADDRESS,
      oneEther.toString(),
      "0",
      {
        value: oneEther.toString(),
      }
    );

    //freezes the reserve
    await _lendingPoolConfiguratorInstance.freezeReserve(ETHEREUM_ADDRESS);

    const balance = await mETH.balanceOf(deployer.address);

    await mETH.redeem(balance);
  });

  it("unfreezes the reserve, user 0 deposits 100 DAI, user 1 deposits 1 ETH and borrows 50 DAI, freezes the reserve, checks that the user 1 can repay", async () => {
    const { dai, users } = testEnv;
    //unfreezes the reserve
    await _lendingPoolConfiguratorInstance.unfreezeReserve(ETHEREUM_ADDRESS);

    const amountDAI = await convertToCurrencyDecimals(dai.address, "100");

    //user 0 deposits 100 DAI
    await dai.connect(users[0].signer).mint(amountDAI, {
      //from: users[0]
    });

    await dai.connect(users[1].signer).mint(amountDAI, {
      //from: users[0]
    });

    await dai
      .connect(users[0].signer)
      .approve(_lendingPoolCoreInstance.address, amountDAI, {
        // from: users[0],
      });

    await dai
      .connect(users[1].signer)
      .approve(_lendingPoolCoreInstance.address, amountDAI, {
        // from: users[0],
      });

    await _lendingPoolInstance
      .connect(users[0].signer)
      .deposit(dai.address, amountDAI, "0", {
        // from: users[0],
      });

    //user 1 deposits 1 ETH
    await _lendingPoolInstance
      .connect(users[1].signer)
      .deposit(ETHEREUM_ADDRESS, oneEther.toString(), "0", {
        // from: users[1],
        value: oneEther.toString(),
      });

    const amountDAIToBorrow = await convertToCurrencyDecimals(
      dai.address,
      "10"
    );

    //user 1 borrows 10 DAI
    await _lendingPoolInstance
      .connect(users[1].signer)
      .borrow(dai.address, amountDAIToBorrow.toString(), RATEMODE_STABLE, "0", {
        //  from: users[1],
      });

    //freezes the reserve
    await _lendingPoolConfiguratorInstance.freezeReserve(ETHEREUM_ADDRESS);

    //user 1 repays 1 DAI
    await dai
      .connect(users[1].signer)
      .approve(_lendingPoolCoreInstance.address, oneEther.toString(), {
        // from: users[1],
      });

    await dai
      .connect(users[1].signer)
      .approve(_lendingPoolInstance.address, oneEther.toString(), {
        // from: users[1],
      });

    const bl = await dai.balanceOf(users[1].address);
    console.log("Dai ", bl.toString());

    const bl2 = await dai.allowance(
      users[1].address,
      _lendingPoolCoreInstance.address
    );
    console.log("Allowance ", bl2.toString());

    const bl3 = await dai.balanceOf(_lendingPoolCoreInstance.address);
    console.log("_lendingPoolCoreInstance ", bl3.toString());

    await _lendingPoolInstance
      .connect(users[1].signer)
      .repay(dai.address, oneEther.toString(), users[1].address, {
        // from: users[1],
      });
  });

  // it("Check that liquidationCall can be executed on a freezed reserve", async () => {
  //   const { deployer, mETH, dai, users } = testEnv;

  //   //user 2 tries to liquidate

  //   await expectRevert(
  //     _lendingPoolInstance
  //       .connect(users[2].signer)
  //       .liquidationCall(
  //         ETHEREUM_ADDRESS,
  //         dai.address,
  //         users[1].address,
  //         oneEther.toString(),
  //         true,
  //         {
  //           //from: users[2]
  //         }
  //       ),
  //     "Health factor is not below the threshold"
  //   );
  // });

  it("Check that rebalanceStableBorrowRate can be executed on a freezed reserve", async () => {
    const { deployer, mETH, dai, users } = testEnv;

    //user 2 tries to liquidate

    await expectRevert(
      _lendingPoolInstance.rebalanceStableBorrowRate(
        dai.address,
        users[1].address
      ),
      "Interest rate rebalance conditions were not met"
    );
  });
});

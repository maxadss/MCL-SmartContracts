import { ETHEREUM_ADDRESS, RATEMODE_VARIABLE } from "../helpers/constants";
import {
  LendingPool,
  LendingPoolConfigurator,
  LendingPoolCore,
  MToken,
} from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";

const expectRevert = require("@openzeppelin/test-helpers").expectRevert;

makeSuite("LendingPoolCore: Modifiers", (testEnv: TestEnv) => {
  let _lendingPoolConfiguratorInstance: LendingPoolConfigurator;
  let _lendingPoolInstance: LendingPool;
  let _lendingPoolCoreInstance: LendingPoolCore;
  //let _mTokenInstances: MToken;
  // let _tokenInstances: ITokenInstances;

  before("Initializing tests", async () => {
    _lendingPoolCoreInstance = testEnv.core;
    _lendingPoolInstance = testEnv.pool;
    _lendingPoolConfiguratorInstance = testEnv.configurator;
    //_tokenInstances = await getAllTokenInstances();
  });

  it("Tries invoke updateStateOnDeposit ", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.updateStateOnDeposit(
        dai.address,
        deployer.address,
        "0",
        false
      ),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke updateStateOnRedeem", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.updateStateOnRedeem(
        dai.address,
        deployer.address,
        "0",
        false
      ),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke updateStateOnBorrow", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.updateStateOnBorrow(
        dai.address,
        deployer.address,
        "0",
        "0",
        RATEMODE_VARIABLE
      ),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke updateStateOnRepay", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.updateStateOnRepay(
        dai.address,
        deployer.address,
        "0",
        "0",
        "0",
        false
      ),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke updateStateOnSwapRate", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.updateStateOnSwapRate(
        dai.address,
        deployer.address,
        "0",
        "0",
        "0",
        RATEMODE_VARIABLE
      ),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke updateStateOnRebalance", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.updateStateOnRebalance(
        dai.address,
        deployer.address,
        "0"
      ),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke updateStateOnLiquidation", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.updateStateOnLiquidation(
        ETHEREUM_ADDRESS,
        dai.address,
        deployer.address,
        "0",
        "0",
        "0",
        "0",
        "0",
        false
      ),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke setUserUseReserveAsCollateral", async () => {
    const { deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.setUserUseReserveAsCollateral(
        ETHEREUM_ADDRESS,
        deployer.address,
        false
      ),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke transferToUser", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.transferToUser(
        ETHEREUM_ADDRESS,
        deployer.address,
        "0"
      ),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke transferToReserve", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.transferToReserve(
        ETHEREUM_ADDRESS,
        deployer.address,
        "0"
      ),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke transferToFeeCollectionAddress", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.transferToFeeCollectionAddress(
        ETHEREUM_ADDRESS,
        deployer.address,
        "0",
        true
      ),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke liquidateFee", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.liquidateFee(ETHEREUM_ADDRESS, "0"),
      "The caller must be a lending pool contract"
    );
  });

  it("Tries invoke initReserve", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.initReserve(
        dai.address,
        dai.address,
        "18",
        deployer.address
      ),
      "The caller must be a lending pool configurator contract"
    );
  });

  it("Tries invoke refreshConfiguration", async () => {
    await expectRevert(
      _lendingPoolCoreInstance.refreshConfiguration(),
      "The caller must be a lending pool configurator contract"
    );
  });

  it("Tries invoke enableBorrowingOnReserve, disableBorrowingOnReserve", async () => {
    const { dai } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.enableBorrowingOnReserve(dai.address, false),
      "The caller must be a lending pool configurator contract"
    );
    await expectRevert(
      _lendingPoolCoreInstance.refreshConfiguration(),
      "The caller must be a lending pool configurator contract"
    );
  });

  it("Tries invoke freezeReserve, unfreezeReserve", async () => {
    const { dai } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.freezeReserve(dai.address),
      "The caller must be a lending pool configurator contract"
    );
    await expectRevert(
      _lendingPoolCoreInstance.unfreezeReserve(dai.address),
      "The caller must be a lending pool configurator contract"
    );
  });

  it("Tries invoke enableReserveAsCollateral, disableReserveAsCollateral", async () => {
    const { dai } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.enableReserveAsCollateral(dai.address, 0, 0, 0),
      "The caller must be a lending pool configurator contract"
    );
    await expectRevert(
      _lendingPoolCoreInstance.disableReserveAsCollateral(dai.address),
      "The caller must be a lending pool configurator contract"
    );
  });

  it("Tries invoke enableReserveStableBorrowRate, disableReserveStableBorrowRate", async () => {
    const { dai } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.enableReserveStableBorrowRate(dai.address),
      "The caller must be a lending pool configurator contract"
    );
    await expectRevert(
      _lendingPoolCoreInstance.disableReserveStableBorrowRate(dai.address),
      "The caller must be a lending pool configurator contract"
    );
  });

  it("Tries invoke setReserveDecimals", async () => {
    const { dai } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.setReserveDecimals(dai.address, "0"),
      "The caller must be a lending pool configurator contract"
    );
  });

  it("Tries invoke removeLastAddedReserve", async () => {
    const { dai } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.removeLastAddedReserve(dai.address),
      "The caller must be a lending pool configurator contract"
    );
  });

  it("Tries invoke setReserveBaseLTVasCollateral", async () => {
    const { dai } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.setReserveBaseLTVasCollateral(dai.address, "0"),
      "The caller must be a lending pool configurator contract"
    );
  });

  it("Tries invoke setReserveLiquidationBonus", async () => {
    const { dai } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.setReserveLiquidationBonus(dai.address, "0"),
      "The caller must be a lending pool configurator contract"
    );
  });

  it("Tries invoke setReserveLiquidationThreshold", async () => {
    const { dai } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.setReserveLiquidationThreshold(dai.address, "0"),
      "The caller must be a lending pool configurator contract"
    );
  });

  it("Tries invoke setReserveInterestRateStrategyAddress", async () => {
    const { dai, deployer } = testEnv;

    await expectRevert(
      _lendingPoolCoreInstance.setReserveInterestRateStrategyAddress(
        dai.address,
        deployer.address
      ),
      "The caller must be a lending pool configurator contract"
    );
  });
});

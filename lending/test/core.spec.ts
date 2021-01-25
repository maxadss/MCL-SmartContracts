import BigNumber from "bignumber.js";
import { expect } from "chai";
import { ETHEREUM_ADDRESS, RAY, WAD } from "../helpers/constants";
import { LendingPoolAddressesProvider, LendingPoolCore } from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";

makeSuite("LendingPoolCore", (testEnv: TestEnv) => {
  let _addressesProviderInstance: LendingPoolAddressesProvider;
  let _lendingPoolCoreInstance: LendingPoolCore;
  let _lendAddress: string;

  before("Initializing LendingPoolCore test variables", async () => {
    _addressesProviderInstance = testEnv.addressesProvider;
    _lendingPoolCoreInstance = testEnv.core;
    _lendAddress = testEnv.dai.address;
  });

  // it("Configure the lending pool address to the owner address to allow invocation of the methods", async () => {
  //   const {deployer} = testEnv;

  //   await _addressesProviderInstance.setLendingPoolConfiguratorImpl(deployer.address);
  //   await _addressesProviderInstance.setLendingPoolImpl(deployer.address);
  //   await _lendingPoolCoreInstance.refreshConfiguration();
  //   const providerAddress = await _addressesProviderInstance.getLendingPoolConfigurator();
  //   expect(providerAddress).to.be.equal(deployer.address);
  //   const poolAddress = await _addressesProviderInstance.getLendingPool();
  //   expect(poolAddress).to.be.equal(deployer.address);
  // });

  // it("Increases the stable total borrows of a reserve", async () => {
  //   await _lendingPoolCoreInstance.incre(
  //     ETHEREUM_ADDRESS,
  //     WAD,
  //     new BigNumber(RAY).multipliedBy(10).toFixed()
  //   ); //10% interest

  //   const totalBorrows = await _lendingPoolCoreInstance.getReserveTotalBorrowsStable(
  //     ETHEREUM_ADDRESS
  //   );

  //   expect(totalBorrows.toString()).to.be.equal(WAD);
  // });

  // it("Increases the variable total borrows of a reserve", async () => {
  //   await _lendingPoolCoreInstance.increaseReserveTotalBorrowsVariable(
  //     ETHEREUM_ADDRESS,
  //     WAD
  //   ); //10% interest

  //   const totalBorrows = await _lendingPoolCoreInstance.getReserveTotalBorrowsVariable(
  //     ETHEREUM_ADDRESS
  //   );

  //   expect(totalBorrows.toString()).to.be.equal(WAD);
  // });

  // it("Decreases the stable total borrows of a reserve", async () => {
  //   await _lendingPoolCoreInstance.decreaseReserveTotalBorrowsStableAndUpdateAverageRate(
  //     ETHEREUM_ADDRESS,
  //     WAD,
  //     new BigNumber(RAY).multipliedBy(10).toFixed()
  //   );

  //   const totalBorrows = await _lendingPoolCoreInstance.getReserveTotalBorrowsStable(
  //     ETHEREUM_ADDRESS
  //   );

  //   expect(totalBorrows.toString()).to.be.equal("0");
  // });

  // it("Decreases the variable total borrows of a reserve", async () => {
  //   await _lendingPoolCoreInstance.decreaseReserveTotalBorrowsVariable(
  //     ETHEREUM_ADDRESS,
  //     WAD
  //   );

  //   const totalBorrows = await _lendingPoolCoreInstance.getReserveTotalBorrowsVariable(
  //     ETHEREUM_ADDRESS
  //   );

  //   expect(totalBorrows.toString()).to.be.equal("0");
  // });

  // it("Updates the variable borrow index, checks that is equal to 1 as there are no borrows from the user", async () => {
  //   const {deployer} = testEnv;

  //   await _lendingPoolCoreInstance.updateUserLastVariableBorrowCumulativeIndex(
  //     _lendAddress,
  //     deployer.address
  //   );
  //   await _lendingPoolCoreInstance.updateUserLastVariableBorrowCumulativeIndex(
  //     ETHEREUM_ADDRESS,
  //     deployer.address
  //   );

  //   const indexLEND = await _lendingPoolCoreInstance.getUserVariableBorrowCumulativeIndex(
  //     _lendAddress,
  //     deployer.address
  //   );
  //   const indexETH = await _lendingPoolCoreInstance.getUserVariableBorrowCumulativeIndex(
  //     ETHEREUM_ADDRESS,
  //     deployer.address
  //   );

  //   expect(indexLEND.toString()).to.be.equal(
  //     RAY,
  //     "Invalid user borrow index for LEND"
  //   );
  //   expect(indexETH.toString()).to.be.equal(
  //     RAY,
  //     "Invalid user borrow index for ETH"
  //   );
  // });

  // it("Disables the LEND collateral", async () => {
  //   await _lendingPoolCoreInstance.disableReserveAsCollateral(_lendAddress);

  //   const collateralEnabled = await _lendingPoolCoreInstance.isReserveUsageAsCollateralEnabled(
  //     _lendAddress
  //   );

  //   expect(collateralEnabled).to.be.equal(false);
  // });

  // it("Deactivates the ETH reserve", async () => {
  //   await _lendingPoolCoreInstance.disableBorrowingOnReserve(ETHEREUM_ADDRESS);

  //   const isEnabled = await _lendingPoolCoreInstance.isReserveBorrowingEnabled(
  //     ETHEREUM_ADDRESS
  //   );

  //   expect(isEnabled).to.be.equal(false);
  // });
});

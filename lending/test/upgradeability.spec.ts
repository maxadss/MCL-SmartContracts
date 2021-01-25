import { readArtifact } from "@nomiclabs/buidler/plugins";
import { ETHEREUM_ADDRESS } from "../helpers/constants";
import { getLendingPoolCoreProxy } from "../helpers/contracts-getters";
import {
  LendingPool,
  LendingPoolAddressesProvider,
  LendingPoolConfigurator,
  LendingPoolCore,
  LendingPoolDataProvider,
  MockLendingPoolCore,
} from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";

const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

makeSuite("Upgradeability", (testEnv: TestEnv) => {
  //contract("Upgradeability", async ([deployer, ...users]) => {
  let _configuratorInstance: LendingPoolConfigurator;
  let _coreInstance: LendingPoolCore;
  let _poolInstance: LendingPool;
  let _addressesProviderInstance: LendingPoolAddressesProvider;
  let _dataProviderInstance: LendingPoolDataProvider;
  let _mockCoreInstance: MockLendingPoolCore;

  before("Initializing test variables", async () => {
    _addressesProviderInstance = testEnv.addressesProvider;
    _configuratorInstance = testEnv.configurator;
    _coreInstance = testEnv.core;
    _dataProviderInstance = testEnv.dataProvider;
    _poolInstance = testEnv.pool;
  });

  it("tries to call the initialization function on LendingPoolConfigurator", async () => {
    await expectRevert(
      _configuratorInstance.initialize(_addressesProviderInstance.address),
      "Contract instance has already been initialized"
    );
  });

  it("tries to call the initialization function on LendingPoolCore", async () => {
    await expectRevert(
      _coreInstance.initialize(_addressesProviderInstance.address),
      "Contract instance has already been initialized"
    );
  });

  it("tries to call the initialization function on LendingPool", async () => {
    await expectRevert(
      _poolInstance.initialize(_addressesProviderInstance.address),
      "Contract instance has already been initialized"
    );
  });

  it("tries to call the initialization function on DataProvider", async () => {
    await expectRevert(
      _dataProviderInstance.initialize(_addressesProviderInstance.address),
      "Contract instance has already been initialized"
    );
  });

  // it("Deploys a new version of a LendingPoolCore contract", async () => {
  //   const contract: any = await readArtifact("MockLendingPoolCore");

  //   const mathLibrary = await artifacts.require("WadRayMath");

  //   const mathLibraryInstance = await mathLibrary.new();

  //   const coreLibrary = await artifacts.require("CoreLibrary");

  //   await coreLibrary.link("WadRayMath", mathLibraryInstance.address);

  //   await contract.link("CoreLibrary", coreLibrary.address);

  //   await contract.link("WadRayMath", mathLibraryInstance.address);

  //   _mockCoreInstance = await contract.new();

  //   const txResult = await _addressesProviderInstance.setLendingPoolCoreImpl(
  //     _mockCoreInstance.address
  //   );

  //   expectEvent(txResult, "LendingPoolCoreUpdated", {
  //     newAddress: _mockCoreInstance.address,
  //   });
  // });

  it("Tries to execute initialize() on the newly deployed core", async () => {
    const coreProxyAddress = await _addressesProviderInstance.getLendingPoolCore();

    const instance = await getLendingPoolCoreProxy(coreProxyAddress);

    await expectRevert(
      instance.initialize(_addressesProviderInstance.address),
      "Contract instance has already been initialized"
    );
  });

  it("Tries to deposit", async () => {
    const coreProxyAddress = await _addressesProviderInstance.getLendingPoolCore();
    const txReceipt = await _poolInstance.deposit(
      ETHEREUM_ADDRESS,
      "100",
      "0",
      { value: "100" }
    );

    expectEvent.inTransaction(
      txReceipt.hash,
      coreProxyAddress,
      "ReserveUpdatedFromMock",
      {
        revision: "2",
      }
    );
  });
});

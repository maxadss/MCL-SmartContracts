import BigNumber from "bignumber.js";
import { expect } from "chai";
import {
  ChainlinkProxyPriceProvider,
  FeeProvider,
  LendingPool,
  LendingPoolAddressesProvider,
  LendingPoolConfigurator,
  LendingPoolCore,
  LendingPoolDataProvider,
  LendingRateOracle,
  PriceOracle,
} from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";

const expectRevert = require("@openzeppelin/test-helpers").expectRevert;
makeSuite("AddressesProviderRegistry", (testEnv: TestEnv) => {
  let _addressesProviderInstance: LendingPoolAddressesProvider;
  let _lendingPoolInstance: LendingPool;
  let _lendingPoolCoreInstance: LendingPoolCore;
  let _lendingPoolConfiguratorInstance: LendingPoolConfigurator;
  let _lendingPoolManagerAddress: string;
  let _lendingPoolDataProviderInstance: LendingPoolDataProvider;
  let _lendingRateOracleInstance: LendingRateOracle;
  let _feeProviderInstance: FeeProvider;
  let _chainlinkProxyPriceProviderInstance: PriceOracle;

  const testParamConsistency = <TBaseValue extends string | number | BigNumber>(
    baseSourceName: string,
    onchainRegisterName: string,
    baseValue: TBaseValue,
    onchainRegisteredValue: TBaseValue
  ) => {
    expect(baseValue).to.be.equal(
      onchainRegisteredValue,
      `${baseSourceName} ${baseValue} is incorrectly registered in ${onchainRegisterName} ${onchainRegisteredValue}`
    );
  };

  it("Tests the Lending Pool address consistency in the LendingPoolAddressesProvider", async () => {
    _addressesProviderInstance = testEnv.addressesProvider;
    _lendingPoolInstance = testEnv.pool;
    _lendingPoolCoreInstance = testEnv.core;
    _lendingPoolDataProviderInstance = testEnv.dataProvider;
    _lendingRateOracleInstance = testEnv.rateOracle;
    _feeProviderInstance = testEnv.feeProvider;
    _lendingPoolConfiguratorInstance = testEnv.configurator;

    _chainlinkProxyPriceProviderInstance = testEnv.oracle;

    _addressesProviderInstance = testEnv.addressesProvider;
    _lendingPoolInstance = testEnv.pool;
    testParamConsistency(
      "Lending Pool",
      "LendingPoolAddressesProvider",
      _lendingPoolInstance.address,
      await _addressesProviderInstance.getLendingPool()
    );
  });

  it("Tests the Lending Pool Core address consistency in the LendingPoolAddressesProvider", async () => {
    testParamConsistency(
      "Lending Pool Core",
      "LendingPoolAddressesProvider",
      _lendingPoolCoreInstance.address,
      await _addressesProviderInstance.getLendingPoolCore()
    );
  });

  it("Tests the Lending Pool Configurator address consistency in the LendingPoolAddressesProvider", async () => {
    testParamConsistency(
      "Lending Pool Configurator",
      "LendingPoolAddressesProvider",
      _lendingPoolConfiguratorInstance.address,
      await _addressesProviderInstance.getLendingPoolConfigurator()
    );
  });

  // it("Tests the Lending Pool Manager address consistency in the LendingPoolAddressesProvider", async () => {
  //     _lendingPoolManagerAddress = await getGenesisLendingPoolManagerAddress();
  //   testParamConsistency(
  //     "Lending Pool Manager",
  //     "LendingPoolAddressesProvider",
  //     _lendingPoolManagerAddress,
  //     await _addressesProviderInstance.getLendingPoolManager()
  //   );
  // });

  it("Tests the Lending Pool Data Provider address consistency in the LendingPoolAddressesProvider", async () => {
    testParamConsistency(
      "Lending Pool Data Provider",
      "LendingPoolAddressesProvider",
      _lendingPoolDataProviderInstance.address,
      await _addressesProviderInstance.getLendingPoolDataProvider()
    );
  });

  it("Tests the ChainlinkProxyPriceProvider address consistency in the LendingPoolAddressesProvider", async () => {
    testParamConsistency(
      "Chainlink Proxy Price Provider",
      "LendingPoolAddressesProvider",
      _chainlinkProxyPriceProviderInstance.address,
      await _addressesProviderInstance.getPriceOracle()
    );
  });

  it("Tests the Lending Rate Oracle address consistency in the LendingPoolAddressesProvider", async () => {
    testParamConsistency(
      "Lending Rate Oracle",
      "LendingPoolAddressesProvider",
      _lendingRateOracleInstance.address,
      await _addressesProviderInstance.getLendingRateOracle()
    );
  });

  it("Tests the Fee Provider address consistency in the LendingPoolAddressesProvider", async () => {
    testParamConsistency(
      "Fee Provider",
      "LendingPoolAddressesProvider",
      _feeProviderInstance.address,
      await _addressesProviderInstance.getFeeProvider()
    );
  });

  it("Test the accessibility of the LendingPoolAddressesProvider", async () => {
    const accounts = testEnv.users;
    //transfers ownership to another account
    await _addressesProviderInstance.transferOwnership(accounts[2].address);

    //checks execution of the setters on LendingPoolAddressesProvider

    await expectRevert(
      _addressesProviderInstance.setFeeProviderImpl(accounts[0].address),
      "Ownable: caller is not the owner"
    );
    await expectRevert(
      _addressesProviderInstance.setLendingPoolImpl(accounts[0].address),
      "Ownable: caller is not the owner"
    );
    await expectRevert(
      _addressesProviderInstance.setLendingPoolConfiguratorImpl(
        accounts[0].address
      ),
      "Ownable: caller is not the owner"
    );
    await expectRevert(
      _addressesProviderInstance.setLendingPoolCoreImpl(accounts[0].address),
      "Ownable: caller is not the owner"
    );
    await expectRevert(
      _addressesProviderInstance.setLendingPoolDataProviderImpl(
        accounts[0].address
      ),
      "Ownable: caller is not the owner"
    );
    await expectRevert(
      _addressesProviderInstance.setLendingPoolLiquidationManager(
        accounts[0].address
      ),
      "Ownable: caller is not the owner"
    );
    await expectRevert(
      _addressesProviderInstance.setLendingPoolManager(accounts[0].address),
      "Ownable: caller is not the owner"
    );
    await expectRevert(
      _addressesProviderInstance.setLendingPoolParametersProvider(
        accounts[0].address
      ),
      "Ownable: caller is not the owner"
    );
    await expectRevert(
      _addressesProviderInstance.setLendingRateOracle(accounts[0].address),
      "Ownable: caller is not the owner"
    );

    await expectRevert(
      _addressesProviderInstance.setPriceOracle(accounts[0].address),
      "Ownable: caller is not the owner"
    );
  });
});

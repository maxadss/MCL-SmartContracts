import rawBRE from "hardhat";
import { MockContract } from "ethereum-waffle";
import {
  insertContractAddressInDb,
  getEthersSigners,
  registerContractInJsonDb,
} from "../helpers/contracts-helpers";
import {
  deployLendingPoolAddressesProvider,
  deployLendingPoolConfigurator,
  deployLendingPool,
  deployPriceOracle,
  deployLendingPoolCollateralManager,
  deployMockFlashLoanReceiver,
  deployWalletBalancerProvider,
  deployLengindPoolDataProvider,
  deployLendingRateOracle,
  deployMintableErc20,
  deployFeeProvider,
  deployLendingPoolParameter,
  deployLendingPoolCore,
  deployAaveLibraries,
  deployDefaultReserveInterestRateStrategy,
  deployMDAI,
  deployMockDAI,
  deployRewardManager,
  deployRewardVault,
} from "../helpers/contracts-deployments";
import { Signer } from "ethers";
import {
  TokenContractId,
  eContractid,
  tEthereumAddress,
  AavePools,
} from "../helpers/types";
import { MintableERC20 } from "../types/MintableERC20";
import {
  ConfigNames,
  getReservesConfigByPool,
  getTreasuryAddress,
  loadPoolConfig,
} from "../helpers/configuration";
import { initializeMakeSuite } from "./helpers/make-suite";

import {
  setInitialAssetPricesInOracle,
  //deployAllMockAggregators,
  //setInitialMarketRatesInRatesOracleByHelper,
} from "../helpers/oracles-helpers";
import { DRE, waitForTx } from "../helpers/misc-utils";
import {
  initReservesByHelper,
  //configureReservesByHelper,
} from "../helpers/init-helpers";
import AaveConfig from "../markets/aave";
import { ETHEREUM_ADDRESS, ZERO_ADDRESS } from "../helpers/constants";
import {
  getLendingPool,
  getLendingPoolConfiguratorProxy,
  getPairsTokenAggregator,
  getLendingPoolDataProviderProxy,
  getLendingPoolParameterProxy,
  getMockDAI,
  getRewardManager,
  getMintableErc20,
  getLendingPoolProxy,
  getLendingPoolCoreProxy,
} from "../helpers/contracts-getters";
//import { WETH9Mocked } from '../types/WETH9Mocked';

const MOCK_USD_PRICE_IN_WEI = AaveConfig.ProtocolGlobalParams.MockUsdPriceInWei;

const deployAllMockTokens = async (deployer: Signer) => {
  const tokens: { [symbol: string]: MockContract | MintableERC20 } = {};

  const protoConfigData = getReservesConfigByPool(AavePools.proto);

  for (const tokenSymbol of Object.keys(TokenContractId)) {
    let decimals = 18;

    let configData = (<any>protoConfigData)[tokenSymbol];

    if (!configData) {
      decimals = 18;
    }

    tokens[tokenSymbol] = await deployMintableErc20([
      tokenSymbol,
      tokenSymbol,
      configData ? configData.reserveDecimals : 18,
    ]);
    await registerContractInJsonDb(
      tokenSymbol.toUpperCase(),
      tokens[tokenSymbol]
    );
  }

  return tokens;
};

const buildTestEnv = async (deployer: Signer, secondaryWallet: Signer) => {
  console.time("setup");
  const aaveAdmin = await deployer.getAddress();

  const mockTokens = await deployAllMockTokens(deployer);

  const addressesProvider = await deployLendingPoolAddressesProvider(
    AaveConfig.MarketId
  );
  await waitForTx(await addressesProvider.setLendingPoolManager(aaveAdmin));

  //setting users[1] as emergency admin, which is in position 2 in the DRE addresses list
  const addressList = await Promise.all(
    (await DRE.ethers.getSigners()).map((signer) => signer.getAddress())
  );

  //fee
  const feeProviderImpl = await deployFeeProvider();

  await waitForTx(
    await addressesProvider.setFeeProviderImpl(feeProviderImpl.address)
  );

  const feeProviderImplProxy = await addressesProvider.getFeeProvider();
  await insertContractAddressInDb(
    eContractid.FeeProvider,
    feeProviderImplProxy
  );

  //param

  const parametersProvider = await deployLendingPoolParameter();

  await waitForTx(
    await addressesProvider.setLendingPoolParametersProvider(
      parametersProvider.address
    )
  );

  const parametersProviderProxy = await getLendingPoolParameterProxy(
    await addressesProvider.getLendingPoolParametersProvider()
  );
  await insertContractAddressInDb(
    eContractid.LendingPoolConfigurator,
    parametersProviderProxy.address
  );

  //config
  const lendingPoolConfiguratorImpl = await deployLendingPoolConfigurator();
  await waitForTx(
    await addressesProvider.setLendingPoolConfiguratorImpl(
      lendingPoolConfiguratorImpl.address
    )
  );
  //console.log("normal:  ", lendingPoolConfiguratorImpl.address);
  const lendingPoolConfiguratorProxy = await getLendingPoolConfiguratorProxy(
    await addressesProvider.getLendingPoolConfigurator()
  );
  await insertContractAddressInDb(
    eContractid.LendingPoolConfigurator,
    lendingPoolConfiguratorProxy.address
  );
  //console.log("proxy:  ", lendingPoolConfiguratorProxy.address);
  //

  //core
  const lib = await deployAaveLibraries();

  const lendingCoreImpl = await deployLendingPoolCore(lib);

  await waitForTx(
    await addressesProvider.setLendingPoolCoreImpl(lendingCoreImpl.address)
  );

  const lendingCoreAddress = await addressesProvider.getLendingPoolCore();
  const lendingCoreProxy = await getLendingPoolCoreProxy(lendingCoreAddress);

  await insertContractAddressInDb(
    eContractid.LendingPoolCore,
    lendingCoreProxy.address
  );

  //Data Provider
  const dataProvider = await deployLengindPoolDataProvider(
    addressesProvider.address
  );

  await waitForTx(
    await addressesProvider.setLendingPoolDataProviderImpl(dataProvider.address)
  );

  const dataProviderProxy = await getLendingPoolDataProviderProxy(
    await addressesProvider.getLendingPoolDataProvider()
  );

  await insertContractAddressInDb(
    eContractid.AaveProtocolDataProvider,
    dataProviderProxy.address
  );

  //liquidation

  const liq = await deployLendingPoolCollateralManager();
  await waitForTx(
    await addressesProvider.setLendingPoolLiquidationManager(liq.address)
  );

  //LP

  const lendingPoolImpl = await deployLendingPool();

  await waitForTx(
    await addressesProvider.setLendingPoolImpl(lendingPoolImpl.address)
  );

  const lendingPoolAddress = await addressesProvider.getLendingPool();
  const lendingPoolProxy = await getLendingPoolProxy(lendingPoolAddress);

  await insertContractAddressInDb(
    eContractid.LendingPool,
    lendingPoolProxy.address
  );

  //price oracle

  const fallbackOracle = await deployPriceOracle();
  await waitForTx(await fallbackOracle.setEthUsdPrice(MOCK_USD_PRICE_IN_WEI));
  await waitForTx(
    await addressesProvider.setPriceOracle(fallbackOracle.address)
  );

  const lendingRateOracle = await deployLendingRateOracle();

  await waitForTx(
    await addressesProvider.setLendingRateOracle(lendingRateOracle.address)
  );

  const reservesParams = getReservesConfigByPool(AavePools.proto);

  const admin = await deployer.getAddress();

  console.log("Initialize configuration");

  //Interest
  //deploy dai
  await deployMockDAI();
  const dai = await getMockDAI();
  const daiInterest = await deployDefaultReserveInterestRateStrategy(
    [
      dai.address,
      addressesProvider.address,
      "10000000000000000000000000",
      "70000000000000000000000000",
      "1500000000000000000000000000",
      "60000000000000000000000000",
      "1500000000000000000000000000",
    ],
    false
  );

  await lendingPoolConfiguratorProxy.initReserve(
    dai.address,
    18,
    daiInterest.address
  );
  console.log("DAI daiInterest ", daiInterest.address);
  await lendingPoolConfiguratorProxy.activateReserve(dai.address);
  await lendingPoolConfiguratorProxy.enableBorrowingOnReserve(
    dai.address,
    true
  );
  await lendingPoolConfiguratorProxy.enableReserveAsCollateral(
    dai.address,
    "70",
    "80",
    "110"
  );
  await lendingPoolConfiguratorProxy.enableReserveStableBorrowRate(dai.address);

  const ethInterest = await deployDefaultReserveInterestRateStrategy(
    [
      ETHEREUM_ADDRESS,
      addressesProvider.address,
      "0",
      "80000000000000000000000000",
      "1000000000000000000000000000",
      "100000000000000000000000000",
      "1000000000000000000000000000",
    ],
    false
  );

  await lendingPoolConfiguratorProxy.initReserveWithData(
    ETHEREUM_ADDRESS,
    "mETH",
    "mETH",
    18,
    ethInterest.address
  );
  await lendingPoolConfiguratorProxy.activateReserve(ETHEREUM_ADDRESS);
  await lendingPoolConfiguratorProxy.enableBorrowingOnReserve(
    ETHEREUM_ADDRESS,
    true
  );
  await lendingPoolConfiguratorProxy.enableReserveAsCollateral(
    ETHEREUM_ADDRESS,
    "70",
    "80",
    "110"
  );
  await lendingPoolConfiguratorProxy.enableReserveStableBorrowRate(
    ETHEREUM_ADDRESS
  );

  await lendingPoolConfiguratorProxy.refreshLendingPoolCoreConfiguration();

  const daiReserve = await dataProviderProxy.getReserveData(dai.address);

  await insertContractAddressInDb(
    eContractid.aDAI,
    daiReserve.bMXXTokenAddress
  );

  const ethReserve = await dataProviderProxy.getReserveData(ETHEREUM_ADDRESS);

  await insertContractAddressInDb(
    eContractid.mETH,
    ethReserve.bMXXTokenAddress
  );

  //staking address

  await deployMintableErc20(["stkMXX", "stkMXX", "18"]);

  const stkMXX = await getMintableErc20();

  await waitForTx(await addressesProvider.setStakingToken(stkMXX.address));

  //deploy reward manager
  await deployRewardManager(addressesProvider.address);

  const rewardsManager = await getRewardManager();
  await waitForTx(
    await addressesProvider.setRewardManager(rewardsManager.address)
  );

  //deploy 3 vaults
  await deployRewardVault(rewardsManager.address, eContractid.RewardVault1);
  await deployRewardVault(rewardsManager.address, eContractid.RewardVault2);
  await deployRewardVault(rewardsManager.address, eContractid.RewardVault3);

  //register reward
  await waitForTx(await lendingPoolProxy.registerAllPoolsForReward());

  await deployWalletBalancerProvider(addressesProvider.address);

  await waitForTx(
    await fallbackOracle.setAssetPrice(dai.address, "50000000000000000") //0.05 BNB
  );
  await waitForTx(
    await fallbackOracle.setAssetPrice(ETHEREUM_ADDRESS, "1000000000000000000") //1 BNB
  );
  // console.log(
  //   "dai price:",
  //   (await fallbackOracle.getAssetPrice(dai.address)).toString()
  // );
  //fallbackOracle.getAssetPrice()

  const mockFlashLoanReceiver = await deployMockFlashLoanReceiver(
    addressesProvider.address
  );
  await insertContractAddressInDb(
    eContractid.MockFlashLoanReceiver,
    mockFlashLoanReceiver.address
  );

  await waitForTx(
    await lendingRateOracle.setMarketBorrowRate(
      ETHEREUM_ADDRESS,
      "10000000000000000"
    )
  );

  await waitForTx(
    await lendingRateOracle.setMarketBorrowRate(
      dai.address,
      "10000000000000000"
    )
  );

  await waitForTx(
    await lendingRateOracle.setMarketLiquidityRate(
      dai.address,
      "10000000000000000"
    )
  );

  await waitForTx(
    await lendingRateOracle.setMarketLiquidityRate(
      ETHEREUM_ADDRESS,
      "10000000000000000"
    )
  );

  console.timeEnd("setup");
};

before(async () => {
  await rawBRE.run("set-DRE");
  const [deployer, secondaryWallet] = await getEthersSigners();
  const MAINNET_FORK = process.env.MAINNET_FORK === "true";

  if (MAINNET_FORK) {
    await rawBRE.run("aave:mainnet");
  } else {
    console.log("-> Deploying test environment...");
    await buildTestEnv(deployer, secondaryWallet);
  }

  console.log("initializeMakeSuite");
  await initializeMakeSuite();
  console.log("\n***************");
  console.log("Setup and snapshot finished");
  console.log("***************\n");
});

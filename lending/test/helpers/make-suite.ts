import { eContractid } from "./../../helpers/types";
import { getErc20, getMERC20 } from "./../../helpers/contracts-getters";
import { evmRevert, evmSnapshot, DRE } from "../../helpers/misc-utils";
import { Signer } from "ethers";
import {
  getLendingPoolAddressesProvider,
  getAaveProtocolDataProvider,
  getLendingPoolConfiguratorProxy,
  getPriceOracle,
  getLendingPoolCoreProxy,
  getFeeProvider,
  getLendingRateOracle,
  getMockDAI,
  getMDAI,
  getLendingPoolProxy,
  getMETH,
  getRewardManager,
  //getLendingPoolAddressesProviderRegistry,
  //getWETHMocked,
  //getWETHGateway,
} from "../../helpers/contracts-getters";
import {
  eEthereumNetwork,
  tEthereumAddress,
  IReserveParams,
  eContractid,
} from "../../helpers/types";
import { LendingPool } from "../../types/LendingPool";
import { LendingPoolDataProvider } from "../../types/LendingPoolDataProvider";
import { MintableERC20 } from "../../types/MintableERC20";
import { MToken } from "../../types/MToken";
import { LendingPoolConfigurator } from "../../types/LendingPoolConfigurator";

import chai from "chai";
// @ts-ignore
import bignumberChai from "chai-bignumber";
import { almostEqual } from "./almost-equal";
import { PriceOracle } from "../../types/PriceOracle";
import { LendingPoolAddressesProvider } from "../../types/LendingPoolAddressesProvider";
import {
  getEthersSigners,
  getParamPerNetwork,
} from "../../helpers/contracts-helpers";
import { solidity } from "ethereum-waffle";
import { AaveConfig } from "../../markets/aave";
import { strategyDAI } from "../../markets/aave/reservesConfigs";
import {
  FeeProvider,
  LendingPoolCore,
  LendingPoolLiquidationManager,
  LendingRateOracle,
  MockDAI,
  MockDAIFactory,
  RewardsManager,
} from "../../types";

chai.use(bignumberChai());
chai.use(almostEqual());
chai.use(solidity);

export interface SignerWithAddress {
  signer: Signer;
  address: tEthereumAddress;
}

export interface TestEnv {
  deployer: SignerWithAddress;
  users: SignerWithAddress[];
  pool: LendingPool;
  configurator: LendingPoolConfigurator;
  oracle: PriceOracle;
  rateOracle: LendingRateOracle;
  dai: MintableERC20;
  usdc: MintableERC20;
  aave: MintableERC20;
  addressesProvider: LendingPoolAddressesProvider;
  core: LendingPoolCore;
  feeProvider: FeeProvider;
  liqManager: LendingPoolLiquidationManager;
  dataProvider: LendingPoolDataProvider;
  mDAI: MToken;
  mETH: MToken;
  mUSDC: MToken;
  rewardMgr: RewardsManager;
  getReservesParams: () => { [symbol: string]: IReserveParams };
}

let buidlerevmSnapshotId: string = "0x1";
const setBuidlerevmSnapshotId = (id: string) => {
  if (DRE.network.name === "hardhat") {
    buidlerevmSnapshotId = id;
  }
};

const testEnv: TestEnv = {
  deployer: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
  pool: {} as LendingPool,
  configurator: {} as LendingPoolConfigurator,
  oracle: {} as PriceOracle,
  rateOracle: {} as LendingRateOracle,
  dai: {} as MintableERC20,
  usdc: {} as MintableERC20,
  aave: {} as MintableERC20,
  addressesProvider: {} as LendingPoolAddressesProvider,
  core: {} as LendingPoolCore,
  feeProvider: {} as FeeProvider,
  liqManager: {} as LendingPoolLiquidationManager,
  dataProvider: {} as LendingPoolDataProvider,
  mDAI: {} as MToken,
  mETH: {} as MToken,
  mUSDC: {} as MToken,
  rewardMgr: {} as RewardsManager,
  getReservesParams: () => ({} as { [symbol: string]: IReserveParams }),
} as TestEnv;

export async function initializeMakeSuite() {
  const [_deployer, ...restSigners] = await getEthersSigners();
  const deployer: SignerWithAddress = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };

  for (const signer of restSigners) {
    testEnv.users.push({
      signer,
      address: await signer.getAddress(),
    });
  }
  testEnv.deployer = deployer;
  testEnv.pool = await getLendingPoolProxy();

  testEnv.configurator = await getLendingPoolConfiguratorProxy();

  testEnv.addressesProvider = await getLendingPoolAddressesProvider();

  testEnv.core = await getLendingPoolCoreProxy();

  testEnv.dataProvider = await getAaveProtocolDataProvider();

  testEnv.feeProvider = await getFeeProvider();

  testEnv.rateOracle = await getLendingRateOracle();

  if (process.env.MAINNET_FORK === "true") {
    // testEnv.registry = await getLendingPoolAddressesProviderRegistry(
    //   getParamPerNetwork(AaveConfig.ProviderRegistry, eEthereumNetwork.main)
    // );
  } else {
    //testEnv.registry = await getLendingPoolAddressesProviderRegistry();
    testEnv.oracle = await getPriceOracle();
  }

  //testEnv.helpersContract = await getAaveProtocolDataProvider();

  // const allTokens = await testEnv.helpersContract.getAllATokens();
  // const aDaiAddress = allTokens.find((aToken) => aToken.symbol === 'aDAI')?.tokenAddress;

  // const aWEthAddress = allTokens.find((aToken) => aToken.symbol === 'aWETH')?.tokenAddress;

  // const reservesTokens = await testEnv.helpersContract.getAllReservesTokens();

  // const daiAddress = reservesTokens.find((token) => token.symbol === 'DAI')?.tokenAddress;
  // const usdcAddress = reservesTokens.find((token) => token.symbol === 'USDC')?.tokenAddress;
  // const aaveAddress = reservesTokens.find((token) => token.symbol === 'AAVE')?.tokenAddress;
  // const wethAddress = reservesTokens.find((token) => token.symbol === 'WETH')?.tokenAddress;

  // if (!aDaiAddress || !aWEthAddress) {
  //   process.exit(1);
  // }
  // if (!daiAddress || !usdcAddress || !aaveAddress || !wethAddress) {
  //   process.exit(1);
  // }

  // testEnv.aDai = await getAToken(aDaiAddress);
  // testEnv.aWETH = await getAToken(aWEthAddress);

  // testEnv.dai = await getMintableERC20(daiAddress);
  // testEnv.usdc = await getMintableERC20(usdcAddress);
  // testEnv.aave = await getMintableERC20(aaveAddress);
  // testEnv.weth = await getWETHMocked(wethAddress);
  // testEnv.wethGateway = await getWETHGateway();
  testEnv.dai = await getMockDAI();
  testEnv.mDAI = await getMDAI();
  testEnv.mETH = await getMETH();
  testEnv.usdc = await getErc20(eContractid.MockUSDC);
  testEnv.mUSDC = await getMERC20(eContractid.aUSDC);
  testEnv.rewardMgr = await getRewardManager();
  testEnv.getReservesParams = () => AaveConfig.ReservesConfig;
}

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    before(async () => {
      setBuidlerevmSnapshotId(await evmSnapshot());
    });
    tests(testEnv);
    after(async () => {
      await evmRevert(buidlerevmSnapshotId);
    });
  });
}

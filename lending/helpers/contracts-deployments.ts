import { BigNumberish, Contract } from "ethers";
import { DRE } from "./misc-utils";
import {
  tEthereumAddress,
  eContractid,
  tStringTokenSmallUnits,
  AavePools,
  TokenContractId,
  iMultiPoolsAssets,
  IReserveParams,
  PoolConfiguration,
  eEthereumNetwork,
} from "./types";

import { MintableERC20 } from "../types/MintableErc20";
import { MockContract } from "ethereum-waffle";
import { getReservesConfigByPool } from "./configuration";
import { getFirstSigner } from "./contracts-getters";
import { ZERO_ADDRESS } from "./constants";
import {
  LendingPoolDataProviderFactory,
  MTokenFactory,
  // ATokensAndRatesHelperFactory,
  //AaveOracleFactory,
  DefaultReserveInterestRateStrategyFactory,
  //DelegationAwareATokenFactory,
  InitializableAdminUpgradeabilityProxyFactory,
  LendingPoolAddressesProviderFactory,
  //LendingPoolAddressesProviderRegistryFactory,
  LendingPoolLiquidationManagerFactory,
  LendingPoolConfiguratorFactory,
  LendingPoolFactory,
  LendingRateOracleFactory,
  //MintableDelegationERC20Factory,
  MintableERC20Factory,
  //MockAggregatorFactory,
  //MockATokenFactory,
  MockFlashLoanReceiverFactory,
  //MockStableDebtTokenFactory,
  //MockVariableDebtTokenFactory,
  PriceOracleFactory,
  //ReserveLogicFactory,
  //SelfdestructTransferFactory,
  //StableDebtTokenFactory,
  //VariableDebtTokenFactory,
  WalletBalanceProviderFactory,
  LendingPoolCoreFactory,
  LendingPoolParametersProviderFactory,
  FeeProviderFactory,
  MockDAIFactory,
  RewardsManagerFactory,
  IRewardVaultFactory,
  RewardVaultFactory,
  RewardVault,
  MockUSDCFactory,
  LendingPoolLiquidationManager,
  MockUSDT,
  MockUSDC,
  //WETH9MockedFactory,
  //WETHGatewayFactory,
  //StableAndVariableTokensHelperFactory,
} from "../types";
import {
  withSaveAndVerify,
  registerContractInJsonDb,
  linkBytecode,
  insertContractAddressInDb,
} from "./contracts-helpers";
//import { StableAndVariableTokensHelperFactory } from '../types/StableAndVariableTokensHelperFactory';
///import { MintableDelegationERC20 } from '../types/MintableDelegationERC20';
import { readArtifact as buidlerReadArtifact } from "@nomiclabs/buidler/plugins";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { LendingPoolCoreLibraryAddresses } from "../types/factories/LendingPoolCoreFactory";

const readArtifact = async (id: string) => {
  if (DRE.network.name === eEthereumNetwork.buidlerevm) {
    return buidlerReadArtifact(DRE.config.paths.artifacts, id);
  }
  return (DRE as HardhatRuntimeEnvironment).artifacts.readArtifact(id);
};
export const deployLendingPoolAddressesProvider = async (
  marketId: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new LendingPoolAddressesProviderFactory(
      await getFirstSigner()
    ).deploy(),
    eContractid.LendingPoolAddressesProvider,
    [marketId],
    verify
  );

// export const deployLendingPoolAddressesProviderRegistry = async (verify?: boolean) =>
//   withSaveAndVerify(
//     await new LendingPoolAddressesProviderRegistryFactory(await getFirstSigner()).deploy(),
//     eContractid.LendingPoolAddressesProviderRegistry,
//     [],
//     verify
//   );

export const deployLendingPoolConfigurator = async (verify?: boolean) => {
  const lendingPoolConfiguratorImpl = await new LendingPoolConfiguratorFactory(
    await getFirstSigner()
  ).deploy();
  await insertContractAddressInDb(
    eContractid.LendingPoolConfiguratorImpl,
    lendingPoolConfiguratorImpl.address
  );
  return withSaveAndVerify(
    lendingPoolConfiguratorImpl,
    eContractid.LendingPoolConfigurator,
    [],
    verify
  );
};

// export const deployReserveLogicLibrary = async (verify?: boolean) =>
//   withSaveAndVerify(
//     await new ReserveLogicFactory(await getFirstSigner()).deploy(),
//     eContractid.ReserveLogic,
//     [],
//     verify
//   );

export const deployGenericLogic = async (
  reserveLogic: Contract,
  verify?: boolean
) => {
  const genericLogicArtifact = await readArtifact(eContractid.GenericLogic);

  const linkedGenericLogicByteCode = linkBytecode(genericLogicArtifact, {
    [eContractid.ReserveLogic]: reserveLogic.address,
  });

  const genericLogicFactory = await DRE.ethers.getContractFactory(
    genericLogicArtifact.abi,
    linkedGenericLogicByteCode
  );

  const genericLogic = await (await genericLogicFactory.deploy()).deployed();
  return withSaveAndVerify(genericLogic, eContractid.GenericLogic, [], verify);
};

export const deployValidationLogic = async (
  reserveLogic: Contract,
  genericLogic: Contract,
  verify?: boolean
) => {
  const validationLogicArtifact = await readArtifact(
    eContractid.ValidationLogic
  );

  const linkedValidationLogicByteCode = linkBytecode(validationLogicArtifact, {
    [eContractid.ReserveLogic]: reserveLogic.address,
    [eContractid.GenericLogic]: genericLogic.address,
  });

  const validationLogicFactory = await DRE.ethers.getContractFactory(
    validationLogicArtifact.abi,
    linkedValidationLogicByteCode
  );

  const validationLogic = await (
    await validationLogicFactory.deploy()
  ).deployed();

  return withSaveAndVerify(
    validationLogic,
    eContractid.ValidationLogic,
    [],
    verify
  );
};

export const deployAaveLibraries = async (
  verify?: boolean
): Promise<LendingPoolCoreLibraryAddresses> => {
  // const reserveLogic = await deployReserveLogicLibrary(verify);
  // const genericLogic = await deployGenericLogic(reserveLogic, verify);
  // const validationLogic = await deployValidationLogic(reserveLogic, genericLogic, verify);

  // Hardcoded solidity placeholders, if any library changes path this will fail.
  // The '__$PLACEHOLDER$__ can be calculated via solidity keccak, but the LendingPoolLibraryAddresses Type seems to
  // require a hardcoded string.
  //
  //  how-to:
  //  1. PLACEHOLDER = solidityKeccak256(['string'], `${libPath}:${libName}`).slice(2, 36)
  //  2. LIB_PLACEHOLDER = `__$${PLACEHOLDER}$__`
  // or grab placeholdes from LendingPoolLibraryAddresses at Typechain generation.
  //
  // libPath example: contracts/libraries/logic/GenericLogic.sol
  // libName example: GenericLogic
  const reserveLogic = await deployGenericLogic1(verify);
  return {
    ["__$2ec35834968386f54fa313129cf94664e4$__"]: reserveLogic.address,
  };
};

export const deployGenericLogic1 = async (verify?: boolean) => {
  //const genericLogicArtifact = await readArtifact("contracts/libraries/CoreLibrary.sol:CoreLibrary");
  //console.log(genericLogicArtifact);
  const genericLogicFactory = await DRE.ethers.getContractFactory(
    eContractid.CoreLibrary
  );
  //console.log(genericLogicArtifact.abi);

  const genericLogic = await (await genericLogicFactory.deploy()).deployed();
  return withSaveAndVerify(genericLogic, eContractid.CoreLibrary, [], verify);
};

export const deployLendingPool = async (verify?: boolean) => {
  //const libraries = await deployAaveLibraries(verify);
  const lendingPoolImpl = await new LendingPoolFactory(
    await getFirstSigner()
  ).deploy();
  await insertContractAddressInDb(
    eContractid.LendingPoolImpl,
    lendingPoolImpl.address
  );
  return withSaveAndVerify(
    lendingPoolImpl,
    eContractid.LendingPool,
    [],
    verify
  );
};

export const deployPriceOracle = async (verify?: boolean) =>
  withSaveAndVerify(
    await new PriceOracleFactory(await getFirstSigner()).deploy(),
    eContractid.PriceOracle,
    [],
    verify
  );

export const deployLendingRateOracle = async (verify?: boolean) =>
  withSaveAndVerify(
    await new LendingRateOracleFactory(await getFirstSigner()).deploy(),
    eContractid.LendingRateOracle,
    [],
    verify
  );

// export const deployMockAggregator = async (price: tStringTokenSmallUnits, verify?: boolean) =>
//   withSaveAndVerify(
//     await new MockAggregatorFactory(await getFirstSigner()).deploy(price),
//     eContractid.MockAggregator,
//     [price],
//     verify
//   );

// export const deployAaveOracle = async (
//   args: [tEthereumAddress[], tEthereumAddress[], tEthereumAddress, tEthereumAddress],
//   verify?: boolean
// ) =>
//   withSaveAndVerify(
//     await new AaveOracleFactory(await getFirstSigner()).deploy(...args),
//     eContractid.AaveOracle,
//     args,
//     verify
//   );

export const deployLendingPoolLiquidationManager = async (
  verify?: boolean
): Promise<LendingPoolLiquidationManager> => {
  const collateralManagerImpl = await new LendingPoolLiquidationManagerFactory(
    await getFirstSigner()
  ).deploy();
  await insertContractAddressInDb(
    eContractid.LendingPoolLiquidationManager,
    collateralManagerImpl.address
  );
  return withSaveAndVerify(
    collateralManagerImpl,
    eContractid.LendingPoolLiquidationManager,
    [],
    verify
  );
};

export const deployLendingPoolCore = async (
  addressLib: LendingPoolCoreLibraryAddresses,
  verify?: boolean
) => {
  const collateralManagerImpl = await new LendingPoolCoreFactory(
    addressLib,
    await getFirstSigner()
  ).deploy();
  await insertContractAddressInDb(
    eContractid.LendingPoolCoreImpl,
    collateralManagerImpl.address
  );
  return withSaveAndVerify(
    collateralManagerImpl,
    eContractid.LendingPoolCoreImpl,
    [],
    verify
  );
};

export const deployLendingPoolParameter = async (verify?: boolean) => {
  const collateralManagerImpl = await new LendingPoolParametersProviderFactory(
    await getFirstSigner()
  ).deploy();
  await insertContractAddressInDb(
    eContractid.LendingPoolParameterImpl,
    collateralManagerImpl.address
  );
  return withSaveAndVerify(
    collateralManagerImpl,
    eContractid.LendingPoolParametersProvider,
    [],
    verify
  );
};

export const deployFeeProvider = async (verify?: boolean) => {
  const collateralManagerImpl = await new FeeProviderFactory(
    await getFirstSigner()
  ).deploy();
  await insertContractAddressInDb(
    eContractid.FeeProviderImpl,
    collateralManagerImpl.address
  );
  // return withSaveAndVerify(
  //   collateralManagerImpl,
  //   eContractid.FeeProvider,
  //   [],
  //   verify
  // );
  return collateralManagerImpl;
};

export const deployInitializableAdminUpgradeabilityProxy = async (
  verify?: boolean
) =>
  withSaveAndVerify(
    await new InitializableAdminUpgradeabilityProxyFactory(
      await getFirstSigner()
    ).deploy(),
    eContractid.InitializableAdminUpgradeabilityProxy,
    [],
    verify
  );

export const deployMockFlashLoanReceiver = async (
  addressesProvider: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new MockFlashLoanReceiverFactory(await getFirstSigner()).deploy(
      addressesProvider
    ),
    eContractid.MockFlashLoanReceiver,
    [addressesProvider],
    verify
  );

export const deployWalletBalancerProvider = async (
  addressesProvider: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new WalletBalanceProviderFactory(await getFirstSigner()).deploy(
      addressesProvider
    ),
    eContractid.WalletBalanceProvider,
    [],
    verify
  );

export const deployLengindPoolDataProvider = async (
  addressesProvider: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new LendingPoolDataProviderFactory(await getFirstSigner()).deploy(),
    eContractid.LendingPoolDataProvider,
    [addressesProvider],
    verify
  );

export const deployMintableErc20 = async (
  args: [string, string, string],
  verify?: boolean
): Promise<MintableERC20> =>
  withSaveAndVerify(
    await new MintableERC20Factory(await getFirstSigner()).deploy(),
    eContractid.MintableErc20,
    args,
    verify
  );

// export const deployMintableDelegationERC20 = async (
//   args: [string, string, string],
//   verify?: boolean
// ): Promise<MintableDelegationERC20> =>
//   withSaveAndVerify(
//     await new MintableDelegationERC20Factory(await getFirstSigner()).deploy(...args),
//     eContractid.MintableDelegationERC20,
//     args,
//     verify
//   );
export const deployDefaultReserveInterestRateStrategy = async (
  args: [tEthereumAddress, string, string, string, string, string, string],
  verify: boolean
) =>
  withSaveAndVerify(
    await new DefaultReserveInterestRateStrategyFactory(
      await getFirstSigner()
    ).deploy(...args),
    eContractid.DefaultReserveInterestRateStrategy,
    args,
    verify
  );

// export const deployStableDebtToken = async (
//   args: [tEthereumAddress, tEthereumAddress, string, string, tEthereumAddress],
//   verify: boolean
// ) =>
//   withSaveAndVerify(
//     await new StableDebtTokenFactory(await getFirstSigner()).deploy(...args),
//     eContractid.StableDebtToken,
//     args,
//     verify
//   );

// export const deployVariableDebtToken = async (
//   args: [tEthereumAddress, tEthereumAddress, string, string, tEthereumAddress],
//   verify: boolean
// ) =>
//   withSaveAndVerify(
//     await new VariableDebtTokenFactory(await getFirstSigner()).deploy(...args),
//     eContractid.VariableDebtToken,
//     args,
//     verify
//   );

// export const deployGenericAToken = async (
//   [poolAddress, underlyingAssetAddress, treasuryAddress, name, symbol,incentivesController]: [
//     tEthereumAddress,
//     tEthereumAddress,
//     tEthereumAddress,
//     string,
//     string,
//     tEthereumAddress
//   ],
//   verify: boolean
// ) => {
//   const args: [
//     tEthereumAddress,
//     tEthereumAddress,
//     string,
//     string,
//     tEthereumAddress,
//     tEthereumAddress

//   ] = [poolAddress, underlyingAssetAddress, treasuryAddress, name, symbol, incentivesController];
//   return withSaveAndVerify(
//     await new MTokenFactory(await getFirstSigner()).deploy(...args),
//     eContractid.AToken,
//     args,
//     verify
//   );
// };

// export const deployDelegationAwareAToken = async (
//   [poolAddress, underlyingAssetAddress, treasuryAddress, name, symbol, incentivesController]: [
//     tEthereumAddress,
//     tEthereumAddress,
//     tEthereumAddress,
//     string,
//     string,
//     tEthereumAddress
//   ],
//   verify: boolean
// ) => {
//   const args: [
//     tEthereumAddress,
//     tEthereumAddress,
//     string,
//     string,
//     tEthereumAddress,
//     tEthereumAddress
//   ] = [poolAddress, underlyingAssetAddress, treasuryAddress, name, symbol, incentivesController];

//   return withSaveAndVerify(
//     await new DelegationAwareATokenFactory(await getFirstSigner()).deploy(...args),
//     eContractid.DelegationAwareAToken,
//     args,
//     verify
//   );
// };

export const deployAllMockTokens = async (verify?: boolean) => {
  const tokens: { [symbol: string]: MockContract | MintableERC20 } = {};

  const protoConfigData = getReservesConfigByPool(AavePools.proto);

  for (const tokenSymbol of Object.keys(TokenContractId)) {
    let decimals = "18";

    let configData = (<any>protoConfigData)[tokenSymbol];

    tokens[tokenSymbol] = await deployMintableErc20(
      [
        tokenSymbol,
        tokenSymbol,
        configData ? configData.reserveDecimals : decimals,
      ],
      verify
    );
  }
  return tokens;
};

export const deployMockTokens = async (
  config: PoolConfiguration,
  verify?: boolean
) => {
  const tokens: { [symbol: string]: MockContract | MintableERC20 } = {};
  const defaultDecimals = 18;

  const configData = config.ReservesConfig;

  for (const tokenSymbol of Object.keys(configData)) {
    tokens[tokenSymbol] = await deployMintableErc20(
      [
        tokenSymbol,
        tokenSymbol,
        configData[tokenSymbol as keyof iMultiPoolsAssets<IReserveParams>]
          .reserveDecimals || defaultDecimals.toString(),
      ],
      verify
    );
    await registerContractInJsonDb(
      tokenSymbol.toUpperCase(),
      tokens[tokenSymbol]
    );
  }
  return tokens;
};

// export const deployStableAndVariableTokensHelper = async (
//   args: [tEthereumAddress, tEthereumAddress],
//   verify?: boolean
// ) =>
//   withSaveAndVerify(
//     await new StableAndVariableTokensHelperFactory(await getFirstSigner()).deploy(...args),
//     eContractid.StableAndVariableTokensHelper,
//     args,
//     verify
//   );

// export const deployATokensAndRatesHelper = async (
//   args: [tEthereumAddress, tEthereumAddress, tEthereumAddress],
//   verify?: boolean
// ) =>
//   withSaveAndVerify(
//     await new ATokensAndRatesHelperFactory(await getFirstSigner()).deploy(...args),
//     eContractid.ATokensAndRatesHelper,
//     args,
//     verify
//   );

// export const deployWETHGateway = async (
//   args: [tEthereumAddress, tEthereumAddress],
//   verify?: boolean
// ) =>
//   withSaveAndVerify(
//     await new WETHGatewayFactory(await getFirstSigner()).deploy(...args),
//     eContractid.WETHGateway,
//     args,
//     verify
//   );

// export const deployMockStableDebtToken = async (
//   args: [tEthereumAddress, tEthereumAddress, string, string, tEthereumAddress],
//   verify?: boolean
// ) =>
//   withSaveAndVerify(
//     await new MockStableDebtTokenFactory(await getFirstSigner()).deploy(...args),
//     eContractid.MockStableDebtToken,
//     args,
//     verify
//   );

// export const deployWETHMocked = async (verify?: boolean) =>
//   withSaveAndVerify(
//     await new WETH9MockedFactory(await getFirstSigner()).deploy(),
//     eContractid.WETHMocked,
//     [],
//     verify
//   );

// export const deployMockVariableDebtToken = async (
//   args: [tEthereumAddress, tEthereumAddress, string, string, tEthereumAddress],
//   verify?: boolean
// ) =>
//   withSaveAndVerify(
//     await new MockVariableDebtTokenFactory(await getFirstSigner()).deploy(...args),
//     eContractid.MockVariableDebtToken,
//     args,
//     verify
//   );

// export const deployMockAToken = async (
//   args: [tEthereumAddress, tEthereumAddress, tEthereumAddress, string, string, tEthereumAddress],
//   verify?: boolean
// ) =>
//   withSaveAndVerify(
//     await new MockATokenFactory(await getFirstSigner()).deploy(...args),
//     eContractid.MockAToken,
//     args,
//     verify
//   );

// export const deploySelfdestructTransferMock = async (verify?: boolean) =>
//   withSaveAndVerify(
//     await new SelfdestructTransferFactory(await getFirstSigner()).deploy(),
//     eContractid.SelfdestructTransferMock,
//     [],
//     verify
//   );

export const deployRewardManager = async (
  address: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new RewardsManagerFactory(await getFirstSigner()).deploy(address),
    eContractid.RewardsManager,
    [],
    verify
  );

export const deployRewardVault = async (
  id: string,
  verify?: boolean
): Promise<RewardVault> => {
  return withSaveAndVerify(
    await new RewardVaultFactory(await getFirstSigner()).deploy(),
    id,
    [],
    verify
  );
};

export const deployMDAI = async (
  args: [tEthereumAddress, string, BigNumberish, string, string],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new MTokenFactory(await getFirstSigner()).deploy(...args),
    eContractid.aDAI,
    [],
    verify
  );

export const deployMockDAI = async (verify?: boolean) =>
  withSaveAndVerify(
    await new MockDAIFactory(await getFirstSigner()).deploy(),
    eContractid.MockDAI,
    [],
    verify
  );

export const deployMockUSDC = async (verify?: boolean): Promise<MockUSDC> => {
  return withSaveAndVerify(
    await new MockUSDCFactory(await getFirstSigner()).deploy(),
    eContractid.MockUSDC,
    [],
    verify
  );
};

export const deployMintableErc20WithId = async (
  id: string,
  args: [string, string, string],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new MintableERC20Factory(await getFirstSigner()).deploy(),
    id,
    args,
    verify
  );

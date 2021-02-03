import { ReserveData, UserReserveData } from "./interfaces";
import BigNumber from "bignumber.js";
import { configuration } from "../actions";
import {
  getMockDAI,
  getLendingRateOracle,
  getMDAI,
} from "../../helpers/contracts-getters";
import { LendingPool } from "../../types/LendingPool";
import { LendingRateOracle } from "../../types/LendingRateOracle";
import { ETHEREUM_ADDRESS, NIL_ADDRESS } from "../../helpers/constants";
import { MockDAI } from "../../types/MockDAI";
import { LendingPoolCore } from "../../types/LendingPoolCore";
import { MToken } from "../../types/MToken";

export const getReserveData = async (
  poolInstance: LendingPool,
  reserve: string
): Promise<ReserveData> => {
  const data: any = await poolInstance.getReserveData(reserve);
  const rateOracle: LendingRateOracle = await getLendingRateOracle();

  const rate = await rateOracle.getMarketBorrowRate(reserve);

  const isBnbReserve = reserve === ETHEREUM_ADDRESS;
  let symbol = "ETH";
  let decimals = new BigNumber(18);
  if (!isBnbReserve) {
    const contractInstance: MockDAI = await getMockDAI();
    symbol = await contractInstance.symbol();
    decimals = new BigNumber((await contractInstance.decimals()).toString());
  }

  return {
    totalLiquidity: new BigNumber(data.totalLiquidity),
    availableLiquidity: new BigNumber(data.availableLiquidity),
    totalBorrowsStable: new BigNumber(data.totalBorrowsStable),
    totalBorrowsVariable: new BigNumber(data.totalBorrowsVariable),
    liquidityRate: new BigNumber(data.liquidityRate),
    variableBorrowRate: new BigNumber(data.variableBorrowRate),
    stableBorrowRate: new BigNumber(data.stableBorrowRate),
    averageStableBorrowRate: new BigNumber(data.averageStableBorrowRate),
    utilizationRate: new BigNumber(data.utilizationRate),
    liquidityIndex: new BigNumber(data.liquidityIndex),
    variableBorrowIndex: new BigNumber(data.variableBorrowIndex),
    lastUpdateTimestamp: new BigNumber(data.lastUpdateTimestamp),
    address: reserve,
    mTokenAddress: data.mTokenAddress,
    symbol,
    decimals,
    marketStableRate: new BigNumber(rate.toString()),
  };
};

export const getUserData = async (
  poolInstance: LendingPool,
  coreInstance: LendingPoolCore,
  reserve: string,
  user: string
): Promise<UserReserveData> => {
  const { web3 } = configuration;

  const [data, mTokenData] = await Promise.all([
    poolInstance.getUserReserveData(reserve, user),
    getmTokenUserData(reserve, user, coreInstance),
  ]);

  const [
    userIndex,
    redirectedBalance,
    principalmTokenBalance,
    redirectionAddressRedirectedBalance,
    interestRedirectionAddress,
  ] = mTokenData;

  let walletBalance;

  if (reserve === ETHEREUM_ADDRESS) {
    walletBalance = new BigNumber(await web3.eth.getBalance(user));
  } else {
    const reserveInstance: MockDAI = await getMockDAI();
    walletBalance = new BigNumber(
      (await reserveInstance.balanceOf(user)).toString()
    );
  }

  const userData: any = data;

  return {
    principalmTokenBalance: new BigNumber(principalmTokenBalance),
    interestRedirectionAddress,
    redirectionAddressRedirectedBalance: new BigNumber(
      redirectionAddressRedirectedBalance
    ),
    redirectedBalance: new BigNumber(redirectedBalance),
    currentmTokenUserIndex: new BigNumber(userIndex),
    currentmTokenBalance: new BigNumber(userData.currentmTokenBalance),
    currentBorrowBalance: new BigNumber(userData.currentBorrowBalance),
    principalBorrowBalance: new BigNumber(userData.principalBorrowBalance),
    borrowRateMode: userData.borrowRateMode.toString(),
    borrowRate: new BigNumber(userData.borrowRate),
    liquidityRate: new BigNumber(userData.liquidityRate),
    originationFee: new BigNumber(userData.originationFee),
    variableBorrowIndex: new BigNumber(userData.variableBorrowIndex),
    lastUpdateTimestamp: new BigNumber(userData.lastUpdateTimestamp),
    usageAsCollateralEnabled: userData.usageAsCollateralEnabled,
    walletBalance,
  };
};

export const getReserveAddressFromSymbol = async (symbol: string) => {
  if (symbol.toUpperCase() === "ETH") {
    return ETHEREUM_ADDRESS;
  }

  const contractName: string = "Mock" + symbol.toUpperCase();

  // const contractInstance: ERC20DetailedInstance = await getTruffleContractInstance(
  //   artifacts,
  //   <ContractId>contractName
  // );
  // ! HARD CODE TO GET MockDAI ONLY
  const contractInstance: MockDAI = await getMockDAI();

  if (!contractInstance) {
    throw `Could not find instance for contract ${contractName}`;
  }
  return contractInstance.address;
};

const getmTokenUserData = async (
  reserve: string,
  user: string,
  coreInstance: LendingPoolCore
) => {
  const mTokenAddress: string = await coreInstance.getReservemTokenAddress(
    reserve
  );

  const MToken: MToken = await getMDAI();
  const [
    userIndex,
    interestRedirectionAddress,
    redirectedBalance,
    principalTokenBalance,
  ] = await Promise.all([
    MToken.getUserIndex(user),
    MToken.getInterestRedirectionAddress(user),
    MToken.getRedirectedBalance(user),
    MToken.principalBalanceOf(user),
  ]);

  const redirectionAddressRedirectedBalance =
    interestRedirectionAddress !== NIL_ADDRESS
      ? new BigNumber(
          (
            await MToken.getRedirectedBalance(interestRedirectionAddress)
          ).toString()
        )
      : new BigNumber("0");

  return [
    userIndex.toString(),
    redirectedBalance.toString(),
    principalTokenBalance.toString(),
    redirectionAddressRedirectedBalance.toString(),
    interestRedirectionAddress,
  ];
};

/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface IReserveInterestRateStrategyInterface extends ethers.utils.Interface {
  functions: {
    "calculateInterestRates(address,uint256,uint256,uint256,uint256)": FunctionFragment;
    "getBaseVariableBorrowRate()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "calculateInterestRates",
    values: [string, BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getBaseVariableBorrowRate",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "calculateInterestRates",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBaseVariableBorrowRate",
    data: BytesLike
  ): Result;

  events: {};
}

export class IReserveInterestRateStrategy extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: IReserveInterestRateStrategyInterface;

  functions: {
    calculateInterestRates(
      _reserve: string,
      _utilizationRate: BigNumberish,
      _totalBorrowsStable: BigNumberish,
      _totalBorrowsVariable: BigNumberish,
      _averageStableBorrowRate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        liquidityRate: BigNumber;
        stableBorrowRate: BigNumber;
        variableBorrowRate: BigNumber;
      }
    >;

    "calculateInterestRates(address,uint256,uint256,uint256,uint256)"(
      _reserve: string,
      _utilizationRate: BigNumberish,
      _totalBorrowsStable: BigNumberish,
      _totalBorrowsVariable: BigNumberish,
      _averageStableBorrowRate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        liquidityRate: BigNumber;
        stableBorrowRate: BigNumber;
        variableBorrowRate: BigNumber;
      }
    >;

    getBaseVariableBorrowRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    "getBaseVariableBorrowRate()"(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  calculateInterestRates(
    _reserve: string,
    _utilizationRate: BigNumberish,
    _totalBorrowsStable: BigNumberish,
    _totalBorrowsVariable: BigNumberish,
    _averageStableBorrowRate: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      liquidityRate: BigNumber;
      stableBorrowRate: BigNumber;
      variableBorrowRate: BigNumber;
    }
  >;

  "calculateInterestRates(address,uint256,uint256,uint256,uint256)"(
    _reserve: string,
    _utilizationRate: BigNumberish,
    _totalBorrowsStable: BigNumberish,
    _totalBorrowsVariable: BigNumberish,
    _averageStableBorrowRate: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      liquidityRate: BigNumber;
      stableBorrowRate: BigNumber;
      variableBorrowRate: BigNumber;
    }
  >;

  getBaseVariableBorrowRate(overrides?: CallOverrides): Promise<BigNumber>;

  "getBaseVariableBorrowRate()"(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    calculateInterestRates(
      _reserve: string,
      _utilizationRate: BigNumberish,
      _totalBorrowsStable: BigNumberish,
      _totalBorrowsVariable: BigNumberish,
      _averageStableBorrowRate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        liquidityRate: BigNumber;
        stableBorrowRate: BigNumber;
        variableBorrowRate: BigNumber;
      }
    >;

    "calculateInterestRates(address,uint256,uint256,uint256,uint256)"(
      _reserve: string,
      _utilizationRate: BigNumberish,
      _totalBorrowsStable: BigNumberish,
      _totalBorrowsVariable: BigNumberish,
      _averageStableBorrowRate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        liquidityRate: BigNumber;
        stableBorrowRate: BigNumber;
        variableBorrowRate: BigNumber;
      }
    >;

    getBaseVariableBorrowRate(overrides?: CallOverrides): Promise<BigNumber>;

    "getBaseVariableBorrowRate()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    calculateInterestRates(
      _reserve: string,
      _utilizationRate: BigNumberish,
      _totalBorrowsStable: BigNumberish,
      _totalBorrowsVariable: BigNumberish,
      _averageStableBorrowRate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "calculateInterestRates(address,uint256,uint256,uint256,uint256)"(
      _reserve: string,
      _utilizationRate: BigNumberish,
      _totalBorrowsStable: BigNumberish,
      _totalBorrowsVariable: BigNumberish,
      _averageStableBorrowRate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBaseVariableBorrowRate(overrides?: CallOverrides): Promise<BigNumber>;

    "getBaseVariableBorrowRate()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    calculateInterestRates(
      _reserve: string,
      _utilizationRate: BigNumberish,
      _totalBorrowsStable: BigNumberish,
      _totalBorrowsVariable: BigNumberish,
      _averageStableBorrowRate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "calculateInterestRates(address,uint256,uint256,uint256,uint256)"(
      _reserve: string,
      _utilizationRate: BigNumberish,
      _totalBorrowsStable: BigNumberish,
      _totalBorrowsVariable: BigNumberish,
      _averageStableBorrowRate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBaseVariableBorrowRate(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getBaseVariableBorrowRate()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}

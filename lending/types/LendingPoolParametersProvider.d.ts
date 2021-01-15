/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction
} from "ethers";
import {
  Contract,
  ContractTransaction,
  CallOverrides
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface LendingPoolParametersProviderInterface
  extends ethers.utils.Interface {
  functions: {
    "getMaxStableRateBorrowSizePercent()": FunctionFragment;
    "getRebalanceDownRateDelta()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getMaxStableRateBorrowSizePercent",
    values?: void
  ): string;
  encodeFunctionData(
    functionFragment: "getRebalanceDownRateDelta",
    values?: void
  ): string;

  decodeFunctionResult(
    functionFragment: "getMaxStableRateBorrowSizePercent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRebalanceDownRateDelta",
    data: BytesLike
  ): Result;

  events: {};
}

export class LendingPoolParametersProvider extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: LendingPoolParametersProviderInterface;

  functions: {
    /**
     * returns the maximum stable rate borrow size, in percentage of the available liquidity.*
     */
    getMaxStableRateBorrowSizePercent(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    /**
     * returns the delta between the current stable rate and the user stable rate at which the borrow position of the user will be rebalanced (scaled down)*
     */
    getRebalanceDownRateDelta(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;
  };

  /**
   * returns the maximum stable rate borrow size, in percentage of the available liquidity.*
   */
  getMaxStableRateBorrowSizePercent(
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  /**
   * returns the delta between the current stable rate and the user stable rate at which the borrow position of the user will be rebalanced (scaled down)*
   */
  getRebalanceDownRateDelta(overrides?: CallOverrides): Promise<BigNumber>;

  staticCall: {
    /**
     * returns the maximum stable rate borrow size, in percentage of the available liquidity.*
     */
    getMaxStableRateBorrowSizePercent(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * returns the delta between the current stable rate and the user stable rate at which the borrow position of the user will be rebalanced (scaled down)*
     */
    getRebalanceDownRateDelta(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getMaxStableRateBorrowSizePercent(): Promise<BigNumber>;
    getRebalanceDownRateDelta(): Promise<BigNumber>;
  };

  populateTransaction: {
    getMaxStableRateBorrowSizePercent(): Promise<PopulatedTransaction>;
    getRebalanceDownRateDelta(): Promise<PopulatedTransaction>;
  };
}
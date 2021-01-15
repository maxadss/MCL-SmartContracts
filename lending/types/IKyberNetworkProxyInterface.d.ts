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
  PayableOverrides,
  CallOverrides
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface IKyberNetworkProxyInterfaceInterface extends ethers.utils.Interface {
  functions: {
    "maxGasPrice()": FunctionFragment;
    "getUserCapInWei(address)": FunctionFragment;
    "getUserCapInTokenWei(address,address)": FunctionFragment;
    "enabled()": FunctionFragment;
    "info(bytes32)": FunctionFragment;
    "getExpectedRate(address,address,uint256)": FunctionFragment;
    "tradeWithHint(address,uint256,address,address,uint256,uint256,address,bytes)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "maxGasPrice", values?: void): string;
  encodeFunctionData(
    functionFragment: "getUserCapInWei",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserCapInTokenWei",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "enabled", values?: void): string;
  encodeFunctionData(functionFragment: "info", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "getExpectedRate",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tradeWithHint",
    values: [
      string,
      BigNumberish,
      string,
      string,
      BigNumberish,
      BigNumberish,
      string,
      BytesLike
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "maxGasPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserCapInWei",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserCapInTokenWei",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "enabled", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "info", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getExpectedRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tradeWithHint",
    data: BytesLike
  ): Result;

  events: {};
}

export class IKyberNetworkProxyInterface extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: IKyberNetworkProxyInterfaceInterface;

  functions: {
    maxGasPrice(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    getUserCapInWei(
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    getUserCapInTokenWei(
      user: string,
      token: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    enabled(
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    info(
      id: BytesLike,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    getExpectedRate(
      src: string,
      dest: string,
      srcQty: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      expectedRate: BigNumber;
      slippageRate: BigNumber;
      0: BigNumber;
      1: BigNumber;
    }>;

    tradeWithHint(
      src: string,
      srcAmount: BigNumberish,
      dest: string,
      destAddress: string,
      maxDestAmount: BigNumberish,
      minConversionRate: BigNumberish,
      walletId: string,
      hint: BytesLike,
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;
  };

  maxGasPrice(overrides?: CallOverrides): Promise<BigNumber>;

  getUserCapInWei(user: string, overrides?: CallOverrides): Promise<BigNumber>;

  getUserCapInTokenWei(
    user: string,
    token: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  enabled(overrides?: CallOverrides): Promise<boolean>;

  info(id: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

  getExpectedRate(
    src: string,
    dest: string,
    srcQty: BigNumberish,
    overrides?: CallOverrides
  ): Promise<{
    expectedRate: BigNumber;
    slippageRate: BigNumber;
    0: BigNumber;
    1: BigNumber;
  }>;

  tradeWithHint(
    src: string,
    srcAmount: BigNumberish,
    dest: string,
    destAddress: string,
    maxDestAmount: BigNumberish,
    minConversionRate: BigNumberish,
    walletId: string,
    hint: BytesLike,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  staticCall: {
    maxGasPrice(overrides?: CallOverrides): Promise<BigNumber>;

    getUserCapInWei(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserCapInTokenWei(
      user: string,
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    enabled(overrides?: CallOverrides): Promise<boolean>;

    info(id: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    getExpectedRate(
      src: string,
      dest: string,
      srcQty: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      expectedRate: BigNumber;
      slippageRate: BigNumber;
      0: BigNumber;
      1: BigNumber;
    }>;

    tradeWithHint(
      src: string,
      srcAmount: BigNumberish,
      dest: string,
      destAddress: string,
      maxDestAmount: BigNumberish,
      minConversionRate: BigNumberish,
      walletId: string,
      hint: BytesLike,
      overrides?: PayableOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    maxGasPrice(): Promise<BigNumber>;
    getUserCapInWei(user: string): Promise<BigNumber>;
    getUserCapInTokenWei(user: string, token: string): Promise<BigNumber>;
    enabled(): Promise<BigNumber>;
    info(id: BytesLike): Promise<BigNumber>;
    getExpectedRate(
      src: string,
      dest: string,
      srcQty: BigNumberish
    ): Promise<BigNumber>;
    tradeWithHint(
      src: string,
      srcAmount: BigNumberish,
      dest: string,
      destAddress: string,
      maxDestAmount: BigNumberish,
      minConversionRate: BigNumberish,
      walletId: string,
      hint: BytesLike
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    maxGasPrice(): Promise<PopulatedTransaction>;
    getUserCapInWei(user: string): Promise<PopulatedTransaction>;
    getUserCapInTokenWei(
      user: string,
      token: string
    ): Promise<PopulatedTransaction>;
    enabled(): Promise<PopulatedTransaction>;
    info(id: BytesLike): Promise<PopulatedTransaction>;
    getExpectedRate(
      src: string,
      dest: string,
      srcQty: BigNumberish
    ): Promise<PopulatedTransaction>;
    tradeWithHint(
      src: string,
      srcAmount: BigNumberish,
      dest: string,
      destAddress: string,
      maxDestAmount: BigNumberish,
      minConversionRate: BigNumberish,
      walletId: string,
      hint: BytesLike
    ): Promise<PopulatedTransaction>;
  };
}
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
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface MockFlashLoanReceiverInterface extends ethers.utils.Interface {
  functions: {
    "addressesProvider()": FunctionFragment;
    "executeOperation(address,uint256,uint256,bytes)": FunctionFragment;
    "setFailExecutionTransfer(bool)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addressesProvider",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "executeOperation",
    values: [string, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setFailExecutionTransfer",
    values: [boolean]
  ): string;

  decodeFunctionResult(
    functionFragment: "addressesProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeOperation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFailExecutionTransfer",
    data: BytesLike
  ): Result;

  events: {
    "ExecutedWithFail(address,uint256,uint256)": EventFragment;
    "ExecutedWithSuccess(address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ExecutedWithFail"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExecutedWithSuccess"): EventFragment;
}

export class MockFlashLoanReceiver extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: MockFlashLoanReceiverInterface;

  functions: {
    addressesProvider(
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "addressesProvider()"(
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    executeOperation(
      _reserve: string,
      _amount: BigNumberish,
      _fee: BigNumberish,
      _params: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "executeOperation(address,uint256,uint256,bytes)"(
      _reserve: string,
      _amount: BigNumberish,
      _fee: BigNumberish,
      _params: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setFailExecutionTransfer(
      _fail: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setFailExecutionTransfer(bool)"(
      _fail: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  addressesProvider(overrides?: CallOverrides): Promise<string>;

  "addressesProvider()"(overrides?: CallOverrides): Promise<string>;

  executeOperation(
    _reserve: string,
    _amount: BigNumberish,
    _fee: BigNumberish,
    _params: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "executeOperation(address,uint256,uint256,bytes)"(
    _reserve: string,
    _amount: BigNumberish,
    _fee: BigNumberish,
    _params: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setFailExecutionTransfer(
    _fail: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setFailExecutionTransfer(bool)"(
    _fail: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    addressesProvider(overrides?: CallOverrides): Promise<string>;

    "addressesProvider()"(overrides?: CallOverrides): Promise<string>;

    executeOperation(
      _reserve: string,
      _amount: BigNumberish,
      _fee: BigNumberish,
      _params: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "executeOperation(address,uint256,uint256,bytes)"(
      _reserve: string,
      _amount: BigNumberish,
      _fee: BigNumberish,
      _params: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setFailExecutionTransfer(
      _fail: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    "setFailExecutionTransfer(bool)"(
      _fail: boolean,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    ExecutedWithFail(_reserve: null, _amount: null, _fee: null): EventFilter;

    ExecutedWithSuccess(_reserve: null, _amount: null, _fee: null): EventFilter;
  };

  estimateGas: {
    addressesProvider(overrides?: CallOverrides): Promise<BigNumber>;

    "addressesProvider()"(overrides?: CallOverrides): Promise<BigNumber>;

    executeOperation(
      _reserve: string,
      _amount: BigNumberish,
      _fee: BigNumberish,
      _params: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "executeOperation(address,uint256,uint256,bytes)"(
      _reserve: string,
      _amount: BigNumberish,
      _fee: BigNumberish,
      _params: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setFailExecutionTransfer(
      _fail: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setFailExecutionTransfer(bool)"(
      _fail: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addressesProvider(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "addressesProvider()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    executeOperation(
      _reserve: string,
      _amount: BigNumberish,
      _fee: BigNumberish,
      _params: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "executeOperation(address,uint256,uint256,bytes)"(
      _reserve: string,
      _amount: BigNumberish,
      _fee: BigNumberish,
      _params: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setFailExecutionTransfer(
      _fail: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setFailExecutionTransfer(bool)"(
      _fail: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}

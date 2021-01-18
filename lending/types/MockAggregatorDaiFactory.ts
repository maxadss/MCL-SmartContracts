/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import { MockAggregatorDai } from "./MockAggregatorDai";

export class MockAggregatorDaiFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _initialAnswer: BigNumberish,
    overrides?: Overrides
  ): Promise<MockAggregatorDai> {
    return super.deploy(_initialAnswer, overrides || {}) as Promise<
      MockAggregatorDai
    >;
  }
  getDeployTransaction(
    _initialAnswer: BigNumberish,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(_initialAnswer, overrides || {});
  }
  attach(address: string): MockAggregatorDai {
    return super.attach(address) as MockAggregatorDai;
  }
  connect(signer: Signer): MockAggregatorDaiFactory {
    return super.connect(signer) as MockAggregatorDaiFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockAggregatorDai {
    return new Contract(address, _abi, signerOrProvider) as MockAggregatorDai;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "int256",
        name: "_initialAnswer",
        type: "int256"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "int256",
        name: "current",
        type: "int256"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "AnswerUpdated",
    type: "event"
  },
  {
    constant: true,
    inputs: [],
    name: "latestAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161011d38038061011d8339818101604052602081101561003357600080fd5b810190808051906020019092919050505080806000819055506000817f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f426040518082815260200191505060405180910390a350506087806100966000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806350d25bcd14602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000805490509056fea265627a7a723158203903cd3132c656406bd05188ca8c0df819cf4dc909d293629049310e8c70c24064736f6c63430005100032";
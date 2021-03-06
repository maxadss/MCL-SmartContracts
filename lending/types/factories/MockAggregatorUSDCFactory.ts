/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { MockAggregatorUSDC } from "../MockAggregatorUSDC";

export class MockAggregatorUSDCFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _initialAnswer: BigNumberish,
    overrides?: Overrides
  ): Promise<MockAggregatorUSDC> {
    return super.deploy(
      _initialAnswer,
      overrides || {}
    ) as Promise<MockAggregatorUSDC>;
  }
  getDeployTransaction(
    _initialAnswer: BigNumberish,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(_initialAnswer, overrides || {});
  }
  attach(address: string): MockAggregatorUSDC {
    return super.attach(address) as MockAggregatorUSDC;
  }
  connect(signer: Signer): MockAggregatorUSDCFactory {
    return super.connect(signer) as MockAggregatorUSDCFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockAggregatorUSDC {
    return new Contract(address, _abi, signerOrProvider) as MockAggregatorUSDC;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "int256",
        name: "_initialAnswer",
        type: "int256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "int256",
        name: "current",
        type: "int256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "AnswerUpdated",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "latestAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516101023803806101028339818101604052602081101561003357600080fd5b5051600081815560408051428152905183929183917f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f9181900360200190a350506080806100826000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806350d25bcd14602d575b600080fd5b60336045565b60408051918252519081900360200190f35b6000549056fea265627a7a72315820b6accf0142df28da432b9864b8a113d1dc7365450d663d47338417b697894baf64736f6c63430005110032";

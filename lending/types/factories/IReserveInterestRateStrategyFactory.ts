/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { IReserveInterestRateStrategy } from "../IReserveInterestRateStrategy";

export class IReserveInterestRateStrategyFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IReserveInterestRateStrategy {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IReserveInterestRateStrategy;
  }
}

const _abi = [
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "_reserve",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_utilizationRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalBorrowsStable",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalBorrowsVariable",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_averageStableBorrowRate",
        type: "uint256",
      },
    ],
    name: "calculateInterestRates",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidityRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stableBorrowRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "variableBorrowRate",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getBaseVariableBorrowRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

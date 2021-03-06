/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import { ILendingPool } from "./ILendingPool";

export class ILendingPoolFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ILendingPool {
    return new Contract(address, _abi, signerOrProvider) as ILendingPool;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "updateGovernanceStakingRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

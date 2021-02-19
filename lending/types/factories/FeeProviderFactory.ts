/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { FeeProvider } from "../FeeProvider";

export class FeeProviderFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<FeeProvider> {
    return super.deploy(overrides || {}) as Promise<FeeProvider>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): FeeProvider {
    return super.attach(address) as FeeProvider;
  }
  connect(signer: Signer): FeeProviderFactory {
    return super.connect(signer) as FeeProviderFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FeeProvider {
    return new Contract(address, _abi, signerOrProvider) as FeeProvider;
  }
}

const _abi = [
  {
    constant: true,
    inputs: [],
    name: "FEE_PROVIDER_REVISION",
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
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "calculateLoanOriginationFee",
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
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "_originationFee",
        type: "uint256",
      },
    ],
    name: "calculateRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
  {
    constant: true,
    inputs: [],
    name: "getFeeRates",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
  {
    constant: true,
    inputs: [],
    name: "getFlashLoanFee",
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
  {
    constant: true,
    inputs: [],
    name: "getRewardRates",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_addressesProvider",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526000805534801561001457600080fd5b50610578806100246000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063c4d66de81161005b578063c4d66de8146100df578063d3ea435014610107578063d6e7a55e14610124578063fd90c2be146101455761007d565b80630c056a3114610082578063249bbe91146100a8578063b0d73d4e146100d7575b600080fd5b61008a61014d565b60408051938452602084019290925282820152519081900360600190f35b6100c5600480360360208110156100be57600080fd5b503561016d565b60408051918252519081900360200190f35b6100c561018b565b610105600480360360208110156100f557600080fd5b50356001600160a01b0316610190565b005b61008a6004803603602081101561011d57600080fd5b503561022d565b61012c6102f6565b6040805192835260208301919091528051918290030190f35b6100c5610309565b6709b6e64a8ec600006702c68af0bb14000067016345785d8a0000909192565b6000610185826509184e72a00063ffffffff61031416565b92915050565b600181565b600061019a610357565b60015490915060ff16806101b157506101b161035c565b806101bd575060005481115b6101f85760405162461bcd60e51b815260040180806020018281038252602e815260200180610516602e913960400191505060405180910390fd5b60015460ff16158015610217576001805460ff19168117905560008290555b8015610228576001805460ff191690555b505050565b60008080670de0b6b3a764000061025a6709b6e64a8ec600006702c68af0bb14000063ffffffff61036216565b11156102ad576040805162461bcd60e51b815260206004820152601b60248201527f496e76616c6964204665657320636f6e66696775726174696f6e730000000000604482015290519081900360640190fd5b60006102c7856709b6e64a8ec6000063ffffffff61031416565b905060006102e3866702c68af0bb14000063ffffffff61031416565b9196919587900386900394509092505050565b6509184e72a000660221b262dd80009091565b660221b262dd800090565b6000610350670de0b6b3a7640000610344610335868663ffffffff6103bc16565b6706f05b59d3b2000090610362565b9063ffffffff61041516565b9392505050565b600190565b303b1590565b600082820183811015610350576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b6000826103cb57506000610185565b828202828482816103d857fe5b04146103505760405162461bcd60e51b81526004018080602001828103825260218152602001806104f56021913960400191505060405180910390fd5b600061035083836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250600081836104de5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b838110156104a357818101518382015260200161048b565b50505050905090810190601f1680156104d05780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b5060008385816104ea57fe5b049594505050505056fe536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77436f6e747261637420696e7374616e63652068617320616c7265616479206265656e20696e697469616c697a6564a265627a7a72315820cb9c70770c2217e64ef5a40d84b7cea07182d236fadc4933282eede3d5bb891364736f6c63430005110032";

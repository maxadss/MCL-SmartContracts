/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { MockMKR } from "../MockMKR";

export class MockMKRFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<MockMKR> {
    return super.deploy(overrides || {}) as Promise<MockMKR>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockMKR {
    return super.attach(address) as MockMKR;
  }
  connect(signer: Signer): MockMKRFactory {
    return super.connect(signer) as MockMKRFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockMKR {
    return new Contract(address, _abi, signerOrProvider) as MockMKR;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "decimals",
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
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
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
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6012600390815560c060405260808190526226a5a960e91b60a0908152610029916004919061005a565b506040805180820190915260058082526426b0b5b2b960d91b6020909201918252610054918161005a565b506100f5565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061009b57805160ff19168380011785556100c8565b828001600101855582156100c8579182015b828111156100c85782518255916020019190600101906100ad565b506100d49291506100d8565b5090565b6100f291905b808211156100d457600081556001016100de565b90565b610b04806101046000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c806370a082311161007157806370a08231146101fa57806395d89b4114610220578063a0712d6814610228578063a457c2d714610245578063a9059cbb14610271578063dd62ed3e1461029d576100b4565b806306fdde03146100b9578063095ea7b31461013657806318160ddd1461017657806323b872dd14610190578063313ce567146101c657806339509351146101ce575b600080fd5b6100c16102cb565b6040805160208082528351818301528351919283929083019185019080838360005b838110156100fb5781810151838201526020016100e3565b50505050905090810190601f1680156101285780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101626004803603604081101561014c57600080fd5b506001600160a01b038135169060200135610359565b604080519115158252519081900360200190f35b61017e610376565b60408051918252519081900360200190f35b610162600480360360608110156101a657600080fd5b506001600160a01b0381358116916020810135909116906040013561037c565b61017e610409565b610162600480360360408110156101e457600080fd5b506001600160a01b03813516906020013561040f565b61017e6004803603602081101561021057600080fd5b50356001600160a01b0316610463565b6100c161047e565b6101626004803603602081101561023e57600080fd5b50356104d9565b6101626004803603604081101561025b57600080fd5b506001600160a01b0381351690602001356104ed565b6101626004803603604081101561028757600080fd5b506001600160a01b03813516906020013561055b565b61017e600480360360408110156102b357600080fd5b506001600160a01b038135811691602001351661056f565b6005805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156103515780601f1061032657610100808354040283529160200191610351565b820191906000526020600020905b81548152906001019060200180831161033457829003601f168201915b505050505081565b600061036d61036661059a565b848461059e565b50600192915050565b60025490565b600061038984848461068a565b6103ff8461039561059a565b6103fa85604051806060016040528060288152602001610a3a602891396001600160a01b038a166000908152600160205260408120906103d361059a565b6001600160a01b03168152602081019190915260400160002054919063ffffffff6107e616565b61059e565b5060019392505050565b60035481565b600061036d61041c61059a565b846103fa856001600061042d61059a565b6001600160a01b03908116825260208083019390935260409182016000908120918c16815292529020549063ffffffff61087d16565b6001600160a01b031660009081526020819052604090205490565b6004805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156103515780601f1061032657610100808354040283529160200191610351565b60006104e533836108de565b506001919050565b600061036d6104fa61059a565b846103fa85604051806060016040528060258152602001610aab602591396001600061052461059a565b6001600160a01b03908116825260208083019390935260409182016000908120918d1681529252902054919063ffffffff6107e616565b600061036d61056861059a565b848461068a565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b3390565b6001600160a01b0383166105e35760405162461bcd60e51b8152600401808060200182810382526024815260200180610a876024913960400191505060405180910390fd5b6001600160a01b0382166106285760405162461bcd60e51b81526004018080602001828103825260228152602001806109f26022913960400191505060405180910390fd5b6001600160a01b03808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b0383166106cf5760405162461bcd60e51b8152600401808060200182810382526025815260200180610a626025913960400191505060405180910390fd5b6001600160a01b0382166107145760405162461bcd60e51b81526004018080602001828103825260238152602001806109cf6023913960400191505060405180910390fd5b61075781604051806060016040528060268152602001610a14602691396001600160a01b038616600090815260208190526040902054919063ffffffff6107e616565b6001600160a01b03808516600090815260208190526040808220939093559084168152205461078c908263ffffffff61087d16565b6001600160a01b038084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b600081848411156108755760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b8381101561083a578181015183820152602001610822565b50505050905090810190601f1680156108675780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b6000828201838110156108d7576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b6001600160a01b038216610939576040805162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b60025461094c908263ffffffff61087d16565b6002556001600160a01b038216600090815260208190526040902054610978908263ffffffff61087d16565b6001600160a01b0383166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a3505056fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa265627a7a723158206e918fd9d6b2091f457a82190959922ba5aadf93308f650bb252db50a54ae4e064736f6c63430005110032";

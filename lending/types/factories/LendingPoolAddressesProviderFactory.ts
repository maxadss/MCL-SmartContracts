/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { LendingPoolAddressesProvider } from "../LendingPoolAddressesProvider";

export class LendingPoolAddressesProviderFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<LendingPoolAddressesProvider> {
    return super.deploy(
      overrides || {}
    ) as Promise<LendingPoolAddressesProvider>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): LendingPoolAddressesProvider {
    return super.attach(address) as LendingPoolAddressesProvider;
  }
  connect(signer: Signer): LendingPoolAddressesProviderFactory {
    return super.connect(signer) as LendingPoolAddressesProviderFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LendingPoolAddressesProvider {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as LendingPoolAddressesProvider;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "FeeProviderUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "GovRewardVaultUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "LendingPoolConfiguratorUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "LendingPoolCoreUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "LendingPoolDataProviderUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "LendingPoolLiquidationManagerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "LendingPoolManagerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "LendingPoolParametersProviderUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "LendingPoolUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "LendingRateOracleUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "LiquidityRewardVaultUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "PriceOracleUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "ProxyCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "RewardManagerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "SafetyRewardVaultUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "StakingTokenUpdated",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes32",
        name: "_key",
        type: "bytes32",
      },
    ],
    name: "getAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getFeeProvider",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getGovRewardVault",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getLendingPool",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getLendingPoolConfigurator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getLendingPoolCore",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getLendingPoolDataProvider",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getLendingPoolLiquidationManager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getLendingPoolManager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getLendingPoolParametersProvider",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getLendingRateOracle",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getLpRewardVault",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getPriceOracle",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getRewardManager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getSafetyRewardVault",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getStakingToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isOwner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_feeProvider",
        type: "address",
      },
    ],
    name: "setFeeProviderImpl",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "setGovRewardVault",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_configurator",
        type: "address",
      },
    ],
    name: "setLendingPoolConfiguratorImpl",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_lendingPoolCore",
        type: "address",
      },
    ],
    name: "setLendingPoolCoreImpl",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address",
      },
    ],
    name: "setLendingPoolDataProviderImpl",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
    ],
    name: "setLendingPoolImpl",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_manager",
        type: "address",
      },
    ],
    name: "setLendingPoolLiquidationManager",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_lendingPoolManager",
        type: "address",
      },
    ],
    name: "setLendingPoolManager",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_parametersProvider",
        type: "address",
      },
    ],
    name: "setLendingPoolParametersProvider",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_lendingRateOracle",
        type: "address",
      },
    ],
    name: "setLendingRateOracle",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "setLpRewardVault",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_priceOracle",
        type: "address",
      },
    ],
    name: "setPriceOracle",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_manager",
        type: "address",
      },
    ],
    name: "setRewardManager",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "setSafetyRewardVault",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "setStakingToken",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526100156001600160e01b0361006216565b600080546001600160a01b0319166001600160a01b03928316178082556040519216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a3610066565b3390565b611f39806100756000396000f3fe608060405234801561001057600080fd5b50600436106102115760003560e01c806344ce375b116101255780638da5cb5b116100ad578063c12542df1161007c578063c12542df146104f1578063ed6ff76014610517578063f2fde38b1461051f578063fbeefc3c14610545578063fca513a81461054d57610211565b80638da5cb5b1461049f5780638f32d59b146104a75780639f9106d1146104c3578063bfedc103146104cb57610211565b8063650190f0116100f4578063650190f01461041d578063715018a6146104435780637a82bc251461044b578063820d12741461047157806385c858b11461049757610211565b806344ce375b146103a3578063530e784f146103c95780635834eb9a146103ef5780635aef021f146103f757610211565b80631c827204116101a85780632f58b80d116101775780632f58b80d1461035d57806331c2ddbc1461036557806333128d591461036d5780633618abba1461037557806340fdcadc1461037d57610211565b80631c827204146102ce5780631e9b12ef146102f457806321f8a7211461031a5780632a62c6361461033757610211565b806305e18dfa116101e457806305e18dfa1461027257806313dc12cf14610298578063153ee554146102a0578063194308cd146102c657610211565b80630261bf8b14610216578063026e76da1461023a57806304061d8e1461026257806304e76c8f1461026a575b600080fd5b61021e610555565b604080516001600160a01b039092168252519081900360200190f35b6102606004803603602081101561025057600080fd5b50356001600160a01b0316610574565b005b61021e610612565b61021e610633565b6102606004803603602081101561028857600080fd5b50356001600160a01b031661064f565b61021e6106e9565b610260600480360360208110156102b657600080fd5b50356001600160a01b0316610706565b61021e61079f565b610260600480360360208110156102e457600080fd5b50356001600160a01b03166107bd565b6102606004803603602081101561030a57600080fd5b50356001600160a01b0316610859565b61021e6004803603602081101561033057600080fd5b50356108f1565b6102606004803603602081101561034d57600080fd5b50356001600160a01b031661090c565b61021e6109a3565b61021e6109be565b61021e6109df565b61021e610a01565b6102606004803603602081101561039357600080fd5b50356001600160a01b0316610a22565b610260600480360360208110156103b957600080fd5b50356001600160a01b0316610ac1565b610260600480360360208110156103df57600080fd5b50356001600160a01b0316610b5f565b61021e610bf6565b6102606004803603602081101561040d57600080fd5b50356001600160a01b0316610c17565b6102606004803603602081101561043357600080fd5b50356001600160a01b0316610cae565b610260610d49565b6102606004803603602081101561046157600080fd5b50356001600160a01b0316610dda565b6102606004803603602081101561048757600080fd5b50356001600160a01b0316610e78565b61021e610f16565b61021e610f3d565b6104af610f4c565b604080519115158252519081900360200190f35b61021e610f70565b610260600480360360208110156104e157600080fd5b50356001600160a01b0316610f8b565b6102606004803603602081101561050757600080fd5b50356001600160a01b0316611023565b61021e6110c7565b6102606004803603602081101561053557600080fd5b50356001600160a01b03166110ed565b61021e611140565b61021e61115a565b600061056f6b13115391125391d7d413d3d360a21b6108f1565b905090565b61057c610f4c565b6105bb576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b6105db722820a920a6a2aa22a929afa82927ab24a222a960691b82611174565b6040516001600160a01b038216907fce16ea9b2fd7cadddd0f7359971028f50b5ddba33dfae1a9bdea956fabb1e28090600090a250565b600061056f722820a920a6a2aa22a929afa82927ab24a222a960691b6108f1565b600061056f6d2922aba0a9222fa6a0a720a3a2a960911b6108f1565b610657610f4c565b610696576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b6106b26e131417d49155d0549117d590555315608a1b82611174565b6040516001600160a01b038216907fbdede0a345dc5fbf5cdd5efcbfbfcce95decf4514829b4979a21095d582ae17c90600090a250565b600061056f6e131417d49155d0549117d590555315608a1b6108f1565b61070e610f4c565b61074d576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b6107686d2922aba0a9222fa6a0a720a3a2a960911b82611174565b6040516001600160a01b038216907f3d94d9e8342a65edb95eef4f65059294d45e5192603632d8dddb2344e707805390600090a250565b600061056f6f11d3d597d49155d0549117d59055531560821b6108f1565b6107c5610f4c565b610804576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b610822704c454e44494e475f504f4f4c5f434f524560781b826111a2565b6040516001600160a01b038216907f71c226bb2879778ca1298196bf7cc1256baee9d05b496c31ee627d35a471b5b790600090a250565b610861610f4c565b6108a0576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b6108ba6c29aa20a5a4a723afaa27a5a2a760991b82611174565b6040516001600160a01b038216907f08d9e26510a3cb1d512e4122208b8399da71fdde379ed7801f26cc073be0cad290600090a250565b6000908152600160205260409020546001600160a01b031690565b610914610f4c565b610953576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b61096c6b2322a2afa82927ab24a222a960a11b826111a2565b6040516001600160a01b038216907f18e1a55b8eff9c93921eecfa1462d6a8cbb80b3988db3eb14c039e43fdb2266190600090a250565b600061056f6c2220aa20afa82927ab24a222a960991b6108f1565b600061056f7214d05191551657d49155d0549117d590555315606a1b6108f1565b600061056f732622a72224a723afa827a7a62fa6a0a720a3a2a960611b6108f1565b600061056f724c454e44494e475f524154455f4f5241434c4560681b6108f1565b610a2a610f4c565b610a69576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b610a8a732622a72224a723afa827a7a62fa6a0a720a3a2a960611b82611174565b6040516001600160a01b038216907fd5280c51185a38d36f7a0f5e56cac6248312bb70d0974782fa5a595127e0e08e90600090a250565b610ac9610f4c565b610b08576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b610b28722624a8aaa4a220aa24a7a72fa6a0a720a3a2a960691b82611174565b6040516001600160a01b038216907f1a76cb769b814bc038223da86932b099b20aae03473683e6d98f5c3554e2606490600090a250565b610b67610f4c565b610ba6576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b610bbf6b50524943455f4f5241434c4560a01b82611174565b6040516001600160a01b038216907fefe8ab924ca486283a79dc604baa67add51afb82af1db8ac386ebbba643cdffd90600090a250565b600061056f722624a8aaa4a220aa24a7a72fa6a0a720a3a2a960691b6108f1565b610c1f610f4c565b610c5e576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b610c776b13115391125391d7d413d3d360a21b826111a2565b6040516001600160a01b038216907fc4e6c6cdf28d0edbd8bcf071d724d33cc2e7a30be7d06443925656e9cb492aa490600090a250565b610cb6610f4c565b610cf5576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b610d126f11d3d597d49155d0549117d59055531560821b82611174565b6040516001600160a01b038216907f45671a820c909a53fcc7a336576502546c5be81b79c488836e8d71b0f9bae88f90600090a250565b610d51610f4c565b610d90576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b610de2610f4c565b610e21576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b610e417214d05191551657d49155d0549117d590555315606a1b82611174565b6040516001600160a01b038216907f1526c3c57fc040d48a594af00521100f8183a217ee7eea789318037c903e434e90600090a250565b610e80610f4c565b610ebf576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b610edf724c454e44494e475f524154455f4f5241434c4560681b82611174565b6040516001600160a01b038216907f5c29179aba6942020a8a2d38f65de02fb6b7f784e7f049ed3a3cab97621859b590600090a250565b600061056f782622a72224a723afa827a7a62fa1a7a72324a3aaa920aa27a960391b6108f1565b6000546001600160a01b031690565b600080546001600160a01b0316610f6161143b565b6001600160a01b031614905090565b600061056f6c29aa20a5a4a723afaa27a5a2a760991b6108f1565b610f93610f4c565b610fd2576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b610fec6c2220aa20afa82927ab24a222a960991b826111a2565b6040516001600160a01b038216907f07890d7d10db37434d76ee4f2928fb2dc66227c3b3391206aced4f7bcb59cdb090600090a250565b61102b610f4c565b61106a576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b611090782622a72224a723afa827a7a62fa1a7a72324a3aaa920aa27a960391b826111a2565b6040516001600160a01b038216907fdfabe479bad36782fb1e77fbfddd4e382671713527e4786cfc93a022ae76372990600090a250565b6000806110e7704c454e44494e475f504f4f4c5f434f524560781b6108f1565b91505090565b6110f5610f4c565b611134576040805162461bcd60e51b81526020600482018190526024820152600080516020611ee5833981519152604482015290519081900360640190fd5b61113d8161143f565b50565b600061056f6b2322a2afa82927ab24a222a960a11b6108f1565b600061056f6b50524943455f4f5241434c4560a01b6108f1565b60009182526001602052604090912080546001600160a01b0319166001600160a01b03909216919091179055565b60006111ad836108f1565b60408051306024808301919091528251808303909101815260449091019091526020810180516001600160e01b031663189acdbd60e31b17905290915081906001600160a01b03821661136757604051611206906114df565b604051809103906000f080158015611222573d6000803e3d6000fd5b509150816001600160a01b031663cf7a1d778530846040518463ffffffff1660e01b815260040180846001600160a01b03166001600160a01b03168152602001836001600160a01b03166001600160a01b0316815260200180602001828103825283818151815260200191508051906020019080838360005b838110156112b357818101518382015260200161129b565b50505050905090810190601f1680156112e05780820380516001836020036101000a031916815260200191505b50945050505050600060405180830381600087803b15801561130157600080fd5b505af1158015611315573d6000803e3d6000fd5b505050506113238583611174565b6040805186815290516001600160a01b038416917f1eb35cb4b5bbb23d152f3b4016a5a46c37a07ae930ed0956aba951e231142438919081900360200190a2611434565b6040805163278f794360e11b81526001600160a01b03868116600483019081526024830193845284516044840152845191861693634f1ef2869389938793929160640190602085019080838360005b838110156113ce5781810151838201526020016113b6565b50505050905090810190601f1680156113fb5780820380516001836020036101000a031916815260200191505b509350505050600060405180830381600087803b15801561141b57600080fd5b505af115801561142f573d6000803e3d6000fd5b505050505b5050505050565b3390565b6001600160a01b0381166114845760405162461bcd60e51b8152600401808060200182810382526026815260200180611ebf6026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b6109d2806114ed8339019056fe608060405234801561001057600080fd5b506109b2806100206000396000f3fe6080604052600436106100705760003560e01c80638f2839701161004e5780638f2839701461015e578063cf7a1d7714610191578063d1f5789414610250578063f851a4401461030657610070565b80633659cfe61461007a5780634f1ef286146100ad5780635c60da1b1461012d575b61007861031b565b005b34801561008657600080fd5b506100786004803603602081101561009d57600080fd5b50356001600160a01b0316610335565b610078600480360360408110156100c357600080fd5b6001600160a01b0382351691908101906040810160208201356401000000008111156100ee57600080fd5b82018360208201111561010057600080fd5b8035906020019184600183028401116401000000008311171561012257600080fd5b50909250905061036f565b34801561013957600080fd5b5061014261041c565b604080516001600160a01b039092168252519081900360200190f35b34801561016a57600080fd5b506100786004803603602081101561018157600080fd5b50356001600160a01b0316610459565b610078600480360360608110156101a757600080fd5b6001600160a01b0382358116926020810135909116918101906060810160408201356401000000008111156101db57600080fd5b8201836020820111156101ed57600080fd5b8035906020019184600183028401116401000000008311171561020f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610513945050505050565b6100786004803603604081101561026657600080fd5b6001600160a01b03823516919081019060408101602082013564010000000081111561029157600080fd5b8201836020820111156102a357600080fd5b803590602001918460018302840111640100000000831117156102c557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610599945050505050565b34801561031257600080fd5b506101426106d9565b610323610704565b61033361032e610764565b610789565b565b61033d6107ad565b6001600160a01b0316336001600160a01b031614156103645761035f816107d2565b61036c565b61036c61031b565b50565b6103776107ad565b6001600160a01b0316336001600160a01b0316141561040f57610399836107d2565b6000836001600160a01b031683836040518083838082843760405192019450600093509091505080830381855af49150503d80600081146103f6576040519150601f19603f3d011682016040523d82523d6000602084013e6103fb565b606091505b505090508061040957600080fd5b50610417565b61041761031b565b505050565b60006104266107ad565b6001600160a01b0316336001600160a01b0316141561044e57610447610764565b9050610456565b61045661031b565b90565b6104616107ad565b6001600160a01b0316336001600160a01b03161415610364576001600160a01b0381166104bf5760405162461bcd60e51b815260040180806020018281038252603681526020018061090d6036913960400191505060405180910390fd5b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f6104e86107ad565b604080516001600160a01b03928316815291841660208301528051918290030190a161035f81610812565b600061051d610764565b6001600160a01b03161461053057600080fd5b61053a8382610599565b604080517232b4b8189c9b1b97383937bc3c9730b236b4b760691b815290519081900360130190207fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61036000199091011461059057fe5b61041782610812565b60006105a3610764565b6001600160a01b0316146105b657600080fd5b604080517f656970313936372e70726f78792e696d706c656d656e746174696f6e000000008152905190819003601c0190207f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc6000199091011461061657fe5b61061f82610836565b8051156106d5576000826001600160a01b0316826040518082805190602001908083835b602083106106625780518252601f199092019160209182019101610643565b6001836020036101000a038019825116818451168082178552505050505050905001915050600060405180830381855af49150503d80600081146106c2576040519150601f19603f3d011682016040523d82523d6000602084013e6106c7565b606091505b505090508061041757600080fd5b5050565b60006106e36107ad565b6001600160a01b0316336001600160a01b0316141561044e576104476107ad565b61070c6107ad565b6001600160a01b0316336001600160a01b0316141561075c5760405162461bcd60e51b81526004018080602001828103825260328152602001806108db6032913960400191505060405180910390fd5b610333610333565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5490565b3660008037600080366000845af43d6000803e8080156107a8573d6000f35b3d6000fd5b7fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035490565b6107db81610836565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b7fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d610355565b61083f8161089e565b61087a5760405162461bcd60e51b815260040180806020018281038252603b815260200180610943603b913960400191505060405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc55565b6000813f7fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a47081158015906108d25750808214155b94935050505056fe43616e6e6f742063616c6c2066616c6c6261636b2066756e6374696f6e2066726f6d207468652070726f78792061646d696e43616e6e6f74206368616e6765207468652061646d696e206f6620612070726f787920746f20746865207a65726f206164647265737343616e6e6f742073657420612070726f787920696d706c656d656e746174696f6e20746f2061206e6f6e2d636f6e74726163742061646472657373a265627a7a723158201425754ad2d44165ab0a403f6ad9a63ad3e272c0721f9da8cc033c0ddf8d08ff64736f6c634300051100324f776e61626c653a206e6577206f776e657220697320746865207a65726f20616464726573734f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572a265627a7a72315820953e7bb96cebc88a9c868ba842454400aa189174e56636c5b507f5f9cd42bdb264736f6c63430005110032";

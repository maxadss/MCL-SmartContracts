// import {usePlugin} from '@nomiclabs/hardhat/config';
import { HardhatUserConfig } from "hardhat/types";
import path from 'path';
import fs from 'fs';

import {accounts} from './test-wallets';
import {eEthereumNetwork} from './helpers/types';

import "@nomiclabs/hardhat-ethers";
import "hardhat-typechain";
import "solidity-coverage";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ganache";
import "solidity-coverage";


['misc', 'deployments', 'migrations'].forEach((folder) => {
  const tasksPath = path.join(__dirname, 'tasks', folder);
  fs.readdirSync(tasksPath).forEach((task) => require(`${tasksPath}/${task}`));
});

export const HARDHATEVM_CHAIN_ID = 31337;
const DEFAULT_BLOCK_GAS_LIMIT = 12500000;
const DEFAULT_GAS_PRICE = 50000000000; // 50 gwei
const HARDFORK = 'istanbul';
const INFURA_KEY = process.env.INFURA_KEY || '';
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || '';
const MNEMONIC_PATH = "m/44'/60'/0'/0";
const MNEMONICS: {[network: string]: string} = {
  [eEthereumNetwork.kovan]: process.env.MNEMONIC || '',
  [eEthereumNetwork.ropsten]: process.env.MNEMONIC || '',
  [eEthereumNetwork.main]: process.env.MNEMONIC || '',
};

const getCommonNetworkConfig = (networkName: eEthereumNetwork, networkId: number) => {
  return {
    url: `https://${networkName}.infura.io/v3/${INFURA_KEY}`,
    hardfork: HARDFORK,
    blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
    gasPrice: DEFAULT_GAS_PRICE,
    chainId: networkId,
    accounts: {
      mnemonic: MNEMONICS[networkName],
      path: MNEMONIC_PATH,
      initialIndex: 0,
      count: 20,
    },
  };
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.6.12", settings: { optimizer:{ enabled:true, runs:200}} }],
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  defaultNetwork: 'hardhat',
  mocha: {
    timeout: 0,
  },
  networks: {
    kovan: getCommonNetworkConfig(eEthereumNetwork.kovan, 42),
    ropsten: getCommonNetworkConfig(eEthereumNetwork.ropsten, 3),
    main: getCommonNetworkConfig(eEthereumNetwork.main, 1),
    hardhat: {
    },
    ganache: {
      url: 'http://ganache:8545',
      accounts: {
        mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
    coverage: {
      url: 'http://localhost:8555',
    },
  },
};

export default config;


import {deployContract, getContractFactory, getContract} from './contracts-helpers';
import {eContractid, tEthereumAddress} from './types';
import { LendingPoolAddressesProvider } from '../../types/LendingPoolAddressesProvider';

export const deployLendingPool = async () =>
  await deployContract<LendingPoolAddressesProvider>(eContractid.LendingPoolMock,[]);


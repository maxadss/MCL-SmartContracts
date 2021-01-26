import {task} from 'hardhat/config';
import {eContractid} from '../../helpers/types';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {StakedbMXX} from '../../types/StakedbMxx';

task('dev-deployment', 'Deployment in hardhat').setAction(async (_, localBRE) => {
  const BRE: HardhatRuntimeEnvironment = await localBRE.run('set-bre');

  const bMXXStake = (await BRE.run(`deploy-${eContractid.StakedbMXX}`)) as StakedbMXX;
});

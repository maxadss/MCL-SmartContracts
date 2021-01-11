import {task} from '@nomiclabs/buidler/config';
import {eContractid} from '../../helpers/types';
import {BuidlerRuntimeEnvironment} from '@nomiclabs/buidler/types';
import {StakedbMXX} from '../../types/StakedbMXX';

task('dev-deployment', 'Deployment in buidlerevm').setAction(async (_, localBRE) => {
  const BRE: BuidlerRuntimeEnvironment = await localBRE.run('set-bre');

  const bMXXStake = (await BRE.run(`deploy-${eContractid.StakedbMXX}`)) as StakedbMXX;
});

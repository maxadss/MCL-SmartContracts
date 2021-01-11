import {task} from '@nomiclabs/buidler/config';
import {BuidlerRuntimeEnvironment} from '@nomiclabs/buidler/types';

import {eContractid, eEthereumNetwork} from '../../helpers/types';
import {checkVerification} from '../../helpers/etherscan-verification';
import {getbMXXAdminPerNetwork} from '../../helpers/constants';

task('common-deployment', 'Deployment in for Main, Kovan and Ropsten networks')
  .addFlag('verify', 'Verify StakedbMXX and InitializableAdminUpgradeabilityProxy contract.')
  .addOptionalParam(
    'vaultAddress',
    'Use bMXXIncentivesVault address by param instead of configuration.'
  )
  .addOptionalParam('bMXXAddress', 'Use mToken address by param instead of configuration.')
  .setAction(async ({verify, vaultAddress, bMXXAddress}, localBRE) => {
    const BRE: BuidlerRuntimeEnvironment = await localBRE.run('set-bre');
    const network = BRE.network.name as eEthereumNetwork;
    const bMXXAdmin = getbMXXAdminPerNetwork(network);

    if (!bMXXAdmin) {
      throw Error(
        'The --admin parameter must be set. Set an Ethereum address as --admin parameter input.'
      );
    }

    // If Etherscan verification is enabled, check needed enviroments to prevent loss of gas in failed deployments.
    if (verify) {
      checkVerification();
    }

    await BRE.run(`deploy-${eContractid.StakedbMXX}`, {verify, vaultAddress, bMXXAddress});

    await BRE.run(`initialize-${eContractid.StakedbMXX}`, {
      admin: bMXXAdmin,
    });

    console.log(`\n✔️ Finished the deployment of the bMXX Token ${network} Enviroment. ✔️`);
  });

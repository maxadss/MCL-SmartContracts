import {task} from 'hardhat/config';

import {eContractid, eEthereumNetwork, tEthereumAddress} from '../../helpers/types';
import {registerContractInJsonDb} from '../../helpers/contracts-helpers';
import {
  getmTokenPerNetwork,
  getCooldownDaysPerNetwork,
  getUnstakeWindowPerNetwork,
  getbMXXAdminPerNetwork,
  getDistributionDurationPerNetwork,
  getbMXXIncentivesVaultPerNetwork,
} from '../../helpers/constants';
import {
  deployStakedbMXX,
  deployInitializableAdminUpgradeabilityProxy,
  deployLendingPool,
} from '../../helpers/contracts-accessors';
import {checkVerification} from '../../helpers/etherscan-verification';

const {StakedbMXX, StakedbMXXImpl} = eContractid;

task(`deploy-${StakedbMXX}`, `Deploys the ${StakedbMXX} contract`)
  .addFlag('verify', 'Verify StakedbMXX contract via Etherscan API.')
  .addOptionalParam(
    'vaultAddress',
    'Use bMXXIncentivesVault address by param instead of configuration.'
  )
  .addOptionalParam('bMXXAddress', 'Use mToken address by param instead of configuration.')
  .setAction(async ({verify, vaultAddress, bMXXAddress}, localBRE) => {
    await localBRE.run('set-bre');

    // If Etherscan verification is enabled, check needed enviroments to prevent loss of gas in failed deployments.
    if (verify) {
      checkVerification();
    }

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    const network = localBRE.network.name as eEthereumNetwork;

    console.log(`\n- ${StakedbMXX} deployment`);

    console.log(`\tDeploying ${StakedbMXX} implementation ...`);
    const lp = await deployLendingPool([]);

    const stakedbMXXImpl = await deployStakedbMXX(
      [
        bMXXAddress || getmTokenPerNetwork(network),
        bMXXAddress || getmTokenPerNetwork(network),
        getCooldownDaysPerNetwork(network),
        getUnstakeWindowPerNetwork(network),
        vaultAddress || getbMXXIncentivesVaultPerNetwork(network),
        getbMXXAdminPerNetwork(network),
        getDistributionDurationPerNetwork(network),
        lp.address,
      ],
      false // disable verify due not supported by current buidler etherscan plugin
    );
    await stakedbMXXImpl.deployTransaction.wait();
    await registerContractInJsonDb(StakedbMXXImpl, stakedbMXXImpl);

    console.log(`\tDeploying ${StakedbMXX} Transparent Proxy ...`);
    const stakedbMXXProxy = await deployInitializableAdminUpgradeabilityProxy(verify);
    await registerContractInJsonDb(StakedbMXX, stakedbMXXProxy);

    console.log(`\tFinished ${StakedbMXX} proxy and implementation deployment`);
  });

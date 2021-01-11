import {task} from '@nomiclabs/buidler/config';
import {eContractid} from '../../helpers/types';
import {waitForTx} from '../../helpers/misc-utils';
import {
  ZERO_ADDRESS,
  STAKED_BMXX_NAME,
  STAKED_BMXX_SYMBOL,
  STAKED_BMXX_DECIMALS,
} from '../../helpers/constants';
import {
  getStakedbMXX,
  getStakedbMXXImpl,
  getStakedbMXXProxy,
} from '../../helpers/contracts-accessors';

const {StakedbMXX} = eContractid;

task(`initialize-${StakedbMXX}`, `Initialize the ${StakedbMXX} proxy contract`)
  .addParam('admin', `The address to be added as an Admin role in ${StakedbMXX} Transparent Proxy.`)
  .setAction(async ({admin: bMXXAdmin}, localBRE) => {
    await localBRE.run('set-bre');

    if (!bMXXAdmin) {
      throw new Error(
        `Missing --admin parameter to add the Admin Role to ${StakedbMXX} Transparent Proxy`
      );
    }

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- ${StakedbMXX} initialization`);

    const stakedbMXXImpl = await getStakedbMXXImpl();
    const stakedbMXXProxy = await getStakedbMXXProxy();

    console.log('\tInitializing StakedbMXX');

    const encodedInitializeStakedbMXX = stakedbMXXImpl.interface.encodeFunctionData('initialize', [
      ZERO_ADDRESS,
      STAKED_BMXX_NAME,
      STAKED_BMXX_SYMBOL,
      STAKED_BMXX_DECIMALS,
    ]);

    await waitForTx(
      await stakedbMXXProxy.functions['initialize(address,address,bytes)'](
        stakedbMXXImpl.address,
        bMXXAdmin,
        encodedInitializeStakedbMXX
      )
    );

    console.log('\tFinished bMXX Token and Transparent Proxy initialization');
  });

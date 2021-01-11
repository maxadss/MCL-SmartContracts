import {timeLatest} from '../../helpers/misc-utils';

const {expect} = require('chai');

import {makeSuite} from '../helpers/make-suite';
import {deploybMXXIncentivesController} from '../../helpers/contracts-accessors';
import {RANDOM_ADDRESSES} from '../../helpers/constants';

makeSuite('bMXXIncentivesController constructor tests', () => {
  it('should assign correct params', async () => {
    const peiEmissionManager = RANDOM_ADDRESSES[1];
    const rewardToken = RANDOM_ADDRESSES[3];
    const rewardsVault = RANDOM_ADDRESSES[4];
    const psm = RANDOM_ADDRESSES[5];
    const extraPsmReward = '100';
    const distributionDuration = '100';

    const bMXXIncentivesController = await deploybMXXIncentivesController([
      rewardToken,
      rewardsVault,
      psm,
      extraPsmReward,
      peiEmissionManager,
      distributionDuration,
    ]);
    await expect(await bMXXIncentivesController.REWARD_TOKEN()).to.be.equal(rewardToken);
    await expect(await bMXXIncentivesController.REWARDS_VAULT()).to.be.equal(rewardsVault);
    await expect(await bMXXIncentivesController.PSM()).to.be.equal(psm);
    await expect((await bMXXIncentivesController.EXTRA_PSM_REWARD()).toString()).to.be.equal(
      extraPsmReward
    );
    await expect((await bMXXIncentivesController.EMISSION_MANAGER()).toString()).to.be.equal(
      peiEmissionManager
    );
    await expect((await bMXXIncentivesController.DISTRIBUTION_END()).toString()).to.be.equal(
      (await timeLatest()).plus(distributionDuration).toString()
    );
  });
});

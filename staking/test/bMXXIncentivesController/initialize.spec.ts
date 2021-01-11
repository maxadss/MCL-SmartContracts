import {makeSuite, TestEnv} from '../helpers/make-suite';
import {MAX_UINT_AMOUNT} from '../../helpers/constants';

const {expect} = require('chai');

makeSuite('bMXXIncentivesController initialize', (testEnv: TestEnv) => {
  // TODO: useless or not?
  it('Tries to call initialize second time, should be reverted', async () => {
    const {bMXXIncentivesController} = testEnv;
    await expect(bMXXIncentivesController.initialize()).to.be.reverted;
  });
  it('allowance on bMXX token should be granted to psm contract for pei', async () => {
    const {bMXXIncentivesController, stakedbMXX, mToken} = testEnv;
    await expect(
      (await mToken.allowance(bMXXIncentivesController.address, stakedbMXX.address)).toString()
    ).to.be.equal(MAX_UINT_AMOUNT);
  });
});

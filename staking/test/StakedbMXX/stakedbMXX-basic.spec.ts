import {makeSuite, TestEnv} from '../helpers/make-suite';
import {
  COOLDOWN_SECONDS,
  UNSTAKE_WINDOW,
  MAX_UINT_AMOUNT,
  STAKED_BMXX_NAME,
  STAKED_BMXX_SYMBOL,
  STAKED_BMXX_DECIMALS,
} from '../../helpers/constants';
import {waitForTx, timeLatest, advanceBlock, increaseTimeAndMine} from '../../helpers/misc-utils';
import {ethers} from 'ethers';
import BigNumber from 'bignumber.js';
import {compareRewardsAtAction} from './data-helpers/reward';
import {getUserIndex} from '../DistributionManager/data-helpers/asset-user-data';
import {getRewards} from '../DistributionManager/data-helpers/base-math';
import {logmTokenBalanceOf} from './data-helpers/loggers';

const {expect} = require('chai');

makeSuite('StakedbMXX. Basics', (testEnv: TestEnv) => {
  it('Initial configuration after initialize() is correct', async () => {
    const {stakedbMXX, mToken, rewardsVault} = testEnv;

    expect(await stakedbMXX.name()).to.be.equal(STAKED_BMXX_NAME);
    expect(await stakedbMXX.symbol()).to.be.equal(STAKED_BMXX_SYMBOL);
    expect(await stakedbMXX.decimals()).to.be.equal(STAKED_BMXX_DECIMALS);
    expect(await stakedbMXX.REVISION()).to.be.equal(1);
    expect(await stakedbMXX.STAKED_TOKEN()).to.be.equal(mToken.address);
    expect(await stakedbMXX.REWARD_TOKEN()).to.be.equal(mToken.address);
    expect((await stakedbMXX.COOLDOWN_SECONDS()).toString()).to.be.equal(COOLDOWN_SECONDS);
    expect((await stakedbMXX.UNSTAKE_WINDOW()).toString()).to.be.equal(UNSTAKE_WINDOW);
    expect(await stakedbMXX.REWARDS_VAULT()).to.be.equal(rewardsVault.address);
  });

  it('Reverts trying to stake 0 amount', async () => {
    const {
      stakedbMXX,
      users: [, staker],
    } = testEnv;
    const amount = '0';

    await expect(
      stakedbMXX.connect(staker.signer).stake(staker.address, amount)
    ).to.be.revertedWith('INVALID_ZERO_AMOUNT');
  });

  it('Reverts trying to activate cooldown with 0 staked amount', async () => {
    const {
      stakedbMXX,
      users: [, staker],
    } = testEnv;
    const amount = '0';

    await expect(stakedbMXX.connect(staker.signer).cooldown()).to.be.revertedWith(
      'INVALID_BALANCE_ON_COOLDOWN'
    );
  });

  it('User 1 stakes 50 BMXX: receives 50 stBMXX, StakedbMXX balance of BMXX is 50 and his rewards to claim are 0', async () => {
    const {
      stakedbMXX,
      mToken,
      users: [, staker],
    } = testEnv;
    const amount = ethers.utils.parseEther('50');

    const saveBalanceBefore = new BigNumber(
      (await stakedbMXX.balanceOf(staker.address)).toString()
    );

    // Prepare actions for the test case
    const actions = () => [
      mToken.connect(staker.signer).approve(stakedbMXX.address, amount),
      stakedbMXX.connect(staker.signer).stake(staker.address, amount),
    ];

    // Check rewards
    await compareRewardsAtAction(stakedbMXX, staker.address, actions);

    // Stake token tests
    expect((await stakedbMXX.balanceOf(staker.address)).toString()).to.be.equal(
      saveBalanceBefore.plus(amount.toString()).toString()
    );
    expect((await mToken.balanceOf(stakedbMXX.address)).toString()).to.be.equal(
      saveBalanceBefore.plus(amount.toString()).toString()
    );
    expect((await stakedbMXX.balanceOf(staker.address)).toString()).to.be.equal(amount);
    expect((await mToken.balanceOf(stakedbMXX.address)).toString()).to.be.equal(amount);
  });

  it('User 1 stakes 20 BMXX more: his total stBMXX balance increases, StakedbMXX balance of bMXX increases and his reward until now get accumulated', async () => {
    const {
      stakedbMXX,
      mToken,
      users: [, staker],
    } = testEnv;
    const amount = ethers.utils.parseEther('20');

    const saveBalanceBefore = new BigNumber(
      (await stakedbMXX.balanceOf(staker.address)).toString()
    );
    const actions = () => [
      mToken.connect(staker.signer).approve(stakedbMXX.address, amount),
      stakedbMXX.connect(staker.signer).stake(staker.address, amount),
    ];

    // Checks rewards
    await compareRewardsAtAction(stakedbMXX, staker.address, actions, true);

    // Extra test checks
    expect((await stakedbMXX.balanceOf(staker.address)).toString()).to.be.equal(
      saveBalanceBefore.plus(amount.toString()).toString()
    );
    expect((await mToken.balanceOf(stakedbMXX.address)).toString()).to.be.equal(
      saveBalanceBefore.plus(amount.toString()).toString()
    );
  });

  it('User 1 claim half rewards ', async () => {
    const {
      stakedbMXX,
      mToken,
      users: [, staker],
    } = testEnv;
    // Increase time for bigger rewards
    await increaseTimeAndMine(1000);

    const halfRewards = (await stakedbMXX.stakerRewardsToClaim(staker.address)).div(2);
    const saveUserBalance = await mToken.balanceOf(staker.address);

    await stakedbMXX.connect(staker.signer).claimRewards(staker.address, halfRewards);

    const userBalanceAfterActions = await mToken.balanceOf(staker.address);
    expect(userBalanceAfterActions.eq(saveUserBalance.add(halfRewards))).to.be.ok;
  });

  it('User 1 tries to claim higher reward than current rewards balance', async () => {
    const {
      stakedbMXX,
      mToken,
      users: [, staker],
    } = testEnv;

    const saveUserBalance = await mToken.balanceOf(staker.address);

    // Try to claim more amount than accumulated
    await expect(
      stakedbMXX
        .connect(staker.signer)
        .claimRewards(staker.address, ethers.utils.parseEther('10000'))
    ).to.be.revertedWith('INVALID_AMOUNT');

    const userBalanceAfterActions = await mToken.balanceOf(staker.address);
    expect(userBalanceAfterActions.eq(saveUserBalance)).to.be.ok;
  });

  it('User 1 claim all rewards', async () => {
    const {
      stakedbMXX,
      mToken,
      users: [, staker],
    } = testEnv;

    const userAddress = staker.address;
    const underlyingAsset = stakedbMXX.address;

    const userBalance = await stakedbMXX.balanceOf(userAddress);
    const userbMXXBalance = await mToken.balanceOf(userAddress);
    const userRewards = await stakedbMXX.stakerRewardsToClaim(userAddress);
    // Get index before actions
    const userIndexBefore = await getUserIndex(stakedbMXX, userAddress, underlyingAsset);

    // Claim rewards
    await expect(stakedbMXX.connect(staker.signer).claimRewards(staker.address, MAX_UINT_AMOUNT));

    // Get index after actions
    const userIndexAfter = await getUserIndex(stakedbMXX, userAddress, underlyingAsset);

    const expectedAccruedRewards = getRewards(
      userBalance,
      userIndexAfter,
      userIndexBefore
    ).toString();
    const userbMXXBalanceAfterAction = (await mToken.balanceOf(userAddress)).toString();

    expect(userbMXXBalanceAfterAction).to.be.equal(
      userbMXXBalance.add(userRewards).add(expectedAccruedRewards).toString()
    );
  });

  it('User 6 stakes 50 BMXX, with the rewards not enabled', async () => {
    const {stakedbMXX, mToken, users} = testEnv;
    const amount = ethers.utils.parseEther('50');
    const sixStaker = users[5];

    // Disable rewards via config
    const assetsConfig = {
      emissionPerSecond: '0',
      totalStaked: '0',
    };

    // Checks rewards
    const actions = () => [
      mToken.connect(sixStaker.signer).approve(stakedbMXX.address, amount),
      stakedbMXX.connect(sixStaker.signer).stake(sixStaker.address, amount),
    ];

    await compareRewardsAtAction(stakedbMXX, sixStaker.address, actions, false, assetsConfig);

    // Check expected stake balance for six staker
    expect((await stakedbMXX.balanceOf(sixStaker.address)).toString()).to.be.equal(
      amount.toString()
    );

    // Expect rewards balance to still be zero
    const rewardsBalance = await (
      await stakedbMXX.getTotalRewardsBalance(sixStaker.address)
    ).toString();
    expect(rewardsBalance).to.be.equal('0');
  });

  it('User 6 stakes 30 BMXX more, with the rewards not enabled', async () => {
    const {stakedbMXX, mToken, users} = testEnv;
    const amount = ethers.utils.parseEther('30');
    const staker = users[1];
    const sixStaker = users[5];
    const saveBalanceBefore = new BigNumber(
      (await stakedbMXX.balanceOf(sixStaker.address)).toString()
    );
    // Keep rewards disabled via config
    const assetsConfig = {
      emissionPerSecond: '0',
      totalStaked: '0',
    };

    // Checks rewards
    const actions = () => [
      mToken.connect(sixStaker.signer).approve(stakedbMXX.address, amount),
      stakedbMXX.connect(sixStaker.signer).stake(sixStaker.address, amount),
    ];

    await compareRewardsAtAction(stakedbMXX, sixStaker.address, actions, false, assetsConfig);

    // Expect rewards balance to still be zero
    const rewardsBalance = await (
      await stakedbMXX.getTotalRewardsBalance(sixStaker.address)
    ).toString();
    expect(rewardsBalance).to.be.equal('0');
  });

  it('Validates staker cooldown with stake() while being on valid unstake window', async () => {
    const {stakedbMXX, mToken, users} = testEnv;
    const amount1 = ethers.utils.parseEther('50');
    const amount2 = ethers.utils.parseEther('20');
    const staker = users[4];

    // Checks rewards
    const actions = () => [
      mToken.connect(staker.signer).approve(stakedbMXX.address, amount1.add(amount2)),
      stakedbMXX.connect(staker.signer).stake(staker.address, amount1),
    ];

    await compareRewardsAtAction(stakedbMXX, staker.address, actions, false);

    await stakedbMXX.connect(staker.signer).cooldown();

    const cooldownActivationTimestamp = await timeLatest();

    await advanceBlock(
      cooldownActivationTimestamp.plus(new BigNumber(COOLDOWN_SECONDS).plus(1000)).toNumber()
    ); // We fast-forward time to just after the unstake window

    const stakerCooldownTimestampBefore = new BigNumber(
      (await stakedbMXX.stakersCooldowns(staker.address)).toString()
    );
    await waitForTx(await stakedbMXX.connect(staker.signer).stake(staker.address, amount2));
    const latestTimestamp = await timeLatest();
    const expectedCooldownTimestamp = amount2
      .mul(latestTimestamp.toString())
      .add(amount1.mul(stakerCooldownTimestampBefore.toString()))
      .div(amount2.add(amount1));
    expect(expectedCooldownTimestamp.toString()).to.be.equal(
      (await stakedbMXX.stakersCooldowns(staker.address)).toString()
    );
  });
});

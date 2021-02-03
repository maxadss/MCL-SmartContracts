import { eContractid } from "./../helpers/types";
import { MintableERC20 } from "./../types/MintableErc20.d";
import { getErc20 } from "./../helpers/contracts-getters";
import { expect } from "chai";
import { LendingPoolAddressesProvider } from "./../types/LendingPoolAddressesProvider.d";
import {
  APPROVAL_AMOUNT_LENDING_POOL_CORE,
  ETHEREUM_ADDRESS,
  MAX_UINT_AMOUNT,
  NIL_ADDRESS,
  oneEther,
  RATEMODE_STABLE,
  RATEMODE_VARIABLE,
} from "../helpers/constants";
import { convertToCurrencyDecimals } from "../helpers/contracts-helpers";
import { LendingPool, LendingPoolCore, MToken, RewardsManager } from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";
import BigNumber from "bignumber.js";

makeSuite("Reward - LP - Staking", (testEnv: TestEnv) => {
  let _aDAI: MToken;
  let _DAI: MintableERC20;
  let _lendingPoolInstance: LendingPool;
  let _lendingPoolCoreInstance: LendingPoolCore;
  let _rewardManager: RewardsManager;
  let _addressProvider: LendingPoolAddressesProvider;

  before("Initializing test variables", async () => {
    const { mDAI, dai, pool, core, rewardMgr, addressesProvider } = testEnv;

    _lendingPoolInstance = pool;
    _lendingPoolCoreInstance = core;
    _rewardManager = rewardMgr;
    _addressProvider = addressesProvider;

    _aDAI = mDAI;
    _DAI = dai;
  });

  it("User 0 deposits 1000 DAI, transfers to user 1", async () => {
    const { users } = testEnv;

    const user1 = users[2];
    const user2 = users[3];
    await _DAI
      .connect(user1.signer)
      .mint(await convertToCurrencyDecimals(_DAI.address, "1000"));

    await _DAI
      .connect(user1.signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {
          // from: users[0].address,
        }
      );

    //user 1 deposits 1000 DAI
    const amountDAItoDeposit = await convertToCurrencyDecimals(
      _DAI.address,
      "1000"
    );

    await _lendingPoolInstance
      .connect(user1.signer)
      .deposit(_DAI.address, amountDAItoDeposit, "0", {
        // from: users[0],
      });

    const fromBalance = await _aDAI.balanceOf(user1.address);

    const user0Reward = await _rewardManager.readRewards(
      _DAI.address,
      user1.address,
      "0",
      fromBalance
    );
    expect(user0Reward.toString()).to.be.equal("0", "Invalid reward");

    await _aDAI
      .connect(user1.signer)
      .transfer(user2.address, amountDAItoDeposit, {
        // from: users[0]
      });

    const fromBalanceAfter = await _aDAI.balanceOf(users[0].address);
    const toBalance = await _aDAI.balanceOf(user2.address);

    expect(fromBalanceAfter.toString()).to.be.equal(
      "0",
      "Invalid from balance after transfer"
    );
    expect(toBalance.toString()).to.be.equal(
      amountDAItoDeposit.toString(),
      "Invalid to balance after transfer"
    );

    const user1Reward = await _rewardManager.readRewards(
      _DAI.address,
      user2.address,
      "0",
      toBalance
    );
    expect(user1Reward.toString()).to.be.equal("0", "Invalid reward");
  });

  it("User 1 borrow and repay, both user 1 & user 2 can earn LP reward", async () => {
    const { users, dai, mDAI } = testEnv;

    const user1 = users[2];
    const user2 = users[3];

    const amt = await convertToCurrencyDecimals(dai.address, "1000");
    await dai.connect(user1.signer).mint(amt.toString());

    await dai
      .connect(user1.signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {}
      );

    //user 1 deposits 1000 DAI
    const amountDAItoDeposit = await convertToCurrencyDecimals(
      dai.address,
      "1000"
    );

    await _lendingPoolInstance
      .connect(user1.signer)
      .deposit(dai.address, amountDAItoDeposit, "0", {
        // from: users[0],
      });

    const fromBalance = await mDAI.balanceOf(user1.address);
    const fromBalanceUser2 = await mDAI.balanceOf(user2.address);

    //user 1 borrow 500 DAI
    const amountDAIToBorrow = await convertToCurrencyDecimals(
      _DAI.address,
      "10"
    );
    // //user 1 repay 500 DAI

    await _lendingPoolInstance
      .connect(user1.signer)
      .borrow(dai.address, amountDAIToBorrow, RATEMODE_VARIABLE, "0", {
        // from: users[0],
      });
    // //user 1 repay 500 DAI
    const amountDAIToRepay = await convertToCurrencyDecimals(dai.address, "5");

    await _lendingPoolInstance
      .connect(user1.signer)
      .repay(dai.address, amountDAIToRepay.toString(), user1.address, {
        // from: users[0],
      });

    const user0RewardAfter = await _rewardManager.readRewards(
      _DAI.address,
      user1.address,
      "0",
      fromBalance.toString()
    );
    const expected = new BigNumber(amountDAIToBorrow.toString())
      .times(0.00001)
      .times(0.7)
      .div(2)
      .toString();
    expect(user0RewardAfter.toString()).to.be.equal(expected, "Invalid reward");

    const user1RewardAfter = await _rewardManager.readRewards(
      _DAI.address,
      user2.address,
      "0",
      fromBalance.toString()
    );
    expect(user1RewardAfter.toString()).to.be.equal(expected, "Invalid reward");
  });

  it("User can claim reward successfully", async () => {
    const { users, dai, mDAI } = testEnv;

    const user1 = users[2];
    const user2 = users[3];

    const fromBalance = await dai.balanceOf(user1.address);

    const user0RewardAfter = await _rewardManager.readRewards(
      _DAI.address,
      user1.address,
      "0",
      (
        await _lendingPoolInstance.getUserReserveData(
          _DAI.address,
          user1.address
        )
      ).currentMTokenBalance.toString()
    );

    await _lendingPoolInstance.connect(user1.signer).claimAllReward("0");

    const fromBalanceAfter = await dai.balanceOf(user1.address);

    const expected = "5000035000000000000";
    expect(fromBalanceAfter.toString()).to.be.equal(expected, "Invalid reward");
  });

  it("User1 & user2 start to stake Govt system, LP record his stake amount", async () => {
    const { users, dai, addressesProvider } = testEnv;

    const user1 = users[2];
    const user2 = users[3];

    const stakeAddress = await addressesProvider.getStakingToken();
    const stakeToken = await getErc20(eContractid.stkMXX, stakeAddress);

    //user1 stake 20 bmxx
    await stakeToken
      .connect(user1.signer)
      .mint(await convertToCurrencyDecimals(dai.address, "20"));

    _lendingPoolInstance.updateGovernanceStakingRewards(user1.address);

    //user2 stake 30 bmxx
    await stakeToken
      .connect(user2.signer)
      .mint(await convertToCurrencyDecimals(dai.address, "30"));

    _lendingPoolInstance.updateGovernanceStakingRewards(user2.address);
  });

  it("User1 & user2 deposit usdc, user3 borrow usdc, then user3 repay, expect user1 & user2 can earn correct reward: lp, govt reward", async () => {
    const { users, dai, mDAI, usdc } = testEnv;

    const user1 = users[2];
    const user2 = users[3];
    const user3 = users[4];
    await usdc
      .connect(user1.signer)
      .mint(await convertToCurrencyDecimals(usdc.address, "1000"));

    await usdc
      .connect(user2.signer)
      .mint(await convertToCurrencyDecimals(usdc.address, "1000"));

    await usdc
      .connect(user3.signer)
      .mint(await convertToCurrencyDecimals(usdc.address, "1000"));

    await usdc
      .connect(user1.signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {}
      );
    await usdc
      .connect(user2.signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {}
      );

    await usdc
      .connect(user3.signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {}
      );
    //user 1 deposits 10 USDC
    const amountUSDCtoDeposit = await convertToCurrencyDecimals(
      usdc.address,
      "10"
    );

    await _lendingPoolInstance
      .connect(user1.signer)
      .deposit(usdc.address, amountUSDCtoDeposit, "0", {});

    const amountUSDCtoDepositUser2 = await convertToCurrencyDecimals(
      usdc.address,
      "20"
    );
    //user 2 deposits 20 usdc
    await _lendingPoolInstance
      .connect(user2.signer)
      .deposit(usdc.address, amountUSDCtoDepositUser2, "0", {});

    //user 3 deposit 1 ETH
    await _lendingPoolInstance
      .connect(user3.signer)
      .deposit(ETHEREUM_ADDRESS, oneEther.toString(), "0", {
        value: oneEther.toString(),
      });

    //user 3 borrow 5 usdc
    const amountUSDCToBorrow = await convertToCurrencyDecimals(
      usdc.address,
      "5"
    );

    await _lendingPoolInstance
      .connect(user3.signer)
      .borrow(usdc.address, amountUSDCToBorrow, RATEMODE_VARIABLE, "0", {});

    //user 3 repay 5 USDC + fee
    const amountUSDCToRepay = await convertToCurrencyDecimals(
      usdc.address,
      "5"
    );

    console.log("Usđc address: ", usdc.address);
    await _lendingPoolInstance
      .connect(user3.signer)
      .repay(usdc.address, amountUSDCToRepay, user3.address, {});

    const userReserve = await _lendingPoolInstance.getUserReserveData(
      usdc.address,
      user1.address
    );

    //reward = (lp /total lp) * (lp reward)
    //lp reward = origination fee * 70%

    //user 1 earn lp reward: 0.000011 usdc
    const user1RewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user1.address,
      "0",
      userReserve.currentMTokenBalance.toString()
    );
    expect(user1RewardAfter.toString()).to.be.equal("11", "Invalid reward");

    //user 2 earn lp reward: 0.000023 usdc
    const user2RewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user2.address,
      "0",
      amountUSDCtoDepositUser2.toString()
    );

    expect(user2RewardAfter.toString()).to.be.equal("23", "Invalid reward");

    //user 1 earn 0.000004 usdc govt reward
    const user1GovtRewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user1.address,
      "1",
      (await convertToCurrencyDecimals(dai.address, "20")).toString()
    );

    expect(user1GovtRewardAfter.toString()).to.be.equal(
      "4",
      "Invalid govt reward"
    );

    //user 2 earn 0.000006 usdc govt reward
    const user2GovtRewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user2.address,
      "1",
      (await convertToCurrencyDecimals(dai.address, "30")).toString()
    );

    expect(user2GovtRewardAfter.toString()).to.be.equal(
      "6",
      "Invalid govt reward"
    );

    // await _lendingPoolInstance.connect(user1.signer).claimAllReward("0");

    // await _lendingPoolInstance.connect(user2.signer).claimAllReward("0");
  });

  it("user3 continue borrow usdc, then user3 repay, expect user1 & user2 can earn more reward: lp, govt reward", async () => {
    const { users, dai, mDAI, usdc } = testEnv;

    const user1 = users[2];
    const user2 = users[3];
    const user3 = users[4];

    const amountUSDCtoDepositUser2 = await convertToCurrencyDecimals(
      usdc.address,
      "20"
    );

    // //user 3 borrow 5 usdc
    const amountUSDCToBorrow = await convertToCurrencyDecimals(
      usdc.address,
      "5"
    );

    await _lendingPoolInstance
      .connect(user3.signer)
      .borrow(usdc.address, amountUSDCToBorrow, RATEMODE_VARIABLE, "0", {});

    //user 3 repay 5 USDC + fee
    const amountUSDCToRepay = await convertToCurrencyDecimals(
      usdc.address,
      "5.1"
    );
    await _lendingPoolInstance
      .connect(user3.signer)
      .repay(usdc.address, amountUSDCToRepay, user3.address, {});

    const userReserve = await _lendingPoolInstance.getUserReserveData(
      usdc.address,
      user1.address
    );

    //reward = (lp /total lp) * (lp reward)
    //lp reward = origination fee * 70%

    //user 1 earn 0.000011 usdc
    const user1RewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user1.address,
      "0",
      userReserve.currentMTokenBalance.toString()
    );
    expect(user1RewardAfter.toString()).to.be.equal("22", "Invalid reward");

    //user2 earn lp reward 0.000023 usdc
    const user2RewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user2.address,
      "0",
      amountUSDCtoDepositUser2.toString()
    );
    expect(user2RewardAfter.toString()).to.be.equal("46", "Invalid reward");

    //user1 earn 0.000004 usdc govt reward
    const user1GovtRewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user1.address,
      "1",
      (await convertToCurrencyDecimals(dai.address, "20")).toString()
    );

    expect(user1GovtRewardAfter.toString()).to.be.equal(
      "8",
      "Invalid govt reward"
    );

    //user2 earn 0.000006 usdc govt reward
    const user2GovtRewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user2.address,
      "1",
      (await convertToCurrencyDecimals(dai.address, "30")).toString()
    );

    expect(user2GovtRewardAfter.toString()).to.be.equal(
      "12",
      "Invalid govt reward"
    );
  });

  it("User1 & user2 can claim usdc reward ok: lp, govt reward", async () => {
    const { users, usdc } = testEnv;

    const user1 = users[2];
    const user2 = users[3];
    // const user3 = users[4];

    //User 1 claim lp reward
    let balanceUser1BF = await usdc.balanceOf(user1.address);
    await _lendingPoolInstance.connect(user1.signer).claimAllReward("0");
    let balanceUser1AF = await usdc.balanceOf(user1.address);
    let expected = new BigNumber(balanceUser1BF.toString()).plus(22).toString();
    expect(balanceUser1AF.toString()).to.be.equal(
      expected,
      "Invalid lp reward"
    );

    //user1 claim govt reward
    balanceUser1BF = await usdc.balanceOf(user1.address);
    await _lendingPoolInstance.connect(user1.signer).claimAllReward("1");
    balanceUser1AF = await usdc.balanceOf(user1.address);
    expected = new BigNumber(balanceUser1BF.toString()).plus(8).toString();
    expect(balanceUser1AF.toString()).to.be.equal(
      expected,
      "Invalid govt reward"
    );

    //User2 claim lp reward
    let balanceUser2BF = await usdc.balanceOf(user2.address);
    await _lendingPoolInstance.connect(user2.signer).claimAllReward("0");
    let balanceUser2AF = await usdc.balanceOf(user2.address);
    expected = new BigNumber(balanceUser2BF.toString()).plus(46).toString();
    expect(balanceUser2AF.toString()).to.be.equal(
      expected,
      "Invalid lp reward"
    );

    //user2 claim govt reward
    balanceUser2BF = await usdc.balanceOf(user2.address);
    await _lendingPoolInstance.connect(user2.signer).claimAllReward("1");
    balanceUser2AF = await usdc.balanceOf(user2.address);
    expected = new BigNumber(balanceUser2BF.toString()).plus(12).toString();
    expect(balanceUser2AF.toString()).to.be.equal(
      expected,
      "Invalid govt reward"
    );
  });

  it("User1 can still claim his reward although he has no more deposit", async () => {
    const { users, dai, mDAI, usdc, mUSDC } = testEnv;

    const user1 = users[2];
    const user2 = users[3];
    const user3 = users[4];

    const amountUSDCtoDepositUser2 = await convertToCurrencyDecimals(
      usdc.address,
      "20"
    );

    // //user 3 borrow 5 usdc
    const amountUSDCToBorrow = await convertToCurrencyDecimals(
      usdc.address,
      "5"
    );

    await _lendingPoolInstance
      .connect(user3.signer)
      .borrow(usdc.address, amountUSDCToBorrow, RATEMODE_VARIABLE, "0", {});

    //user 3 repay 5 USDC + fee
    const amountUSDCToRepay = await convertToCurrencyDecimals(
      usdc.address,
      "5.1"
    );
    await _lendingPoolInstance
      .connect(user3.signer)
      .repay(usdc.address, amountUSDCToRepay, user3.address, {});

    const userReserve = await _lendingPoolInstance.getUserReserveData(
      usdc.address,
      user1.address
    );

    //reward = (lp /total lp) * (lp reward)
    //lp reward = origination fee * 70%

    //user 1 earn 0.000011 usdc
    const user1RewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user1.address,
      "0",
      userReserve.currentMTokenBalance.toString()
    );
    expect(user1RewardAfter.toString()).to.be.equal("11", "Invalid reward");

    //user2 earn lp reward 0.000023 usdc
    const user2RewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user2.address,
      "0",
      amountUSDCtoDepositUser2.toString()
    );
    expect(user2RewardAfter.toString()).to.be.equal("23", "Invalid reward");

    //user1 earn 0.000004 usdc govt reward
    const user1GovtRewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user1.address,
      "1",
      (await convertToCurrencyDecimals(dai.address, "20")).toString()
    );

    expect(user1GovtRewardAfter.toString()).to.be.equal(
      "4",
      "Invalid govt reward"
    );

    //user2 earn 0.000006 usdc govt reward
    const user2GovtRewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user2.address,
      "1",
      (await convertToCurrencyDecimals(dai.address, "30")).toString()
    );

    expect(user2GovtRewardAfter.toString()).to.be.equal(
      "6",
      "Invalid govt reward"
    );

    //user2 start to withdraw his deposit
    await mUSDC.connect(user1.signer).redeem(MAX_UINT_AMOUNT, {});

    //User 1 claim lp reward
    let balanceUser1BF = await usdc.balanceOf(user1.address);
    await _lendingPoolInstance.connect(user1.signer).claimAllReward("0");
    let balanceUser1AF = await usdc.balanceOf(user1.address);
    let expected = new BigNumber(balanceUser1BF.toString()).plus(11).toString();
    expect(balanceUser1AF.toString()).to.be.equal(
      expected,
      "Invalid lp reward"
    );

    //user1 claim govt reward
    balanceUser1BF = await usdc.balanceOf(user1.address);
    await _lendingPoolInstance.connect(user1.signer).claimAllReward("1");
    balanceUser1AF = await usdc.balanceOf(user1.address);
    expected = new BigNumber(balanceUser1BF.toString()).plus(4).toString();
    expect(balanceUser1AF.toString()).to.be.equal(
      expected,
      "Invalid govt reward"
    );
  });

  it("User1 claims 2nd time, no more reward", async () => {
    const { users, usdc } = testEnv;

    const user1 = users[2];
    const user2 = users[3];
    // const user3 = users[4];

    //User 1 claim lp reward
    let balanceUser1BF = await usdc.balanceOf(user1.address);
    await _lendingPoolInstance.connect(user1.signer).claimAllReward("0");
    let balanceUser1AF = await usdc.balanceOf(user1.address);
    let expected = new BigNumber(balanceUser1BF.toString()).plus(0).toString();
    expect(balanceUser1AF.toString()).to.be.equal(
      expected,
      "Invalid lp reward"
    );

    //user1 claim govt reward
    balanceUser1BF = await usdc.balanceOf(user1.address);
    await _lendingPoolInstance.connect(user1.signer).claimAllReward("1");
    balanceUser1AF = await usdc.balanceOf(user1.address);
    expected = new BigNumber(balanceUser1BF.toString()).plus(0).toString();
    expect(balanceUser1AF.toString()).to.be.equal(
      expected,
      "Invalid govt reward"
    );

    await _lendingPoolInstance.connect(user2.signer).claimAllReward("0");
    await _lendingPoolInstance.connect(user2.signer).claimAllReward("1");
  });

  //   it("User1 & user2 start to stake Govt system, LP record his stake amount", async () => {
  //   const { users, dai, addressesProvider } = testEnv;

  //   const user1 = users[2];
  //   const user2 = users[3];

  //   const stakeAddress = await addressesProvider.getStakingToken();
  //   const stakeToken = await getErc20(eContractid.stkMXX, stakeAddress);
  //   // //user1 stake 20 bmxx
  //   await stakeToken
  //     .connect(user1.signer)
  //     .mint(await convertToCurrencyDecimals(dai.address, "20"));

  //   _lendingPoolInstance.updateGovernanceStakingRewards(user1.address);

  //   //user2 stake 30 bmxx
  //   await stakeToken
  //     .connect(user2.signer)
  //     .mint(await convertToCurrencyDecimals(dai.address, "30"));

  //   _lendingPoolInstance.updateGovernanceStakingRewards(user2.address);

  //   const bl = await stakeToken.balanceOf(user1.address);
  //   console.log("bl: ", bl.toString());
  // });

  it("User1 transfer mUSDC token to User2, only User2 earn LP reward", async () => {
    const { users, dai, usdc, mUSDC } = testEnv;

    const user1 = users[2];
    const user2 = users[3];
    const user3 = users[4];

    //user 1 deposit 10 DAI
    const amountUSDCToDeposit = await convertToCurrencyDecimals(
      usdc.address,
      "10"
    );

    await _lendingPoolInstance
      .connect(user1.signer)
      .deposit(usdc.address, amountUSDCToDeposit, "0", {});

    //user 3 deposit 1 ETH
    await _lendingPoolInstance
      .connect(user3.signer)
      .deposit(ETHEREUM_ADDRESS, oneEther.toString(), "0", {
        value: oneEther.toString(),
      });

    //transfer token to another user
    const mUser1Amount = await mUSDC.balanceOf(user1.address);
    console.log("mUser1Amount: ", mUser1Amount.toString());

    const mUser2AmountBF = await mUSDC.balanceOf(user2.address);
    console.log("mUser2AmountBF: ", mUser2AmountBF.toString());

    await mUSDC
      .connect(user1.signer)
      .transfer(user2.address, mUser1Amount.toString(), {});

    const mUser2Amount = await mUSDC.balanceOf(user2.address);
    console.log("mUser2Amount: ", mUser2Amount.toString());

    const amountUSDCToBorrow = await convertToCurrencyDecimals(
      usdc.address,
      "5"
    );

    await _lendingPoolInstance
      .connect(user3.signer)
      .borrow(usdc.address, amountUSDCToBorrow, RATEMODE_VARIABLE, "0", {});

    //user 3 repay 5 USDC + fee
    const amountUSDCToRepay = await convertToCurrencyDecimals(
      usdc.address,
      "5.1"
    );
    await _lendingPoolInstance
      .connect(user3.signer)
      .repay(usdc.address, amountUSDCToRepay, user3.address, {});

    //user 1 earn 0 usdc
    const userReserve = await _lendingPoolInstance.getUserReserveData(
      usdc.address,
      user1.address
    );
    const user1RewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user1.address,
      "0",
      userReserve.currentMTokenBalance.toString()
    );
    expect(user1RewardAfter.toString()).to.be.equal("0", "Invalid reward");

    //user1 earn 0.000004 usdc govt reward
    const user1GovtRewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user1.address,
      "1",
      (await convertToCurrencyDecimals(dai.address, "20")).toString()
    );

    expect(user1GovtRewardAfter.toString()).to.be.equal(
      "4",
      "Invalid govt reward"
    );

    //user2 earn lp reward 0.000035 usdc

    const user2RewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user2.address,
      "0",
      (
        await _lendingPoolInstance.getUserReserveData(
          usdc.address,
          user2.address
        )
      ).currentMTokenBalance.toString()
    );
    expect(user2RewardAfter.toString()).to.be.equal("35", "Invalid reward");

    //user2 earn 0.000006 usdc govt reward
    const user2GovtRewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user2.address,
      "1",
      (await convertToCurrencyDecimals(dai.address, "30")).toString()
    );

    expect(user2GovtRewardAfter.toString()).to.be.equal(
      "6",
      "Invalid govt reward"
    );
  });

  it("User1 transfer Stake token to User2, only User2 earn Govt reward", async () => {
    const { users, dai, addressesProvider, usdc } = testEnv;

    const user1 = users[2];
    const user2 = users[3];
    const user3 = users[4];

    const stakeAddress = await addressesProvider.getStakingToken();
    const stakeToken = await getErc20(eContractid.stkMXX, stakeAddress);

    await stakeToken
      .connect(user1.signer)
      .transfer(
        user2.address,
        await convertToCurrencyDecimals(dai.address, "20"),
        {}
      );

    _lendingPoolInstance.updateGovernanceStakingRewards(user1.address);

    _lendingPoolInstance.updateGovernanceStakingRewards(user2.address);

    const amountUSDCToBorrow = await convertToCurrencyDecimals(
      usdc.address,
      "5"
    );

    await _lendingPoolInstance
      .connect(user3.signer)
      .borrow(usdc.address, amountUSDCToBorrow, RATEMODE_VARIABLE, "0", {});

    //user 3 repay 5 USDC + fee
    const amountUSDCToRepay = await convertToCurrencyDecimals(
      usdc.address,
      "5.1"
    );
    await _lendingPoolInstance
      .connect(user3.signer)
      .repay(usdc.address, amountUSDCToRepay, user3.address, {});

    // console.log("user 1: ",  (await stakeToken.balanceOf(user1.address)).toString());
    // console.log("user 2: ",  (await stakeToken.balanceOf(user2.address)).toString());
    //user1 earn 0 usdc govt reward
    const user1GovtRewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user1.address,
      "1",
      (await stakeToken.balanceOf(user1.address)).toString()
    );

    expect(user1GovtRewardAfter.toString()).to.be.equal(
      "0",
      "Invalid govt reward"
    );

    //user2 earn 0.000006 usdc govt reward
    const user2GovtRewardAfter = await _rewardManager.readRewards(
      usdc.address,
      user2.address,
      "1",
      (await stakeToken.balanceOf(user2.address)).toString()
    );

    expect(user2GovtRewardAfter.toString()).to.be.equal(
      "20",
      "Invalid govt reward"
    );
  });
});

import { expect } from "chai";
import { LendingPoolAddressesProvider } from "./../types/LendingPoolAddressesProvider.d";
import { getLendingPoolCoreImpl } from "./../helpers/contracts-getters";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {
  APPROVAL_AMOUNT_LENDING_POOL_CORE,
  ETHEREUM_ADDRESS,
  MAX_UINT_AMOUNT,
  NIL_ADDRESS,
  oneEther,
  RATEMODE_STABLE,
  RATEMODE_VARIABLE,
} from "../helpers/constants";
import {
  getLendingPoolCoreProxy,
  getLendingPoolImpl,
  getLendingPoolProxy,
} from "../helpers/contracts-getters";
import { convertToCurrencyDecimals } from "../helpers/contracts-helpers";
import {
  LendingPool,
  LendingPoolCore,
  MintableERC20,
  MockDAI,
  MockDAIFactory,
  MToken,
  RewardsManager,
} from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";
import BigNumber from "bignumber.js";

const expectRevert = require("@openzeppelin/test-helpers").expectRevert;

makeSuite("Reward - transfer", (testEnv: TestEnv) => {
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
    console.log("_DAI: ", _DAI.address);
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
  });

  it("2 users deposit, user 1 borrow, then repay after user 1 withdraw, user 1 can earn LP reward", async () => {
    const { users, dai, mDAI } = testEnv;

    const user1 = users[2];
    const user2 = users[3];
    await dai
      .connect(user1.signer)
      .mint(await convertToCurrencyDecimals(dai.address, "1000"));
    await dai
      .connect(user2.signer)
      .mint(await convertToCurrencyDecimals(dai.address, "1000"));

    await dai
      .connect(user1.signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {}
      );
    await dai
      .connect(user2.signer)
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
      .deposit(dai.address, amountDAItoDeposit, "0", {});

    const fromBalance = await mDAI.balanceOf(user1.address);
    //user 2 deposits 1000 DAI
    await _lendingPoolInstance
      .connect(user2.signer)
      .deposit(dai.address, amountDAItoDeposit, "0", {});
    //user 1 borrow 10 DAI
    const amountDAIToBorrow = await convertToCurrencyDecimals(
      _DAI.address,
      "10"
    );

    await _lendingPoolInstance
      .connect(user1.signer)
      .borrow(dai.address, amountDAIToBorrow, RATEMODE_VARIABLE, "0", {});

    //user 2 withdraw 100%
    const fromBalanceUser2 = await mDAI.balanceOf(user2.address);

    console.log("fromBalanceUser2 ", fromBalanceUser2.toString());

    await mDAI.connect(user2.signer).redeem(fromBalanceUser2.toString(), {});

    // //user 1 repay 500 DAI
    // const amountDAIToRepay = await convertToCurrencyDecimals(
    //   dai.address,
    //   "5"
    // );

    // // user 1 repay 5 DAI
    // await _lendingPoolInstance
    //   .connect(user1.signer)
    //   .repay(dai.address, amountDAIToRepay.toString(), user1.address, {
    //   });

    // //user 1 earn 50% of LP reward
    // const user0RewardAfter = await _rewardManager.readRewards(
    //   _DAI.address,
    //   user1.address,
    //   "0",
    //   fromBalance.toString()
    // );

    // const expected = new BigNumber(amountDAIToBorrow.toString()).times(0.00001).times(0.7).toString();
    // expect(user0RewardAfter.toString()).to.be.equal(
    //   expected,
    //   "Invalid reward"
    // );
  });
});

import BigNumber from "bignumber.js";
import { expect } from "chai";
import { web3 } from "hardhat";
import {
  APPROVAL_AMOUNT_LENDING_POOL_CORE,
  ETHEREUM_ADDRESS,
  oneEther,
  oneRay,
} from "../helpers/constants";
import { getMockFlashLoanReceiver } from "../helpers/contracts-getters";
import { convertToCurrencyDecimals } from "../helpers/contracts-helpers";
import { waitForTx } from "../helpers/misc-utils";
import {
  IPriceOracle,
  LendingPool,
  LendingPoolCore,
  MintableERC20,
  MockFlashLoanReceiver,
  MToken,
} from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";
const expectRevert = require("@openzeppelin/test-helpers").expectRevert;

makeSuite("LendingPool FlashLoan function", (testEnv: TestEnv) => {
  let _lendingPoolInstance: LendingPool;
  let _lendingPoolCoreInstance: LendingPoolCore;
  let _mockFlasLoanReceiverInstance: MockFlashLoanReceiver;
  let _priceOracleInstance: IPriceOracle;
  let _mTokenInstances: MToken;
  let _tokenInstances: MintableERC20;
  //let _tokenDistributor: TokenDistributorInstance;

  let _daiAddress: string;

  let _depositorAddress: string;

  let _initialDepositorETHBalance: string;

  const halfEther = (0.5 * Math.pow(10, 18)).toString();

  before("Initializing LendingPool test variables", async () => {
    _lendingPoolInstance = testEnv.pool;
    _lendingPoolCoreInstance = testEnv.core;
    _priceOracleInstance = testEnv.oracle;
    _mTokenInstances = testEnv.mDAI;
    _mockFlasLoanReceiverInstance = await getMockFlashLoanReceiver();
    _daiAddress = testEnv.dai.address;
    _depositorAddress = testEnv.users[1].address;

    _initialDepositorETHBalance = await web3.eth.getBalance(_depositorAddress);
  });

  it("Deposits ETH into the reserve", async () => {
    const { users } = testEnv;
    const amountToDeposit = await convertToCurrencyDecimals(
      ETHEREUM_ADDRESS,
      "1"
    );

    const bal = await web3.eth.getBalance(users[1].address);
    console.log("Balance: ", bal);

    await _lendingPoolInstance
      .connect(users[1].signer)
      .deposit(ETHEREUM_ADDRESS, amountToDeposit, "0", {
        //from: _depositorAddress,
        value: amountToDeposit,
      });
  });

  it("Takes ETH flashloan, returns the funds correctly", async () => {
    //move funds to the MockFlashLoanReceiver contract
    const { deployer } = testEnv;
    await web3.eth.sendTransaction({
      from: deployer.address,
      to: _mockFlasLoanReceiverInstance.address,
      value: web3.utils.toWei("0.5", "ether"),
    });

    await _lendingPoolInstance.flashLoan(
      _mockFlasLoanReceiverInstance.address,
      ETHEREUM_ADDRESS,
      new BigNumber(0.8).multipliedBy(oneEther).toString(),
      "0x10"
    );
    const reserveData: any = await _lendingPoolInstance.getReserveData(
      ETHEREUM_ADDRESS
    );
    // const tokenDistributorBalance = await _web3.eth.getBalance(
    //   _tokenDistributor.address
    // );

    const currentLiqudityRate = reserveData.liquidityRate;
    const currentLiquidityIndex = reserveData.liquidityIndex;

    expect(reserveData.totalLiquidity.toString()).to.be.equal(
      "1000000000000000000"
    );
    expect(currentLiqudityRate.toString()).to.be.equal("0");
    // expect(currentLiquidityIndex.toString()).to.be.equal(
    //   "1000480000000000000"
    // );
    //expect(tokenDistributorBalance.toString()).to.be.equal("840000000000000");
  });

  it("Takes an ETH flashloan as big as the available liquidity", async () => {
    const { deployer, users } = testEnv;
    //move funds to the MockFlashLoanReceiver contract

    // await _lendingPoolInstance
    // .connect(users[1].signer)
    // .deposit(ETHEREUM_ADDRESS, web3.utils.toWei("1", "ether"), "0", {
    //   // from: users[0],
    // });

    let send = web3.eth.sendTransaction({
      from: deployer.address,
      to: _mockFlasLoanReceiverInstance.address,
      value: web3.utils.toWei("0.5", "ether"),
    });

    const txResult = await _lendingPoolInstance.flashLoan(
      _mockFlasLoanReceiverInstance.address,
      ETHEREUM_ADDRESS,
      "1000000000000000000",
      "0x10"
    );

    const reserveData: any = await _lendingPoolInstance.getReserveData(
      ETHEREUM_ADDRESS
    );
    // const tokenDistributorBalance = await _web3.eth.getBalance(
    //   _tokenDistributor.address
    // );

    const currentLiqudityRate = reserveData.liquidityRate;
    const currentLiquidityIndex = reserveData.liquidityIndex;

    expect(reserveData.totalLiquidity.toString()).to.be.equal(
      "1000000000000000000"
    );
    expect(currentLiqudityRate.toString()).to.be.equal("0");
    // expect(currentLiquidityIndex.toString()).to.be.equal(
    //   "1004414802000000000000000000"
    // );
    // expect(tokenDistributorBalance.toString()).to.be.equal("1892058000000000");
  });

  it("Takes ETH flashloan, does not return the funds (revert expected)", async () => {
    const { deployer } = testEnv;

    //move funds to the MockFlashLoanReceiver contract

    let send = web3.eth.sendTransaction({
      from: deployer.address,
      to: _mockFlasLoanReceiverInstance.address,
      value: web3.utils.toWei("0.5", "ether"),
    });

    await _mockFlasLoanReceiverInstance.setFailExecutionTransfer(true);

    await expectRevert(
      _lendingPoolInstance.flashLoan(
        _mockFlasLoanReceiverInstance.address,
        ETHEREUM_ADDRESS,
        new BigNumber(0.8).multipliedBy(oneEther).toString(),
        "0x10"
      ),
      "The actual balance of the protocol is inconsistent"
    );
  });

  it("tries to take a very small flashloan, which would result in 0 fees (revert expected)", async () => {
    //move funds to the MockFlashLoanReceiver contract

    await expectRevert(
      _lendingPoolInstance.flashLoan(
        _mockFlasLoanReceiverInstance.address,
        ETHEREUM_ADDRESS,
        "1", //1 wei loan
        "0x10"
      ),
      "The requested amount is too small for a flashLoan."
    );
  });

  it("tries to take a flashloan that is bigger than the available liquidity (revert expected)", async () => {
    //move funds to the MockFlashLoanReceiver contract

    await expectRevert(
      _lendingPoolInstance.flashLoan(
        _mockFlasLoanReceiverInstance.address,
        ETHEREUM_ADDRESS,
        "1004415000000000000", //slightly higher than the available liquidity
        "0x10"
      ),
      "There is not enough liquidity available to borrow"
    );
  });

  it("tries to take a flashloan using a non contract address as receiver (revert expected)", async () => {
    const { deployer } = testEnv;

    //move funds to the MockFlashLoanReceiver contract

    await expectRevert(
      _lendingPoolInstance.flashLoan(
        deployer.address,
        ETHEREUM_ADDRESS,
        "1000000000000000000",
        "0x10"
      ),
      "revert"
    );
  });

  it("Deposits DAI into the reserve", async () => {
    const { dai, users } = testEnv;

    //mints DAI to depositor
    await dai
      .connect(users[1].signer)
      .mint(await convertToCurrencyDecimals(dai.address, "1000"), {
        //  from: users[1].address,
      });

    //approve protocol to access depositor wallet
    await dai
      .connect(users[1].signer)
      .approve(
        _lendingPoolCoreInstance.address,
        APPROVAL_AMOUNT_LENDING_POOL_CORE,
        {
          // from: _depositorAddress,
        }
      );

    const amountToDeposit = await convertToCurrencyDecimals(
      _daiAddress,
      "1000"
    );

    await _lendingPoolInstance
      .connect(testEnv.users[1].signer)
      .deposit(dai.address, amountToDeposit, "0", {
        //from: _depositorAddress,
      });
  });

  it("Takes out a 500 DAI flashloan, returns the funds correctly", async () => {
    //const { DAI: daiInstance } = _tokenInstances;

    const { deployer, users, dai } = testEnv;

    await web3.eth.sendTransaction({
      from: deployer.address,
      to: _mockFlasLoanReceiverInstance.address,
      value: web3.utils.toWei("1", "ether"),
    });

    await dai
      .connect(users[1].signer)
      .mint(await convertToCurrencyDecimals(dai.address, "1000"), {
        //  from: users[1].address,
      });

    await dai
      .connect(users[1].signer)
      .transfer(
        _mockFlasLoanReceiverInstance.address,
        await convertToCurrencyDecimals(dai.address, "1000"),
        {
          //  from: users[1].address,
        }
      );

    // const bal = await dai.balanceOf(_lendingPoolCoreInstance.address);
    // console.log("core balance: ", bal.toString());

    await _mockFlasLoanReceiverInstance.setFailExecutionTransfer(false);

    await _lendingPoolInstance.flashLoan(
      _mockFlasLoanReceiverInstance.address,
      dai.address,
      new BigNumber(1).multipliedBy(oneEther).toString(),
      "0x10"
    );

    const reserveData = await _lendingPoolInstance.getReserveData(dai.address);
    console.log(reserveData.availableLiquidity.toString());

    const userData = await _lendingPoolInstance.getUserReserveData(
      dai.address,
      deployer.address
    );

    const totalLiquidity = reserveData.totalLiquidity.toString();
    const currentLiqudityRate = reserveData.liquidityRate.toString();
    const currentLiquidityIndex = reserveData.liquidityIndex.toString();
    const currentUserBalance = userData.currentMTokenBalance.toString();

    const expectedLiquidity = new BigNumber("1000.0")
      .multipliedBy(oneEther)
      .toFixed();

    const vault1 = await dai.balanceOf(
      await testEnv.addressesProvider.getLpRewardVault()
    );

    const vault2 = await dai.balanceOf(
      await testEnv.addressesProvider.getGovRewardVault()
    );

    const vault3 = await dai.balanceOf(
      await testEnv.addressesProvider.getSafetyRewardVault()
    );

    expect(totalLiquidity).to.be.equal(
      expectedLiquidity,
      "Invalid total liquidity"
    );
    expect(currentLiqudityRate).to.be.equal("0", "Invalid liquidity rate");
    expect(currentLiquidityIndex).to.be.equal(
      new BigNumber("1.0").multipliedBy(oneRay).toFixed(),
      "Invalid liquidity index"
    );
    expect(currentUserBalance.toString()).to.be.equal(
      "0",
      "Invalid user balance"
    );

    expect(vault1.toString()).to.be.equal(
      new BigNumber("0.0006").times(0.7).times(oneEther).toFixed(),
      "Invalid vault 1 balance"
    );
  });

  it("Takes out a 500 DAI flashloan, does not return the funds (revert expected)", async () => {
    //move funds to the MockFlashLoanReceiver contract

    await _mockFlasLoanReceiverInstance.setFailExecutionTransfer(true);

    await expectRevert(
      _lendingPoolInstance.flashLoan(
        _mockFlasLoanReceiverInstance.address,
        _daiAddress,
        new BigNumber(500).multipliedBy(oneEther).toString(),
        "0x10"
      ),
      "The actual balance of the protocol is inconsistent"
    );
  });
});

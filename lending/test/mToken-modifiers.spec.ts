import { MToken } from "../types";
import { makeSuite, TestEnv } from "./helpers/make-suite";

const expectRevert = require("@openzeppelin/test-helpers").expectRevert;

makeSuite("mToken: Modifiers", (testEnv: TestEnv) => {
  //contract("mToken: Modifiers", async ([deployer, ...users]) => {
  let _testEnvProvider: TestEnv;
  let _aDAI: MToken;
  let _deployer: string;

  before("Initializing test variables", async () => {
    _testEnvProvider = testEnv;
    const { deployer, mDAI } = _testEnvProvider;

    _deployer = deployer.address;
    _aDAI = mDAI;
  });

  it("Tries to invoke mintOnDeposit", async () => {
    await expectRevert(
      _aDAI.mintOnDeposit(_deployer, "1"),
      "The caller of this function must be a lending pool"
    );
  });

  it("Tries to invoke burnOnLiquidation", async () => {
    await expectRevert(
      _aDAI.burnOnLiquidation(_deployer, "1"),
      "The caller of this function must be a lending pool"
    );
  });

  it("Tries to invoke transferOnLiquidation", async () => {
    const { users } = _testEnvProvider;
    await expectRevert(
      _aDAI.transferOnLiquidation(_deployer, users[1].address, "1"),
      "The caller of this function must be a lending pool"
    );
  });
});

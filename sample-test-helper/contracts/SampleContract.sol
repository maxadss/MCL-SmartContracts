// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SampleContract {
  uint256 public val;
  constructor () public {
    val = 1234;
  }

  event Test(uint256 val);

  function Foo(uint256 _val) public {
    val = _val;
    emit Test(val);
  }
}

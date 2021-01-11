pragma solidity ^0.5.0;


interface IRewardVault {

    function withdraw(address _token, address payable _to, uint256 _amount)  external ;
}

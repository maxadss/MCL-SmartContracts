pragma solidity ^0.5.0;

contract UintStorage {
    mapping(bytes32 => uint256) private uints;

    /**
     * @dev function to return the uint associated with a given key value
     * @param _key the key value to be examined
     **/
    function getUint(bytes32 _key) public view returns (uint256) {
        return uints[_key];
    }

    /**
     * @dev function to set a key value with a provided key and value argument
     * @param _key The key to be set
     * @param _value The value to be set
     **/
    function _setUint(bytes32 _key, uint256 _value) internal {
        uints[_key] = _value;
    }
}

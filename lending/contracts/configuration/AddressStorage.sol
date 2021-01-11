pragma solidity ^0.5.0;

contract AddressStorage {
    mapping(bytes32 => address) private addresses;

    /**
     * @dev function to return the addresses associated with a given key value
     * @param _key the key value to be examined
     **/
    function getAddress(bytes32 _key) public view returns (address) {
        return addresses[_key];
    }

    /**
     * @dev function to set a key value with a provided key and value argument
     * @param _key The key to be set
     * @param _value The value to be set
     **/
    function _setAddress(bytes32 _key, address _value) internal {
        addresses[_key] = _value;
    }
}

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.4.0/contracts/token/ERC20/ERC20Detailed.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.4.0/contracts/token/ERC20/ERC20Mintable.sol";

contract Deed is ERC20Detailed, ERC20Mintable {
    /**
     * @dev - The max supply of deed tokens.
     */
    uint256 internal constant MAX_SUPPLY = 4_130_000e18;

    address bMxxAddress;
    address deedHolder;

    modifier onlyFrombMxx {
        require(
            bMxxAddress == msg.sender,
            "The caller must be a converter contract"
        );
        _;
    }

    constructor(address _deedHolder, address _bMxxAddress)
        public
        ERC20Detailed("Deed", "deed", 18)
    {
        deedHolder = _deedHolder;
        bMxxAddress = _bMxxAddress;
        _mint(deedHolder, MAX_SUPPLY);
    }

    function burnIt(uint256 _amount) external onlyFrombMxx {
        _burn(deedHolder, _amount);
    }
}

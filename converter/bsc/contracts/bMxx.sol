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

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "./DeedToken.sol";

contract bMXX is
    ERC20Detailed,
    ERC20Capped,
    ERC20Burnable,
    Ownable,
    ReentrancyGuard
{
    using SafeMath for uint256;

    constructor()
        public
        ERC20Detailed("Multiplier", "bMXX", 18)
        ERC20Capped(MAX_SUPPLY)
    {}

    /**
     * @dev - The max supply.
     */
    uint256 internal constant MAX_SUPPLY = 26_930_000e18;

    /**
     * @dev - The Deed token address.
     */
    address public deedTokenAddress;

    /**
     * @dev - The converter address.
     */
    address public converterAddress;

    modifier onlyConverter {
        require(
            converterAddress == msg.sender,
            "The caller must be a converter contract"
        );
        _;
    }

    /**
     * @dev This function assign the converter and deed token address.
     * @param _converter - The address of the converter.
     * @param _deed - The address of the Deed token.
     * Access Control: Only Owner.
     */
    function setupConverter(address _converter, address _deed)
        public
        onlyOwner
    {
        require(_converter != address(0), "Converter cannot be 0 address");
        require(_deed != address(0), "Deed cannot be 0 address");
        converterAddress = _converter;
        deedTokenAddress = _deed;
    }

    /**
     * @dev This function redeem bMxx tooken with Deed token.
     * @param _deedAmount - The amount of Deed token to use.
     * @param _toAddress - The destination address to mint the bMxx token.
     * @param _feePcnt - The fee percent.
     * Access Control: Only Converter.
     */
    function redeemWithDeed(
        uint256 _deedAmount,
        address _toAddress,
        uint256 _feePcnt
    ) external payable onlyConverter nonReentrant {
        require(deedTokenAddress != address(0), "Deed cannot be 0 address");
        require(_toAddress != address(0), "cannot redeem to the zero address");
        require(msg.value == 0, "Incorrect funds");
        require(_deedAmount != 0, "Amount cannot be 0");

        Deed(deedTokenAddress).burnIt(_deedAmount);

        uint256 feeAmt = _deedAmount.mul(_feePcnt).div(1e8);
        uint256 amtAfterFee = _deedAmount.sub(feeAmt);

        _mint(_toAddress, amtAfterFee);
        _mint(msg.sender, feeAmt);
    }
}

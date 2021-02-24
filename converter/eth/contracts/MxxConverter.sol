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

pragma solidity ^0.6.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title Mxx Converter Contract
 * @notice Contract to allow a user to deposit Mxx token to be converted to bMxx on the binance smart chain.
 */

contract MxxConverter is Ownable, ReentrancyGuard {
    // Using SafeMath Library to prevent integer overflow
    using SafeMath for uint256;

    // Using SafeERC20 for ERC20
    using SafeERC20 for ERC20;

    /**
     * @dev - A struct to store each conversion details
     * @notice amount - The amount of Mxx to be converted
     * @notice fromAddress - user's address on ETH chain
     * @notice toAddress - destination address on BSC chain
     * @notice startTime - Start Time of the conversion
     * @notice endTime - End time of the conversion
     * @notice status - The status of this conversion
     */
    struct ConversionDetails {
        uint256 amount;
        uint256 feePcnt;
        address fromAddress;
        address toAddress;
        uint48  startTime;
        uint48  endTime;
        Status  status;
    }

    /**
     * @dev - A enum to store the status of each cobversion
     */
    enum Status {Invalid, New, Completed, Refunded}

    /**
     * @dev - Events
     */
    event NewConversion(
        uint256 index,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 feePcnt,
        uint256 timeStamp
    );
    event ConversionCompleted(uint256 id);
    event ConversionRefunded(uint256 id);

    /**
     * @dev - Variable to store Official MXX ERC20 token address
     */
    address public MXX_ADDRESS;

    /**
     * @dev - Address to store the Official MXX Burn Address
     */
    address public BURN_ADDRESS;

    /**
     * @dev - The grand total number of Mxx that can be converted to BSC.
     */
    uint256 internal constant MAX_CONVERTABLE = 415_000_000e8;

    /**
     * @dev - The remaining amount of Mxx availabe for conversion.
     */
    uint256 public availableMxxAmt;

    /**
     * @dev - An incremental number to track the index of the next conversion.
     */
    uint256 public index;

    /**
     * @dev - An mapping for all conversion details.
     */
    mapping(uint256 => ConversionDetails) public allConversions;

    /**
     * @dev - The fee percent for each conversion. Default is 1_000_000 (ie 1%). 1e8 is 100%
     */
    uint256 public feePcnt = 1_000_000;

     /**
     * @dev - The max fee is 10%
     */
    uint256 public constant MAX_FEE_PCNT = 10_000_000;

    constructor(address mxx, address burnAddress) public Ownable() {
        availableMxxAmt = MAX_CONVERTABLE;
        MXX_ADDRESS = mxx;
        BURN_ADDRESS = burnAddress;
    }

    /**
     * @dev This function allows a user to deposit Mxx and start a conversion.
     * @param _toBscAddress - The BSC destination address.
     * @param _amount - The amount of Mxx to convert.
     */
    function depositForConversion(address _toBscAddress, uint256 _amount)
        external
        nonReentrant()
    {
        require(_amount != 0, "Amount cannot be 0");
        require(_amount <= availableMxxAmt, "Amount exceeded");
        require(_toBscAddress != address(0), "Invalid BSC address");

        ERC20(MXX_ADDRESS).safeTransferFrom(msg.sender, address(this), _amount);

        allConversions[index] = ConversionDetails(
            _amount,
            feePcnt,
            msg.sender,
            _toBscAddress,
            uint48(now),
            0,
            Status.New
        );

        emit NewConversion(
            index,
            msg.sender,
            _toBscAddress,
            _amount,
            feePcnt,
            block.timestamp
        );

        index = index.add(1);
        availableMxxAmt = availableMxxAmt.sub(_amount);
    }

    /**
     * @dev This function allows owner to set a conversion as completed.
     * @param _index - The index of the conversion
     * Access Control: Only Owner
     */
    function completeConversion(uint256 _index)
        external
        onlyOwner()
        nonReentrant()
    {
        require(_index < index, "Index out of range");

        ConversionDetails memory details = allConversions[_index];
        require(details.status == Status.New, "Invalid Status");

        ERC20(MXX_ADDRESS).safeTransfer(BURN_ADDRESS, details.amount);

        details.status = Status.Completed;
        details.endTime = uint48(now);
        allConversions[_index] = details;

        emit ConversionCompleted(_index);
    }

    /**
     * @dev This function allows owner to perform a refund for a conversion item.
     * @param _index - The index of the conversion
     * Access Control: Only Owner
     */
    function refund(uint256 _index) external onlyOwner() nonReentrant() {
        require(_index < index, "Index out of range");

        ConversionDetails memory details = allConversions[_index];
        require(details.status == Status.New, "Invalid Status");

        ERC20(MXX_ADDRESS).safeTransfer(details.fromAddress, details.amount);

        details.status = Status.Refunded;
        details.endTime = uint48(now);
        allConversions[_index] = details;

        emit ConversionRefunded(_index);
    }

    /**
     * @dev This function allows owner to set a new fee.
     * @param _fee - The fee
     * Access Control: Only Owner
     */
    function setFee(uint256 _fee) external onlyOwner() {
        require(_fee <= MAX_FEE_PCNT, "Max fee exceeded");
        feePcnt = _fee;
    }
}

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

// Importing libraries
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./bMxx.sol";

/**
 * @title Mxx Converter Redemption Contract
 * @notice Contract to allow server (owner) to mint bMxx on the BSC chain.
 */

contract MxxConverterRedemption is Ownable, ReentrancyGuard {
    // Using SafeMath Library to prevent integer overflow
    using SafeMath for uint256;

    /**
     * @dev - A enum to store the status of each cobversion
     */
    enum Status {Invalid, New, Completed}

    /**
     * @dev - A struct to store each redemption details
     * @notice idFromEth - The same id from ETH chain, just for cross-referencing
     * @notice amtMxx - The amount of Mxx to be converted
     * @notice amtbMxx - The amount of bMxx to be received
     * @notice fromAddress - user's ETH chain address
     * @notice toAddress - user's BSC chain address
     * @notice time - End time of the redemption
     */
    struct RedeemRecord {
        uint256 amtMxx;
        uint256 amtbMxx;
        uint256 feePcnt;
        address fromAddress;
        address toAddress;
        uint48 time;
        Status status;
    }

    /**
     * @dev - Events
     */
    event RedeemedRecorded(
        uint256 index,
        address from,
        address to,
        uint256 amtbMxx
    );

    event RedeemedSuccess(
        uint256 index,
        address from,
        address to,
        uint256 amtbMxx
    );

    /**
     * @dev - Constant variable to store conversion ratio
     */
    uint256 public constant CONVERT_RATE = 1e8; // 1e18 div by (1e8 * 100)

    /**
     * @dev - The grand total number of Mxx that can be converted to BSC.
     */
    uint256 internal constant MAX_AVAIL_BMXX_FOR_CONVERSION = 4_150_000e18;

    uint256 public availablebMxxAmt;

    uint256 public count;

    mapping(uint256 => RedeemRecord) public allRedemptions;

    address public bMxxTokenAddress;

    uint256 public constant COOL_DOWN = 15 minutes;

    address public pauserAddress;
    bool    public paused;

    constructor(address _bMxxAdress, address _pauserAddress) public Ownable() {
        pauserAddress = _pauserAddress;
        availablebMxxAmt = MAX_AVAIL_BMXX_FOR_CONVERSION;
        bMxxTokenAddress = _bMxxAdress;
    }

    modifier onlyPauser() {
        require(msg.sender == pauserAddress, "Invalid pauser");
        _;
    }

    modifier onlyNotPaused() {
        require(!paused, "Must not be paused");
        _;
    }

    function setPaused(bool _pause) external onlyPauser {
        paused = _pause;
    }

    function recordRedeem(
        uint256 _id,
        address _fromAddress,
        address _toBscAddress,
        uint256 _mxxAmt,
        uint256 _feePcnt
    ) external  nonReentrant() onlyNotPaused onlyOwner {
        RedeemRecord memory record = allRedemptions[_id];
        require(record.status == Status.Invalid, "Already exist");
        require(_mxxAmt != 0, "Amount cannot be 0");

        uint256 bMxxAmt = _mxxAmt.mul(CONVERT_RATE);

        require(bMxxAmt <= availablebMxxAmt, "Amount exceeded");

        allRedemptions[_id] = RedeemRecord(
            _mxxAmt,
            bMxxAmt,
            _feePcnt,
            _fromAddress,
            _toBscAddress,
            uint48(now),
            Status.New
        );

        emit RedeemedRecorded(_id, _fromAddress, _toBscAddress, bMxxAmt);

        count = count.add(1);
        availablebMxxAmt = availablebMxxAmt.sub(bMxxAmt);
    }

     function approveRedeem(
        uint256 _id
    ) external nonReentrant() onlyNotPaused onlyOwner {

        RedeemRecord storage record = allRedemptions[_id];
        require(record.status == Status.New, "Status must be New");

        // Check for cool-down duration //
        require(
            block.timestamp > uint256(record.time).add(COOL_DOWN),
            "Insufficient cool-down"
        );

        bMXX token = bMXX(bMxxTokenAddress);
        token.redeemWithDeed(record.amtbMxx, record.toAddress, record.feePcnt);

        record.status = Status.Completed;
        record.time = uint48(now);

        emit RedeemedSuccess(_id, record.fromAddress, record.toAddress, record.amtbMxx);
    }
}

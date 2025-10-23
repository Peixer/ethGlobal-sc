// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PYUSDTransfer is Ownable {
    using SafeERC20 for IERC20;
    
    // PYUSD token address (testnet)
    address public immutable PYUSD_TOKEN;
    
    // Events
    event TransferExecuted(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 orderId,
        uint256 timestamp
    );
    
    event OrderIdUsed(
        uint256 orderId,
        address indexed sender,
        uint256 timestamp
    );
    
    // Track used order IDs to prevent duplicates
    mapping(uint256 => bool) public usedOrderIds;
    
    constructor(
        address _pyusdToken
    ) Ownable(msg.sender) {
        require(_pyusdToken != address(0), "PYUSDTransfer: Invalid PYUSD token address");
        
        PYUSD_TOKEN = _pyusdToken;
    }
    
    /**
     * @dev Transfer PYUSD to recipient wallet
     * @param recipient Address to receive PYUSD
     * @param amount Amount of PYUSD to transfer
     * @param orderId Unique order identifier
     */
    function transferPYUSD(address recipient, uint256 amount, uint256 orderId) external {
        require(recipient != address(0), "PYUSDTransfer: Invalid recipient address");
        require(amount > 0, "PYUSDTransfer: Amount must be greater than 0");
        require(!usedOrderIds[orderId], "PYUSDTransfer: Order ID already used");
        
        // Mark order ID as used
        usedOrderIds[orderId] = true;
        
        // Transfer PYUSD from sender to recipient
        IERC20(PYUSD_TOKEN).safeTransferFrom(msg.sender, recipient, amount);
        
        // Emit events
        emit TransferExecuted(msg.sender, recipient, amount, orderId, block.timestamp);
        emit OrderIdUsed(orderId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Check if an order ID has been used
     * @param orderId Order ID to check
     * @return True if order ID has been used
     */
    function isOrderIdUsed(uint256 orderId) external view returns (bool) {
        return usedOrderIds[orderId];
    }
    
    /**
     * @dev Get contract information
     * @return pyusdToken PYUSD token address
     */
    function getContractInfo() external view returns (address pyusdToken) {
        return PYUSD_TOKEN;
    }
    
    /**
     * @dev Emergency function to withdraw stuck tokens (owner only)
     * @param token Token address to withdraw
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}

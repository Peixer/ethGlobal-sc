// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PYUSDMock
 * @dev Mock ERC20 token for testing PYUSD functionality
 * @notice This is a test token that mimics PYUSD behavior
 */
contract PYUSDMock is ERC20, Ownable {
    uint8 private _decimals;
    
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _decimals = decimals_;
        
        // Mint initial supply to the deployer
        _mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Returns the number of decimals used to get its user representation.
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Mint tokens to a specific address (for testing purposes)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "PYUSDMock: Cannot mint to zero address");
        require(amount > 0, "PYUSDMock: Amount must be greater than 0");
        
        _mint(to, amount);
    }
    
    /**
     * @dev Mint tokens to msg.sender (for testing purposes)
     * @param amount Amount of tokens to mint
     */
    function mint(uint256 amount) external {
        require(amount > 0, "PYUSDMock: Amount must be greater than 0");
        
        _mint(msg.sender, amount);
    }
    
    /**
     * @dev Burn tokens from msg.sender
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        require(amount > 0, "PYUSDMock: Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "PYUSDMock: Insufficient balance");
        
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Burn tokens from a specific address (owner only)
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) external onlyOwner {
        require(from != address(0), "PYUSDMock: Cannot burn from zero address");
        require(amount > 0, "PYUSDMock: Amount must be greater than 0");
        require(balanceOf(from) >= amount, "PYUSDMock: Insufficient balance");
        
        _burn(from, amount);
    }
}

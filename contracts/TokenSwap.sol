// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IERC20.sol";

contract TokenSwap{
    IERC20 public vickishToken;
    IERC20 public seyiToken;
    uint256 public fee =  10 wei; // Fee for each swap

    constructor (address _vickishToken, address _seyiToken) {
        vickishToken = IERC20(_vickishToken);
        seyiToken = IERC20(_seyiToken);
    }

    function swapVickishToken(uint256 _amount) external  {
        require(vickishToken.balanceOf(address(this)) >= _amount, "Not enough vickishToken in contract");
        require(vickishToken.balanceOf(msg.sender) > _amount, "User does not have  enougn Vickish tokens for this transaction");
        require(vickishToken.transferFrom(msg.sender, address(this), _amount + fee), "Transfer of vickishToken to contract failed");
        require(seyiToken.transfer(msg.sender, _amount), "Transfer of seyiToken to user failed");
    } 
    
    function swapSeyiToken(uint256 _amount) external  {
        require(seyiToken.balanceOf(address(this)) >= _amount, "Not enough seyiToken in contract");
        require(vickishToken.balanceOf(msg.sender) > _amount, "You do not have  enougn Seyi tokens for this transaction");
        require(seyiToken.transferFrom(msg.sender, address(this), _amount + fee), "Transfer of vickishToken failed");
        require(vickishToken.transfer(msg.sender, _amount), "Transfer of vickishToken failed");
    }  

    function poolVickish(uint256 _amountOfvickishToken ) external {
        require(vickishToken.transferFrom(msg.sender, address(this), _amountOfvickishToken), "Transfer of vickishToken to pool failed");
    }    
    function poolSeyi(uint256 _amountOfseyiToken) external {
        require(seyiToken.transferFrom(msg.sender, address(this), _amountOfseyiToken), "Transfer of seyiToken to pool failed");
    }

    function checkContractBalanceOfvickishToken() external view returns (uint) {
        return IERC20(vickishToken).balanceOf(address(this));
    }    
    function checkContractBalanceOfseyiToken() external view returns (uint) {
        return IERC20(seyiToken).balanceOf(address(this));
    }   

     function checkUserBalOfvickishToken(address _userBal) external view returns (uint) {
        return IERC20(vickishToken).balanceOf(_userBal);
    }    
    function checkUserBalOfseyiToken(address _userBal) external view returns (uint) {
        return IERC20(seyiToken).balanceOf(_userBal);
    }
}

// 1000000000000000000

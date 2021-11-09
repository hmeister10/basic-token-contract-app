// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract KYC is Ownable {
    mapping(address => bool) allowed;
    
    function setKYCCompleted(address _addr) public onlyOwner {
        allowed[_addr] = true;
    }
    function setKYCRevoked(address _addr) public onlyOwner {
        allowed[_addr] = false;
    }

    function kycCompleted(address _addr) public view returns(bool) {
        return allowed[_addr];
    }

}
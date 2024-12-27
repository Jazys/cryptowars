pragma solidity ^0.8.0;

contract ProxyApp {
    address public implementation;
    address public admin;

    constructor(address _implementation) {
        implementation = _implementation;
        admin = msg.sender;
    }

    function upgrade(address newImplementation) external {
        require(msg.sender == admin, "Only admin can upgrade");
        implementation = newImplementation;
    }

    fallback() external payable {
        (bool success, bytes memory data) = implementation.delegatecall(msg.data);
        require(success, "Delegatecall failed");
    }
}

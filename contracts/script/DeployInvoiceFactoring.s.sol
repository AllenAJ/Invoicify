// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/InvoiceFactoring.sol";

contract DeployInvoiceFactoring is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // PYUSD on ETH Sepolia: 0x6c3ea9036406852006290770BEdFcAbA0e23A0e8
        InvoiceFactoring invoiceFactoring = new InvoiceFactoring(0x6c3ea9036406852006290770BEdFcAbA0e23A0e8);
        
        console.log("InvoiceFactoring deployed at:", address(invoiceFactoring));
        console.log("PYUSD token address:", address(invoiceFactoring.PYUSD()));
        
        vm.stopBroadcast();
    }
}

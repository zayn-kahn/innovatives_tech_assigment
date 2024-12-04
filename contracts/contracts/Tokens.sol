//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleERC20 is ERC20 {
    constructor (address _minter) ERC20("Simple ERC20", "SimpleERC20") {
        _mint(_minter, 1_500_000 * 10 ** decimals());
    }
    
    function mint() public {
        _mint(msg.sender, 1_000 * 10 ** decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}




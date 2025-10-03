// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract VerifyMerkleRoot {
    bytes32 private root;

    constructor(bytes32 _root) {
        // (1)
        root = _root;
    }

    function verify(
        bytes32[] memory proof,
        address addr,
        uint256 amount
    ) public {
        // (2)
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(addr, amount))));
        // (3)
        require(MerkleProof.verify(proof, root, leaf), "Invalid proof");
        // (4)
        // ...
    }

    function getRoot() public view returns (bytes32) 
    {
        return root;
    }
}
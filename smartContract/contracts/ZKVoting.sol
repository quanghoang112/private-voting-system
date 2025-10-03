// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Groth16Verifier} from "./VoteCircomVerifier.sol"; // Generated from the circuit

interface IMerkleRootSource {
    function getRoot() external view returns (bytes32);
}

contract ZKVoting {
    uint256 public votingOptionsCount;
    mapping(uint256 => uint256) public voteCounts;
    mapping(bytes32 => bool) public nullifierUsed;
    bytes32 private merkleRoot;
    
    // Groth16Verifier public verifier;
    Groth16Verifier verifier = new Groth16Verifier();
    
    event VoteCast(bytes32 nullifier);
    
    // constructor(uint256 _votingOptionsCount, bytes32 _merkleRoot, address _verifierAddress) {
    //     votingOptionsCount = _votingOptionsCount;
    //     merkleRoot = _merkleRoot;
    //     verifier = Groth16Verifier(_verifierAddress);
    // }

    // constructor(uint256 _votingOptionsCount, bytes32 _merkleRoot) {
    //     votingOptionsCount = _votingOptionsCount;
    //     merkleRoot = _merkleRoot;
    //     // verifier = Groth16Verifier(_verifierAddress);
    // }

    constructor(uint256 _votingOptionsCount, address _RootContractAddress) {
        votingOptionsCount = _votingOptionsCount;
        merkleRoot = IMerkleRootSource(_RootContractAddress).getRoot();
        // verifier = Groth16Verifier(_verifierAddress);
    }
    
    function castVote(
        // uint256[8] calldata _proof,
        uint[2] calldata _pA, 
        uint[2][2] calldata _pB, 
        uint[2] calldata _pC,
        uint256 _publicKey,
        bytes32 _nullifier,
        uint256 _vote
    ) external {
        require(!nullifierUsed[_nullifier], "Vote already cast");
        
        // Verify the zero-knowledge proof
        require(
            verifier.verifyProof(
                _pA,_pB,_pC,
                [_publicKey, uint256(_nullifier), votingOptionsCount]
            ),
            "Invalid proof"
        );
        
        // Mark nullifier as used to prevent double voting
        nullifierUsed[_nullifier] = true;
        
        // Increment vote count
        voteCounts[_vote]++;
        
        emit VoteCast(_nullifier);
    }
    
    function getVoteCount(uint256 _option) external view returns (uint256) {
        require(_option < votingOptionsCount, "Invalid option");
        return voteCounts[_option];
    }

    // function isTrueRoot(bytes32 _root) external view returns (bool)
    // {
    //     return (_root == merkleRoot);
    // }
}
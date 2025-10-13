// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Groth16Verifier} from "./VoteCircomVerifier.sol"; // Generated from the circuit

interface IMerkleRootSource {
    function getRoot() external view returns (bytes32);
}

interface ICircomVerifier {
    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[5] calldata _pubSignals) external view returns (bool);
}

contract ZKVoting {
    uint256 public votingOptionsCount;
    mapping(uint256 => uint256) public voteCounts;
    mapping(bytes32 => bool) public nullifierUsed;
    // bytes32 private merkleRoot;
    
    // Groth16Verifier public verifier;
    address verifierAddress = address (new Groth16Verifier());
    // Groth16Verifier public verifier;
    
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

    constructor(uint256 _votingOptionsCount) {
        votingOptionsCount = _votingOptionsCount;
        // merkleRoot = IMerkleRootSource(_RootContractAddress).getRoot();
        // verifierAddress = _verifierAddress;
        // verifier = Groth16Verifier(_verifierAddress);
    }
    
    function castVote(
        // uint256[8] calldata _proof,
        uint[2] calldata _pA, 
        uint[2][2] calldata _pB, 
        uint[2] calldata _pC,
        uint[5] calldata _pubSignals,
        uint256 _vote
    ) public {
        require(!nullifierUsed[bytes32(_pubSignals[3])], "Vote already cast");
        
        // Verify the zero-knowledge proof
        // ICircomVerifier verifier = ICircomVerifier(verifierAddress);
        bool isValid = ICircomVerifier(verifierAddress).verifyProof(_pA, _pB, _pC, _pubSignals);
        require(
            isValid,
            "Invalid proof"
        );
        
        // Mark nullifier as used to prevent double voting
        nullifierUsed[bytes32(_pubSignals[3])] = true;
        
        // Increment vote count
        voteCounts[_vote]++;
        
        emit VoteCast(bytes32(_pubSignals[3]));
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
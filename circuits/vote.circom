
pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";
include "MerkleChecker.circom";
include "commitment.circom";
// include "merkleTree/zk/Tree.circom";
// include "merkleTree/zk/TreeChecker.circom";



template VoteCircuit() {



    //public inputs
    signal input publicKey; // We can create publicKey from privateKey inside the circuit
    // signal input merkleRoot;
    signal input nullifier;
    signal input votingOptions;
    // signal input voteCommitment; // commitment to the vote, can be used later to reveal the vote



    //private inputs
    signal input privateKey;
    signal input vote;

    // signal input merklePathIndices[depth];
    // signal input merklePath[depth];

    //create public key from private key

    // signal publicKey;
    // component pubKeyHasher = Poseidon(1);
    // pubKeyHasher.inputs[0] <== privateKey;
    // publicKey <== pubKeyHasher.out;

    

    // //Hash the public key to get the leaf
    // signal leaf;
    // component leafHasher = Poseidon(1);
    // leafHasher.inputs[0] <== publicKey;
    // leaf <== leafHasher.out;

    // //verify the voter is registered (Merkle proof check)
    // signal isMember;
    // component MerkleVerifier = MerkleTreeVerifier(depth);
    // MerkleVerifier.leaf <== leaf;
    // MerkleVerifier.pathElements <== merklePath;
    // MerkleVerifier.pathIndices <== merklePathIndices;
    // MerkleVerifier.merkleRoot <== merkleRoot;
    // isMember <== MerkleVerifier.isMember;
    // isMember === 1;

    // for (var i = 0; i < 20; i++) {
    //     merkleVerifier.pathElements[i] <== merklePathIndices[i];
    //     merkleVerifier.pathIndices[i] <== merklePath[i];
    // }


    // //commit to the vote
    // signal output VoteCommitment;
    // component voteCommitHasher = CommitmentHasher();
    // voteCommitHasher.vote <== vote;
    // voteCommitHasher.nonce <== privateKey; // using privateKey as nonce, can be any random value
    // VoteCommitment <== voteCommitHasher.commitment;

    // log(VoteCommitment);

    // Verify vote is valid
    signal output isValidVote;
    component rangeCheck = LessThan(8);
    rangeCheck.in[0] <== vote;
    rangeCheck.in[1] <== votingOptions;
    
    component checkOptions = IsEqual();
    checkOptions.in[0] <==rangeCheck.out;
    checkOptions.in[1] <== 1;
    isValidVote <== checkOptions.out;

    log(isValidVote);

    
    // Create nullifier to prevent double voting
    signal output isUsed;
    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== privateKey;
    nullifierHasher.inputs[1] <== vote;

    log(nullifierHasher.out);

    component checkNullifier = IsEqual();
    checkNullifier.in[0] <== nullifierHasher.out;
    checkNullifier.in[1] <== nullifier;
    isUsed <== checkNullifier.out;

    log(isUsed);

}



component main {public [publicKey, nullifier, votingOptions]} = VoteCircuit();
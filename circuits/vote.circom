
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


pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";
include "MerkleChecker.circom";
include "commitment.circom";

template CommitmentHasher()
{
    signal input vote;
    signal input nonce; // random value to ensure commitment is unique
    signal output commitment;

    component hasher = Poseidon(2);
    hasher.inputs[0] <== vote;
    hasher.inputs[1] <== nonce;
    commitment <== hasher.out;
}
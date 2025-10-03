pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";


template MerkleTreeVerifier(depth) {

    // public inputs
    signal input leaf;

    //private inputs
    
    signal input merkleRoot;
    signal input pathElements[depth];
    signal input pathIndices[depth];

    //output
    signal output isMember;

    //
    var currentHash = leaf;

    component hasher[depth];
    for (var i = 0; i < depth; i++) {
        hasher[i] = Poseidon(2);
    }
    
    for (var i = 0; i < depth; i++) {
        
        // if (pathIndices[i] == 0) {
        //     hasher.inputs[0] <== currentHash;
        //     hasher.inputs[1] <== pathElements[i];
        // } else {
        //     hasher.inputs[0] <== pathElements[i];
        //     hasher.inputs[1] <== currentHash;
        // }

        hasher[i].inputs[0] <-- (1 - pathIndices[i]) * currentHash + pathIndices[i] * pathElements[i];
        hasher[i].inputs[1] <-- pathIndices[i] * currentHash + (1 - pathIndices[i]) * pathElements[i];
        currentHash = hasher[i].out;
    }

    // Ensure the computed root matches the provided root
    component rootChecker = IsEqual();
    rootChecker.in[0] <== currentHash;
    rootChecker.in[1] <== merkleRoot;
    isMember <== rootChecker.out;
}


// component main = MerkleTreeVerifier(20);
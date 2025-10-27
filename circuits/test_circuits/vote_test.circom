pragma circom 2.1.2;

include "../vote.circom";

component main {public [publicKey, nullifier, votingOptions]} = VoteCircuit();
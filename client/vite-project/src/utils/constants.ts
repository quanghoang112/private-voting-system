import transactionAbi from "./Transactions.json";
import votingAbi from "./ZKVoting.json";
import merkleAbi from "./VerifyMerkleRoot.json";


export const contractABI = transactionAbi.abi;
export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const votingABI = votingAbi.abi;
export const votingContractAddress ="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const merkleABI = merkleAbi.abi;
export const merkleContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
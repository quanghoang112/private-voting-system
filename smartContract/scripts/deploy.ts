import { network } from "hardhat";
import assert from "assert";
// import {readJsonFile} from "../utils/onFile.js";




const main = async () =>
{

  const { ethers } = await network.connect({
    network: "localhost",
  });
  // const { ethers } = await network.connect(
  //   {
  //     network: "sepolia",
  //     chainType: "l1",
  //   }
  // )

  console.log("Deploying contract to network:", (await ethers.provider.getNetwork()).name);

  console.log("Deploying contract to Hardhat testnet");

  const [deployer] = await ethers.getSigners();

  // const MERKLE_ROOT_TO_DEPLOY = readJsonFile("../merkle-tree/tree.json").tree[0]; 

  const MERKLE_ROOT_TO_DEPLOY = "0x01633ae2569f4eece54b10516fbff4816490d6b19c4adf9b0258c44cf0bb0032";

  console.log(MERKLE_ROOT_TO_DEPLOY);

  //deploy merkle root and verifierMerkleContract
  const verifierMerkle = await ethers.getContractFactory("VerifyMerkleRoot");
  const verifierMerkleContract = await verifierMerkle.deploy(MERKLE_ROOT_TO_DEPLOY);

  console.log("VerifierMerkleContract: ", await verifierMerkleContract.getAddress());

  //deploy private voting contract
  const VoteOptions = 4;


  const ZKVoting = await ethers.getContractFactory("ZKVoting");
  // const ZKVotingContract = await ZKVoting.deploy(VoteOptions,MERKLE_ROOT_TO_DEPLOY);
  const ZKVotingContract = await ZKVoting.deploy(VoteOptions);

  console.log("ZKVoting Contract: ",await ZKVotingContract.getAddress());

  // console.log("is true Root: ", await ZKVotingContract.isTrueRoot(MERKLE_ROOT_TO_DEPLOY));

  // deploy room management contract 
  const roomManagement = await ethers.getContractFactory("roomManagement");
  const roomManagementContract = await roomManagement.deploy();

  console.log("roomMangement Contract: ", await roomManagementContract.getAddress());
  // console.log("allAdmins: ", await roomManagementContract.getAllAdmins());

  //deplot CircomVerifier Contract
  const Groth16Verifier = await ethers.getContractFactory("Groth16Verifier");
  const Groth16VerifierContract = await Groth16Verifier.deploy();

  console.log("Groth16Verifier Contract: ", await Groth16VerifierContract.getAddress());


  //test
//   const proofString : string[] =[
//   "0x6eac4637bee7bfb59129ab22a197942ebfbfcb39fe83a18c2352879a6e5e291c",
//   "0xa09ac6c441d244912a8e1438519aae498ef49a541982de5930e331cd8252fa5f"
// ];

//   const IsMember = await verifierMerkleContract.verify(proofString,"0x9576A6135DA7af70bBe2b10c498208Cd4b838DD7","1");

//   console.log("Is Member: ", IsMember);

  // console.log("Deployed Root: ", await verifierMerkleContract.getRoot());

  // console.log("Account balance:", balance.toString());

  // assert(balance > 0, "Not enough balance");

  // const Factory = await ethers.getContractFactory("Transactions");
  // const Transactions = await Factory.deploy();
  // console.log("Transactions : ",await Transactions.getAddress());

  // await transactions.deployed();

  
}

const runMain = async () =>
{
  try 
  {
    await main();
    process.exit(0);
  }
  catch (error)
  {
    console.error(error);
    process.exit(1);
  }
}


await runMain();

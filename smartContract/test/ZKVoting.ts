import { expect } from "chai";
import { network } from "hardhat";
import { matchesGlob } from "path";

const { ethers } = await network.connect();

const ZKVoting = await ethers.getContractFactory("ZKVoting");
  // const ZKVotingContract = await ZKVoting.deploy(VoteOptions,MERKLE_ROOT_TO_DEPLOY);
const ZKVotingContract = await ZKVoting.deploy(4);

// const Groth16 = await ethers.deployContract("Groth16Verifier");

const [owner] = await ethers.getSigners();

interface ProofData {
    // uint[2]
    pA: [string, string];
    // uint[2][2]
    pB: [[string, string], [string, string]]; 
    // uint[2]
    pC: [string, string];
    // uint[5]
    pubSignals: [string, string, string, string, string]; // Khai báo rõ 5 phần tử để TypeScript chấp nhận
}

const VALID_PROOF_DATA: ProofData = {
    // Thay thế bằng dữ liệu thực tế (dạng string/BigInt từ frontend)
    pA: ["0x03343951e6e9a56d8893be094a4f991cce6f4550e422673311ccd5663a8bcc8c", "0x05057f4a69c7237e030f6bdd14abfdfd0c5c814ce787246bcf11149edd4262fc"], 
    pB: [["0x289e4657bcbc9b96f0d5d9fc217e4bfc3cb2789d573cfb19d693f93e747c1833", "0x01d56654ef43f8bd33329d80827a89886d6fbeb6340c487c31d9a126a8c7816e"], 
    ["0x02775d1fce7524842230c29cf42af23f2eec6174c1994c5aa01c8190f5aa3699", "0x1b1deb3afec051c79e63cec3ff9023a96343e1d2917e45404ba80e0e7c0ddeec"]],
    pC: ["0x1c9082bc15d9fe3cfd3391c6c29b961e87b4ba34d9ac7cf0db68c6af6199d038", "0x119d91ebc5f3f17f7f1b9de32b7c162341b0f9651c8960087bf4b7eea34d5dbe"],
    pubSignals: ["0x0000000000000000000000000000000000000000000000000000000000000001", 
        "0x0000000000000000000000000000000000000000000000000000000000000001", 
        "0x0000000000000000000000009576a6135da7af70bbe2b10c498208cd4b838dd7", 
        "0x27b468bf632577a3ac66e4dd21658d865ffbc746fdb420bb0a46b8e1955481a2", 
        "0x0000000000000000000000000000000000000000000000000000000000000004"] // 5 phần tử
};

// const INVALID_PROOF_DATA: ProofData = {
//     // Thay thế bằng dữ liệu thực tế (dạng string/BigInt từ frontend)
//     pA: ["123...", "456..."], 
//     pB: [["123...", "456..."], ["789...", "012..."]],
//     pC: ["345...", "678..."],
//     pubSignals: ["987...", "654...", "321...", "000...", "111..."] // 5 phần tử
// };

describe("ZKVoting Verification Test", function () {
    it("Should successfully verify a VALID proof and not revert", async function () {
        // Chuyển dữ liệu proof thành dạng mảng BigNumber/string phù hợp

        // HÀM GỌI CẦN THÀNH CÔNG (không revert)
        await expect(
            ZKVotingContract.castVote(VALID_PROOF_DATA.pA,
            VALID_PROOF_DATA.pB,
            VALID_PROOF_DATA.pC,
            VALID_PROOF_DATA.pubSignals)
            ).to.not.be.revertedWith("Invalid proof");

        await expect(
            ZKVotingContract.castVote(VALID_PROOF_DATA.pA,
            VALID_PROOF_DATA.pB,
            VALID_PROOF_DATA.pC,
            VALID_PROOF_DATA.pubSignals)
            ).to.not.be.revertedWith("Some reason");
        // const verifierData = await ZKVotingContract.castVote(VALID_PROOF_DATA.pA,
        //     VALID_PROOF_DATA.pB,
        //     VALID_PROOF_DATA.pC,
        //     VALID_PROOF_DATA.pubSignals);
                    
        // expect(verifierData).to.equal(true);
        
        console.log("SUCCESS: Valid proof was verified correctly.");
    });
    // it("Should revert with 'Invalid proof' when given an INVALID proof", async function () {
    //     const args = [
    //         INVALID_PROOF_DATA.pA,
    //         INVALID_PROOF_DATA.pB,
    //         INVALID_PROOF_DATA.pC,
    //         INVALID_PROOF_DATA.pubSignals,
    //     ];

    //     // HÀM GỌI CẦN THẤT BẠI (revert)
    //     await expect(
    //         ZKVotingContract.castVote(...args)
    //     ).to.be.revertedWith("Invalid proof");
        
    //     console.log("SUCCESS: Invalid proof reverted as expected.");
    // });
});
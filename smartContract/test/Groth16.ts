import { expect } from "chai";
import { network } from "hardhat";
import { matchesGlob } from "path";

const { ethers } = await network.connect();

const Groth16 = await ethers.deployContract("Groth16Verifier");

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
    pA: ["0x11c792177381ab16d880112286759f02b9074c1aff7432aea73a910f40d13e2d", "0x172e81642d09382dcd7f1a04f2cd628b5e47227549ab861046067f4f7b834d91"], 
    pB: [["0x1f78d09d99b3214fd848c52c560c9cf9e97e13ebabff1902c5a5ebf671d2c584", "0x01e07bfeadbca36ec25392b96814520df799c1c91853db95fcce9c5f02564479"], 
    ["0x0f1318f4d1e8c609fe37eb726a2dce4394c9454505791bb4028ed12ccb4a7098", "0x02ff9299c14877bc606a3d134cb7fbaee11ca12ade91a54b54cf756169e69c48"]],
    pC: ["0x22f8bd1ee173105ffe654976d498c78fc82fd7be48ba7204f26aa0864024cc11", "0x040d7216d82c8e5a7e3eda3c8fb808b76671b149a0bbdb2e089de14837968fa5"],
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
        // await expect(
        //     ZKVotingContract.castVote(VALID_PROOF_DATA.pA,
        //     VALID_PROOF_DATA.pB,
        //     VALID_PROOF_DATA.pC,
        //     VALID_PROOF_DATA.pubSignals)
        //     ).to.not.be.reverted; 

        const verifierData = await Groth16.verifyProof(VALID_PROOF_DATA.pA,
            VALID_PROOF_DATA.pB,
            VALID_PROOF_DATA.pC,
            VALID_PROOF_DATA.pubSignals);
                    
        expect(verifierData).to.equal(true);
        
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
const express = require('express');
const { ethers } = require('ethers');
const fs = require('fs');
const snarkjs = require('snarkjs');
const { get } = require('http');

const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";


// const Energy = JSON.parse(fs.readFileSync('vote.json', 'utf-8'));


const VotingABI = [
    "function castVote( uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint256 _publicKey, bytes32 _nullifier, uint256 _vote) external"
]

const VotingContractAddress ="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";


const app = express();
const PORT = 8080;

const provider = new ethers.JsonRpcProvider('http://localhost:8545');

const wallet = new ethers.Wallet(privateKey, provider);

const getVotingContract = async () => {
    const signer = await provider.getSigner();
    const VotingContract = 
    new ethers.Contract(VotingContractAddress, VotingABI, signer);

    console.log("provider, signer, VotingContract");

    console.log({
    provider,
    signer,
    VotingContract
    });

    return VotingContract;

}


//decode information from hex string
function decodeStats(hexString) {
    if (hexString.startsWith('0x')) {
        hexString = hexString.slice(2);
    }
    const HealthHex = hexString.slice(0, 4);
    const EnergyHex = hexString.slice(4, 12);
    // const isDeadHex = hexString.slice(16, 18);
    const Health = parseInt(HealthHex, 16) | 0;
    const Energy = parseInt(EnergyHex, 16) | 0;
    // const isDead = parseInt(isDeadHex, 16) != 0;
    return { Health, Energy };
}

function decodeRecord(hexString) {
    if (hexString.startsWith('0x')) {
        hexString = hexString.slice(2);
    }
    const xHex = hexString.slice(0, 8);
    const yHex = hexString.slice(8, 16);
    const isDeadHex = hexString.slice(16, 18);
    const x = parseInt(xHex, 16) | 0;
    const y = parseInt(yHex, 16) | 0;
    // const isDead = parseInt(isDeadHex, 16) != 0;
    return { x, y };
}

function decodeOwnedBy(hexString) {
    if (hexString.startsWith('0x')) {
        hexString = hexString.slice(2);
    }
    const playerIdHex = hexString.slice(0, 64); // 32 bytes for playerId
    const valueHex = hexString.slice(64, 72); // 8 bytes for value
    const valueInt = parseInt(valueHex, 16) | 0;
    return {playerIdHex, valueInt};
}









const cors = require("cors");
app.use(cors());


app.use(express.json());

const runVotingProcess = async () => {
    try {
        console.log("-> Bắt đầu quá trình tạo Proof ZK...");
        
        // 1. TẠO ZK PROOF
        // Các inputs riêng tư/công khai của bạn (cần đảm bảo chúng là BigInts/Strings hợp lệ)
        const inputs = {
            publicKey: "0x9576A6135DA7af70bBe2b10c498208Cd4b838DD7",
            nullifier: "0x27b468bf632577a3ac66e4dd21658d865ffbc746fdb420bb0a46b8e1955481a2",
            votingOptions:4,
            privateKey:"1234",
            vote:"1",
        };

        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            inputs,
            "./zk_artifacts/vote.wasm",
            "./zk_artifacts/vote_final.zkey"
        );

        // 2. ĐỊNH DẠNG PROOF VÀ PUBLIC SIGNALS
        console.log("✅ Proof generated successfully.");
        
        let pA = proof.pi_a; pA.pop();
        let pB = proof.pi_b; pB.pop();
        let pC = proof.pi_c; pC.pop();
        
        console.log("Public Signals (Root, NullifierHash, VoteOptions):", publicSignals);

        // 3. GỬI TRANSACTION ON-CHAIN
        const VotingContract = await getVotingContract();
        
        console.log("wait VotingContract!");
        // LƯU Ý: Thay thế các placeholder "" bằng giá trị thực sự từ publicSignals
        // Cần đảm bảo thứ tự Public Signals khớp với định nghĩa trong Contract ABI
        // (Trong ABI của bạn có 3 Public Signals: _publicKey, _nullifier, _vote)
        const tx = await VotingContract.castVote(
            pA,
            pB,
            pC,
            inputs.publicKey,
            inputs.nullifier,
            inputs.vote // _publicKey (Giả định vị trí 0)
        );
        
        console.log("✅ TX sent:", tx.hash);
        
        // Chờ transaction hoàn tất (nên thêm bước này để xác nhận)
        await tx.wait(); 
        
        console.log("⭐ Bỏ phiếu thành công và đã được xác nhận trên chuỗi!");

    } catch (err) {
        console.error("❌ Error during Voting Process:", err);
    }
    
    // Thoát tiến trình sau khi hoàn tất tác vụ (vì đây là script một lần)
    // process.exit(0); 
};

app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await runVotingProcess();
});
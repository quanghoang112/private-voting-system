import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import {votingContractAddress, votingABI, votingBytecode,
    merkleContractAddress, merkleABI,
    roomsContractAddress, roomsABI,

} from "../utils/constants";
import * as snarkjs from "snarkjs";
import {poseidon2} from"poseidon-lite";

type TransactionContextType = string|undefined|{}|any;

type TransactionProviderProps ={
    children: React.ReactNode;
}

export interface Room {
    admin: string;        // wallet address của người tạo
    code: string;         // mã phòng (có thể hash)
    members?: string[];    // danh sách accounts đã join
    voteOptions: number; // số phiếu cho từng lựa chọn
    endAt?: number; // Thời gian kết thúc (ms)
//   status?: "open" | "closed";
}

const Rooms: Record<string, Room> = {};

const hash = (a: any, b: any) => poseidon2([a, b]);

export const TransactionContext = React.createContext("" as TransactionContextType);

// const { ethereum } = (typeof window !== "undefined") ? (window as any).ethereum : undefined;

const { ethereum } = window as any;

const getEthereumContract = async (contractAddress: any, abi: any) => {
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    // const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionContract = 
    new ethers.Contract(contractAddress, abi, signer);

    return transactionContract;

}

const deployZKVotingContract = async (votingOptionsCount: number, rootContractAddress: string)  =>
{

    const provider = new ethers.JsonRpcProvider('http://localhost:8545');

    // Lấy Signer (người dùng đã kết nối MetaMask)
    const signer = await provider.getSigner();

    // 1. Tạo Contract Factory
    const ZKVotingFactory = new ethers.ContractFactory(votingABI, votingBytecode, signer);

    // 2. GỌI TRIỂN KHAI (deploy) VÀ TRUYỀN ĐỐI SỐ CHO CONSTRUCTOR
    const contract = await ZKVotingFactory.deploy(
        votingOptionsCount    // Đối số 1: _votingOptionsCount
        // Ethers sẽ tự động mã hóa các đối số này và gọi constructor
    );

    // Chờ giao dịch được xác nhận
    await contract.waitForDeployment(); 

    console.log("Contract deployed at address:", await contract.getAddress());
    return contract;
}

export const TransactionProvider = ({children}: TransactionProviderProps) =>
{
    const[currentAccount, setCurrentAccount] = useState(``);
    const [formData, setFormData] = useState({ addressTo:``, amount: ``, keyword: ``, message:``});
    const [formVote, setFormVote] = useState({PrivateKey: ``, vote:``});
    const [rooms, setRooms] = useState<Record<string, Room>>({});


    const handleChangeVote = (e: React.ChangeEvent<HTMLInputElement>, name: string) =>
    {
        setFormVote((prevState) => ({...prevState, [name]: e.target.value}));
    }

    const handleChangeRoom = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    // Lấy giá trị nhập vào từ input
        const newValue = e.target.value;

        setRooms((prevState) => {
            // 1. Lấy đối tượng Room hiện tại (hoặc đối tượng rỗng nếu chưa tồn tại)
            const currentRoom = prevState[currentAccount] || {}; 

            // 2. Trả về state mới với đối tượng Room đã được cập nhật
            return {
                ...prevState, // Giữ lại tất cả các phòng khác
                [currentAccount]: {
                    ...currentRoom, // Giữ lại các thuộc tính khác của Room hiện tại
                    [name]: newValue, // Cập nhật thuộc tính có tên là 'name' (ví dụ: 'code' hoặc 'name')
                    ["admin"]: currentAccount,
                }
            };
        });
    };

    const checkIfWalletIsConnected = async () =>
    {
        try{
            if(!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({method: `eth_accounts`});

            if(accounts.length)
            {
                setCurrentAccount(accounts[0]);

                // getAllTransactions();
            }
            else
            {
                console.log("No accounts found");
            }

            console.log(accounts);
        } 
        catch(error)
        {
            console.log(error);
            throw new Error("No ethereum object.");
        }

        
    }

    const connectWallet = async () =>
    {
        try{
            if(!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({method: `eth_requestAccounts`});
        
            setCurrentAccount(accounts[0]);
        
        }
        catch(error)
        {
            console.log(error);

            throw new Error("No ethereum object.");
        }
    }

    const sendVotingContract = async () => 
    {
        try
        {
            if(!ethereum) return alert("Please install MetaMask.");

            console.log("R u ready?");
        
            const { PrivateKey,vote } = formVote;


            console.log("-> Bắt đầu quá trình tạo Proof ZK...");
            const nullifierHash = hash(PrivateKey,vote);
            console.log("nullifier: ", nullifierHash);
            
        
        // 1. TẠO ZK PROOF
        // Các inputs riêng tư/công khai của bạn (cần đảm bảo chúng là BigInts/Strings hợp lệ)
            const inputs = {
                publicKey: currentAccount,
                nullifier: nullifierHash,
                votingOptions:4,
                privateKey:PrivateKey,
                vote:vote,
            };

            console.log(inputs);

            const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                inputs,
                "./src/zk_artifacts/vote.wasm",
                "./src/zk_artifacts/vote_0001.zkey"
            );

            // 2. ĐỊNH DẠNG PROOF VÀ PUBLIC SIGNALS
            console.log("✅ Proof generated successfully.");
            
            let pA = proof.pi_a; pA.pop();
            let pB = proof.pi_b; pB.pop();
            let pC = proof.pi_c; pC.pop();

           pA = pA.map(x => ethers.toBeHex(x,32));
            pB = [
                [ethers.toBeHex(pB[0][1],32),ethers.toBeHex(pB[0][0],32)],
                [ethers.toBeHex(pB[1][1],32),ethers.toBeHex(pB[1][0],32)]
            ];
            pC = pC.map(x => ethers.toBeHex(x,32));
            pC = pC.map(x => ethers.toBeHex(x,32));
            
            
            console.log("Public Signals (Root, NullifierHash, VoteOptions):", publicSignals);

            // 3. GỬI TRANSACTION ON-CHAIN
            const VotingContract = await getEthereumContract(votingContractAddress,votingABI);
            
            console.log("wait VotingContract!");
            // LƯU Ý: Thay thế các placeholder "" bằng giá trị thực sự từ publicSignals
            // Cần đảm bảo thứ tự Public Signals khớp với định nghĩa trong Contract ABI
            // (Trong ABI của bạn có 3 Public Signals: _publicKey, _nullifier, _vote)
            const tx = await VotingContract.castVote(
                pA,
                pB,
                pC,
                publicSignals.map(x => ethers.toBeHex(x,32)),
                inputs.vote
            );
            
            console.log("✅ TX sent:", tx.hash);
            
            // Chờ transaction hoàn tất (nên thêm bước này để xác nhận)
            await tx.wait(); 
            
            console.log("⭐ Bỏ phiếu thành công và đã được xác nhận trên chuỗi!");


        }
        catch(err)
        {
            console.error("❌ Error during Voting Process:", err);
        }

    }


    const isMember = async (address: string) =>
    {
        try
        {
            if(!ethereum) return alert("Please install MetaMask.");
            const MerkleContract = await getEthereumContract(merkleContractAddress,merkleABI);

            console.log("wait MerkleContract!");

            const proof: string[] =[];
            const amount = 1;

            const isMember = await MerkleContract.verify(proof,address,amount);

            if(isMember)
            {
                console.log("Địa chỉ là thành viên hợp lệ.");
            }
            else
            {
                alert("Địa chỉ không phải là thành viên hợp lệ.");
            }
            return isMember;
        }
        catch(err)
        {
            console.error("Khong the kiem tra duoc member: ",err);
        }
    }

    const createRoom = async (_code: string, _admin: string, _voteOptions: number) =>
    {
        try
        {
            if(!ethereum) return alert("Please install MetaMask.");

            if(!currentAccount) return alert("Please connect your wallet.");

            console.log("R u ready to create room?");

            const roomsContract = await getEthereumContract(roomsContractAddress,roomsABI);

            console.log("wait roomsContract!");

            const tx = await roomsContract.createRoom(_admin,_code,_voteOptions);

            console.log("✅ TX sent:", tx.hash);

            //test
            const receipt = await tx.wait();

            console.log(await receipt.logs);
            for (const log of receipt.logs) {
                // roomsContract.interface chứa thông tin về tất cả các Events trong ABI của bạn
                // Phương thức parseLog sẽ giải mã log thô thành đối tượng dễ đọc (ParsedLog)
                const parsedLog = roomsContract.interface.parseLog(log); 

                // console.log("Parsed Log:", parsedLog); // Dòng này giúp bạn debug chi tiết

                // **********************************************
                // BẮT ĐẦU TRUY CẬP THÔNG TIN TỪ parsedLog
                // **********************************************
                
                if (parsedLog && parsedLog.name === 'RoomCreated') {
                    // 1. Lấy tên Event (ví dụ: 'AllAdminsReturned')
                    console.log("Tên Event:", parsedLog.name); 

                    // 2. Lấy các đối số (Arguments)
                    // Đây là một đối tượng Args/Result (giống như mảng).
                    // Đối số đầu tiên trong Event 'AllAdminsReturned(uint256)' là index 0.
                    const myValue = parsedLog.args[0]; 
                    
                    // 3. Giải mã và chuyển đổi sang số JavaScript
                    // returnedValue = Number(myValue); 
                    
                    console.log(`Giá trị đã giải mã: ${parsedLog.args[0]}, ${parsedLog.args[1]}, ${parsedLog.args[2]}`); // Kết quả: 5
                    break; 
                }
            }
            
            
            // Chờ transaction hoàn tất (nên thêm bước này để xác nhận)
            if (await tx.wait())
            {
                console.log("Tạo phòng thành công!");
                return true;
            }
            else
            {
                alert("Tạo phòng không thành công.");
                return false;
            }
            
        }
        catch(err)
        {
            console.error("Khong the tao duoc phong: ",err);
        }
    }

    const getRoom = async(_admin: string, _code: string) =>
    {
        try
        {
            if(!ethereum) return alert("Please install MetaMask.");



            console.log(`addressAdmin: ${_admin}, roomCode: ${_code}`);


            const roomsContract = await getEthereumContract(roomsContractAddress,roomsABI);

            console.log("wait roomsContract!");

            const tx = await roomsContract.isCorrectRoom(_admin,_code);

            // // const tx = await roomsContract.getRoom(_admin);

            // const tx = await roomsContract.getAllAdmins(5) ?? 'Oops we lost';


            if(tx)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        catch (err)
        {
            alert("Phong khong ton tai!");
            console.error("Khong the vao duoc phong: ",err);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    },[]);
    return (
        <TransactionContext.Provider value ={{ connectWallet, currentAccount, 
            formData, setFormData,
            handleChangeVote, sendVotingContract,
            formVote,setFormVote,
            rooms, setRooms, handleChangeRoom,createRoom,getRoom,
            }}>
            {children}
        </TransactionContext.Provider>
    )
}

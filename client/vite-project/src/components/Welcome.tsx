import { AiFillAlipayCircle } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { SiEthereum } from "react-icons/si";
import React, {use, useContext} from "react";
import VoteResults from "../components/votingResult"

import { TransactionContext } from "../context/TransactionContext";
import {Loader,Voting,joinRoom} from "./";
import { shortenAddress } from "../utils/shortenAddress";


const commonStyle ='min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white';
const LABEL_WIDTH = "w-32";

interface InputProps {
    placeholder?: string;
    name: string;
    type: string;
    value?: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
}

const Input =({placeholder,name,type, value, handleChange}: InputProps) =>(
    <input
        placeholder={placeholder}
        type ={type}
        step="0.0001"
        value={value}
        onChange={(e) => handleChange(e, name)}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
);

const resultTmp=4;

const Welcome = () => {

    const { connectWallet,currentAccount, setCurrentAccount,
        formData,setformData,
        handleChangeVote,sendVotingContract,
        formVote, setFormVote,
        rooms,setRooms,handleChangeRoom, createRoom, getRoom,
        checkVote,getVoteOptions,
        formLogin,setFormLogin,handleChangeLogin,
        isCorrectPrivateKey,
    } =useContext(TransactionContext);

    const [step, setStep] = React.useState<"select" | "join" | "create" | "check" | "main" | "login">("login");
    const [roomCode, setRoomCode] = React.useState("");
    const [addressAdmin, setAddressAdmin] = React.useState("");
    const [addressContract, setAddressContract] = React.useState("");
    const [voteOptions, setVoteOptions] = React.useState(0);
    const [roomCreatedAt, setRoomCreatedAt] = React.useState<number | null>(null);
    const [showResults, setShowResults] = React.useState(false);


    const handleCheckVote = async (e: any) =>
    {
        setShowResults(true);

        e.preventDefault();

        checkVote();
    }

    const handleLogin = async (e: any) =>
    {
        const {publicKey,privateKey} = formLogin;

        e.preventDefault();

        if (!publicKey || !privateKey ) return;

        console.log(`public key: ${publicKey}, private key: ${privateKey}`);

        const isCorrect: boolean = await isCorrectPrivateKey();

        console.log("is Correct: ", isCorrect);

        if(isCorrect)
        {
            setStep("select");
            setCurrentAccount(publicKey);
        }
        else
        {
            alert("Sai mat khau!");
        }


    }

    const handleVote = async (e: any) =>
    {
        const { PrivateKey,vote } = formVote;

        e.preventDefault();

        console.log(`Private key: ${PrivateKey}, vote: ${vote}`);

        if (!PrivateKey || !vote ) return;

        sendVotingContract(addressAdmin,addressContract);

    }

    const handleJoinRoom = async(e:any) =>
    {
        if(!currentAccount) 
        {
            console.log("No account connected");
            return;
        }

        e.preventDefault();

        const isCorrectRoom=await getRoom(addressAdmin, roomCode);

        const _voteOptions = await getVoteOptions(addressAdmin);

        // console.log("isCorrectRoom: ",await isCorrectRoom);

        if(isCorrectRoom)
        {
            console.log("Join phòng thành công!");
            setStep("main");
            setVoteOptions(_voteOptions);
        }
        else
        {
            alert("Sai mã phòng!");
        }
    }

    const handleCreateRoom = async (e: any) =>
    {
        if(!currentAccount) 
        {
            console.log("No account connected");
            return;
        }

        console.log("current account: ",currentAccount);
        // 
        const data = rooms[currentAccount];

        console.log("data: ",data);

        e.preventDefault();

        console.log(`code room: ${data.code}, admin: ${data.admin}, voteOptions: ${data.voteOptions}`);

        if (!data ) return;

        const now = Date.now(); // thời gian hiện tại (ms)
        setRoomCreatedAt(now);
        const isRoomcreated=await createRoom(data.code, data.admin, data.voteOptions);
        if(isRoomcreated)
            {
                setStep("check");
                setAddressContract(isRoomcreated);
                localStorage.setItem("addressContract", isRoomcreated);
                setAddressAdmin(currentAccount);
                localStorage.setItem("addressAdmin", currentAccount);
            }

    }

    // React.useEffect(() => {
    //     const saved = localStorage.getItem("addressContract");
    //     if (saved) setAddressContract(saved);
    //     const savedAdmin = localStorage.getItem("addressAdmin");
    //     if (savedAdmin) setAddressAdmin(savedAdmin);
    // }, []);

    // const handleSubmit  = async (e: any) => {
    //     const { addressTo, amount, keyword, message } = formData;

    //     e.preventDefault();

    //     if (!addressTo || !amount || !keyword || !message) return;

    //     // sendTransaction();
    // };

    React.useEffect(() => {
        if (!roomCreatedAt) return;

        const timeout = setTimeout(() => {
            setStep("check"); // chuyển sang giao diện kiểm phiếu
        }, 5 * 60 * 1000); // 5 phút

        return () => clearTimeout(timeout);
    }, [roomCreatedAt]);
    return (
        // <h1>Welcome</h1>
        <div className="flex w-full justify-center items-center">
            <div className="flex lg:flex-row flex-col items-start justify-between md:p-20 py-12 px-4 ">
                <div className="flex flex-1 justify-start flex-col lg:mr-10">
                    <h1 className="text-left text-3xl sm:text-5xl text-gradient py-1">
                        Send Crypto <br /> across the world
                    </h1>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Explore the crypto workd. Buy and sell crpytocurrencies easily on ....
                    </p>
                    {/* { !currentAccount && (
                        <button
                            type="button"
                            onClick={connectWallet}
                            className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                        >
                            <p className="text-white text-base font-semibold">Connect Wallet</p>
                        </button>
                    )} */}

                    <div className="grid sm:grid-cols-3 grid-cols-2-full w-full mt-10">
                        <div className={`rounded-tl-2xl ${commonStyle}`}>
                            Reliability
                        </div>

                        <div className={` ${commonStyle}`}>
                            Security
                        </div>

                        <div className={`rounded-tr-2xl ${commonStyle}`}>
                            Ethereum
                        </div>

                        <div className={`rounded-bl-2xl ${commonStyle}`}>
                            Web 3.0
                        </div>

                        <div className={` ${commonStyle}`}>
                            Low fees
                        </div>

                        <div className={`rounded-br-2xl ${commonStyle}`}>
                            Blockchains
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 items-center justify-start w-full lg:mt-0 mt-10">
                    <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-7 h-7 rounded-full border-1 border-white flex justify-center items-center">
                                    <SiEthereum fontSize={21} color="#fff" />
                                    
                                </div>
                                <BsInfoCircle fontSize={17} color="#fff" />

                            </div>

                            <div className="text-left">
                                <p className="text-white font-light text-sm">
                                    {shortenAddress(currentAccount)}
                                </p>

                                <p className="text-white font-semibold text-sm">
                                    Ethereum
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    
                        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                            {step ==="login" &&
                            (
                                <>
                                    <div className="flex items-center w-full rounded-sm text-white text-sm">
                                        <label className={`text-white whitespace-nowrap ${LABEL_WIDTH}`}>
                                            Public key: 
                                        </label>
                                        <input className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                                         name="publicKey"  type="text" onChange={(e) =>handleChangeLogin(e,"publicKey")}/>
                                    </div>

                                    <div className="flex items-center w-full rounded-sm text-white text-sm">
                                        <label className={`text-white whitespace-nowrap ${LABEL_WIDTH}`}>
                                            Private key: 
                                        </label>
                                        <input className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                                         name="privateKey" type="text" onChange={(e) =>handleChangeLogin(e,"privateKey")}/>
                                    </div>

                                    <button
                                        className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                                        onClick={handleLogin}
                                        >
                                            Login
                                    </button>
                                </>
                            )}
                            {step === "select" && Voting(setStep,addressContract)}
                            {step === "join" && (
                                <>
                                    <div className="flex flex-col w-full text-white">
                                        <input className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                                        type="text" placeholder="Address contract" onChange={(e) => setAddressContract(e.target.value)}/>

                                        <input className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                                        type="text" placeholder="Address admin" onChange={(e) => setAddressAdmin(e.target.value)}/>
                                        {/* <h2 className="text-2xl mb-4">Nhập mã phòng</h2> */}
                                        <input
                                                type="text"
                                                placeholder="Room Code"
                                                onChange={(e) => setRoomCode(e.target.value)}
                                                className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                                        />

                                        <div className="h-[1px] w-full bg-gray-400 my-2"/>
                                        <button
                                        className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                                        onClick={handleJoinRoom}
                                        >
                                            Vào phòng
                                        </button>
                                        
                                    </div>
                                </>
                            )}
                            {step === "create" && (
                                <>
                                    <div className="flex items-center w-full rounded-sm text-white text-sm">
                                        <label className={`text-white whitespace-nowrap ${LABEL_WIDTH}`}>
                                            Admin: 
                                        </label>
                                        <input className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                                         value={currentAccount} name="admin" type="text" readOnly/>
                                    </div>

                                    <div className="flex items-center w-full rounded-sm text-white text-sm">
                                        <label className={`text-white whitespace-nowrap ${LABEL_WIDTH}`}>
                                            Code room: 
                                        </label>
                                        <input className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                                         name="code" type="text" onChange={(e) =>handleChangeRoom(e,"code")}/>
                                    </div>

                                    <div className="flex items-center w-full rounded-sm text-white text-sm">
                                        <label className={`text-white whitespace-nowrap ${LABEL_WIDTH}`}>
                                            Vote options: 
                                        </label>
                                        <input className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                                         name="voteOptions" type="text" onChange={(e) => handleChangeRoom(e,"voteOptions")}/>
                                    </div>

                                    <div className="h-[1px] w-full bg-gray-400 my-2"/>

                                    {false
                                        ? <Loader />
                                        : (
                                            <button
                                            type="button"
                                            onClick={handleCreateRoom}
                                            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                                            >
                                            create room
                                            </button>
                                        )}

                                </>
                            )}

                            {step === "check" && (
                                <>
                                    <label className="text-white text-sm mb-2 block font-semibold"> Send address contract for voter: {addressContract}</label>
                                    {!showResults &&
                                        
                                        (
                                            <button
                                                type="button"
                                                onClick={handleCheckVote}
                                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                                >
                                                🗳️ Kiểm phiếu
                                            </button>
                                        )}
                                        {showResults &&
                                        <VoteResults autoFetch={false} roomId={addressAdmin} addressVotingContract={addressContract} voteOptions={rooms[currentAccount].voteOptions} />
                                        }
                                </>
                            )}
                            {step === "main" && (
                                <>
                                    <Input placeholder="Private key" name="PrivateKey" type="text" handleChange={handleChangeVote} />

                                    
                                    {/* VoteOptions */}
                                    <div className="w-full my-3 p-3 rounded-mdw-full my-3 p-3 rounded-md bg-[#191932] border border-[#3d4f7c]">
                                        <label className="text-white text-sm mb-2 block font-semibold">Chọn Lựa Chọn Bỏ Phiếu:</label>
                                        
                                        <ul className="flex flex-col space-y-2 text-white">
                                            {Array.from({ length: Number(voteOptions) }, (_, index) => (

                                                <div key={index} className="flex items-center">
                                                    <input className="w-4 h-4 text-pink-500 bg-gray-700 border-gray-600 focus:ring-pink-500"
                                                    type="radio" id={`vote${index+1}`} name="vote" value={index+1} onChange={(e)=>handleChangeVote(e,"vote")}/>
                                                    <label htmlFor={`vote${index+1}`} className="ml-2 text-sm cursor-pointer">Lựa chọn {index+1}</label>
                                                </div>

                                            ))}
                                        </ul>
                                    </div>
                                
                                    <div className="h-[1px] w-full bg-gray-400 my-2"/>

                                    {false
                                        ? <Loader />
                                        : (
                                            <button
                                            type="button"
                                            onClick={handleVote}
                                            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                                            >
                                            Send now
                                            </button>
                                        )}
                                </>
                            )}

                            

                            


                        </div>
                    
                </div>

            </div>
        </div>
    );
}

export default Welcome;

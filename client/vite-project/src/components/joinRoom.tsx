import React, {use, useContext} from "react";
import { TransactionContext } from "../context/TransactionContext";



const joinRoom = (roomInfo: any,setStep: any) => {

  let code=``;
  let addressAdmin=``;
  return (
  <div className="flex flex-col w-full text-white">
    <input className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    type="text" placeholder="Address admin" onChange={(e) =>{addressAdmin=e.target.value}}/>
    {/* <h2 className="text-2xl mb-4">Nhập mã phòng</h2> */}
    <input
            type="text"
            placeholder="Room Code"
            onChange={(e) => {code=e.target.value}}
            className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />

    <div className="h-[1px] w-full bg-gray-400 my-2"/>
    <button
      className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
      onClick={() => {
        
        console.log(`admin: ${addressAdmin}, code: ${code}`);
      }}
    >
        Vào phòng
    </button>
    
  </div>
)};


export default joinRoom;

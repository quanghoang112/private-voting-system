import { BsInfoCircle } from "react-icons/bs";
import { SiEthereum } from "react-icons/si";
import React, {use, useContext} from "react";

import { TransactionContext } from "../context/TransactionContext";
import {Loader} from "./";



const Voting = (setStep: any) =>
{
    return (
        <div className="flex flex-col items-center justify-center h-screen text-white">
            <h2 className="text-3xl mb-6 font-bold">Chọn phòng</h2>
            <div className="flex space-x-4">
            <button
                className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => setStep("join")}
            >
                JOIN ROOM
            </button>
            <button
                className="bg-green-600 px-6 py-2 rounded hover:bg-green-700"
                onClick={() => setStep("main")}
            >
                CREATE ROOM
            </button>
            </div>
        </div>
    );
}


export default Voting;

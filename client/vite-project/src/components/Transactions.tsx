import React from "react";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

const TransactionCard = ({addressTo, addressFrom, timestamp, message, keyword, amount, url}: {addressTo: string, addressFrom: string, timestamp: string, message: string, keyword: string, amount: string, url: string}) => 
{
    return (
        <div className="bg-[#181918] m-4 flex flex-1
            2xl:min-w-[450px]
            2xl:max-w-[500px]
            sm:min-w-[270px]
            sm:max-w-[300px]
            flex-col
            p-3
            rounded-md
            hover:shadow-2xl
            ">
        </div>
    );
}


const Transactions = () => {

    const { currentAccount } = React.useContext(TransactionContext);

    return (
        <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
            <div className="flex flex-col md:p-12 py-12 px-4">
                {currentAccount ? (
                    <h3 className="text-white text-3xl text-center my-2">
                        Latest Transactions
                    </h3>
                    ) :(
                    <h3 className="text-white text-3xl text-center my-2">
                        Connect your account to see the latest transactions
                    </h3>
                    )
                }

                <div className="flex flex-wrap justify-center items-center mt-10">
                    {}
                </div>
            </div>
        </div>
    );
}

export default Transactions;

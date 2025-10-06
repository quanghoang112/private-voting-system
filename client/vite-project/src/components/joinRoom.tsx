import React, {use, useContext} from "react";



const joinRoom = (roomCode: string|number,setRoomCode: any,setStep: any) => (
  <div className="flex flex-col items-center justify-center text-white">
    <h2 className="text-2xl mb-4">Nhập mã phòng</h2>
    <input
            type="text"
            placeholder="Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                if (roomCode === "123456") {
                    setStep("main");
                } else {
                    alert("Sai mã phòng!");
                }
                }
            }}
            className="p-2 rounded bg-gray-800 text-white mb-4"
    />
    <button
      className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      onClick={() => {
        if (roomCode === "123456") {
          setStep("main");
        } else {
          alert("Sai mã phòng!");
        }
      }}
    >
        Vào phòng
    </button>
    
  </div>
);


export default joinRoom;

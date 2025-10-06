import React, {use, useContext} from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Navbar, Welcome, Footer, Services, Transactions,Voting,joinRoom} from './components'



const App = () =>
{

  const [step, setStep] = React.useState<"select" | "join" | "main">("select");
  const [roomCode, setRoomCode] = React.useState("");
  return (
    
    <>
      {step === "select" && Voting(setStep)}
      {step === "join" && joinRoom(roomCode,setRoomCode,setStep)}
      {step === "main" && (
        <div className="flex w-full justify-center items-center">
          <div className="min-h-screen text-left">
            <div className="gradient-bg-welcome">
              <Navbar />
              <Welcome />
            </div>
            <div className="gradient-bg-services">
            <Services />
            </div>
            <Transactions />
            <Footer />
          </div>
        </div>
      )}
    </>
  )
}

export default App

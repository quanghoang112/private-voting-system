import React, {use, useContext} from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Navbar, Welcome, Footer, Services, Transactions,Voting,joinRoom} from './components'



const App = () =>
{
  return (
    
    
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
      )
}

export default App

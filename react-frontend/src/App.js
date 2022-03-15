import React, {useState} from "react";
import { Component } from "react";
import styles from "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import TokenForm from './components/tokenForm/tokenForm';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard'

// import firebase from "firebase/compat/app";

function App() {
  const [userAddress, setUserAddress] = useState(null);
  const [currentDao, setCurrentDao] = useState(null);
    return (
      <div>
        <Header setUserAddress={setUserAddress} />
        <Routes>
          <Route
            path="/"
            element={
              <Home userAddress={userAddress} setCurrentDao={setCurrentDao} />
            }
          />
          <Route
            path="/dashboard/"
            element={
              <Dashboard currentDao={currentDao} userAddress={userAddress} />
            }
          />
          <Route
            path="/create"
            element={
              <TokenForm
                userAddress={userAddress}
                setCurrentDao={setCurrentDao}
                currentDao={currentDao}
              />
            }
          />
        </Routes>
      </div>
    );
  
}

export default App;
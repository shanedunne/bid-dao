import './App.css';
import { ethers } from 'ethers';
import React from 'react';

// import

function App() {

  const {address, setAddress} = React.useState("");
  const {balance, setBalance} = React.useState(0);
  const { ethereum } = window;

  let provider;

  if(ethereum) {
    // add then and catch here
    ethereum.request({ method: 'eth_requestAccounts'})
    console.log("Metamask installed")
    provider = new ethers.providers.Web3Provider(ethereum);
    displayUserDetails()
  } else {
    console.log("install Metamask")
  }

  // const contractInstance = new ethers.Contract(contractAddress, contractJSON.abi, signer);

  async function getGreeting() {
    // const signer = await provider.getSigner();
    // const contractInstance = new ethers.Contract(contractAddress, contractJSON.abi, signer);
    // const currentGreeting = await contractInstance.greet();
  }

  async function displayUserDetails() {
    const signer = await provider.getSigner();
    const addr1 = await signer.getAddress();
    const userBalance = await provider.getBalance(addr1);

    setAddress(addr1);
    setBalance(ethers.utils.formatEther(userBalance))
  }

  return (
    <div className="App">
      <h2>Hello world</h2>
      <div className='address'>Your address: {address}</div>
      <div className='balance'>Balance: {balance}</div>
      <button className='button' onClick={getGreeting()}>Interact with Contract!</button>
    </div>
  );
}

export default App;

import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import logo from './logo.svg';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

function App() {
  console.log("Greeter ABI: ", Greeter.abi);
  const  [greeting, setGreetingValue]:any = useState();

  async function requestAccount(){
    // @ts-ignore
    await window.ethereum.request({ method: 'eth_requestAccounts'});
  }

  async function fetchGreeting(){
    // @ts-ignore
    if(typeof window.ethereum !== 'undefined'){
      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        console.log('Data:', data);
      } catch (error) {
        console.log('Error:', error);
      }
    }
  }

  async function setGreeting(){
    if(!greeting) return;
    // @ts-ignore
    if(typeof window.ethereum !== 'undefined'){
      try {
        await requestAccount();
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
        const transaction = await contract.setGreeting(greeting);
        setGreetingValue('');
        await transaction.wait();
        fetchGreeting();
      } catch (error) {
        console.log('Error:', error);
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input 
          onChange={e => setGreetingValue(e.target.value)}
          placeholder='New Greeting Value'>
        </input>
      </header>
    </div>
  );
}

export default App;

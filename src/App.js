import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
function App() {
  const [greeting, setGreeting] = useState();

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function fetchGreeting() {
    if (typeof window.ethereum == 'undefined') return;
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(contractAddress, Greeter.abi, provider)
    try {
      const data = await contract.greet()
      console.log('data: ', data)
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  async function setCGreeting() {
    if (!greeting) return
    if (typeof window.ethereum == 'undefined') return;
    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, Greeter.abi, signer)
    const transaction = await contract.setGreeting(greeting)
    await transaction.wait()
    fetchGreeting()
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <input onChange={e => setGreeting(e.target.value)} placeholder="Set greeting" />
        <button onClick={setCGreeting}>Set Greeting</button>
      </header>
    </div>
  );
}

export default App;

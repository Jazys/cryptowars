"use client";

import { useEffect, useState } from "react";
import { ethers, Contract } from "ethers";
import Wheel from "./components/Wheel";
import Map from './components/Map';
import lotteryJson from "../../artifacts/contracts/SymbolicLottery.sol/SymbolicLottery.json";
//import lotteryJson from "../../artifacts/contracts/ProxyApp.sol/ProxyApp.json";

const lotteryAbi = lotteryJson.abi;

const symbolicLotteryABI = [
  "function placeBet(uint256 choice) external payable",
  "function implementation() view returns (address)",
];

export default function LotteryApp() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [symbol, setSymbol] = useState<number | null>(null);
  const [betPlaced, setBetPlaced] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        // Demande de connexion à MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Initialisation du provider avec MetaMask
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        // Récupération du signer
        const signer = web3Provider.getSigner();

        // Initialisation du contrat avec l'adresse et l'ABI
        const contractAddress = process.env.NEXT_PUBLIC_PROXY_ADR;
        if (contractAddress) {
          const lotteryContract = new ethers.Contract(contractAddress, symbolicLotteryABI, signer);
          setContract(lotteryContract);
        }

        // Vérification du solde
        const userAddress = await signer.getAddress();
        const balance = await web3Provider.getBalance(userAddress);
        setBalance(ethers.utils.formatEther(balance));
        console.log("Solde actuel:", ethers.utils.formatEther(balance), "Sonic");
      } else {
        console.error("MetaMask non détecté");
      }
    };

    initWeb3();
  }, []);

  const handlePlaceBet = async (choice: number) => {
    if (!contract) return;
    setIsLoading(true);
    try {
      // Envoie de la transaction avec un pari de 0.1 Sonic
      const tx = await contract.placeBet(choice, { value: ethers.utils.parseEther("0.01") });
      await tx.wait();
      setBetPlaced(true);
      setSymbol(choice);
      alert("Pari placé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise:", error);
    }
    setIsLoading(false);
  };

  const handleDrawWinner = async () => {
    if (!contract) return;
    setIsLoading(true);
    try {
      const tx = await contract.drawWinner();
      await tx.wait();
      const winningNum = await contract.winningNumber();
      setWinningNumber(winningNum);
      alert(`Le numéro gagnant est : ${winningNum}`);
    } catch (error) {
      console.error("Erreur lors du tirage:", error);
    }
    setIsLoading(false);
  };

  const handleWithdraw = async () => {
    if (!contract) return;
    setIsLoading(true);
    try {
      const tx = await contract.withdrawWinnings();
      await tx.wait();
      alert("Vos gains ont été retirés avec succès !");
    } catch (error) {
      console.error("Erreur lors du retrait:", error);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Symbolic Lottery</h1>
      <p>Solde actuel : {balance} Sonic</p>
      <Wheel onFinished={(winner) => alert(`Gagnant de la roue : ${winner}`)} />
      <div style={{ margin: "2rem" }}>
        {winningNumber !== null && <h2>Numéro gagnant : {winningNumber}</h2>}
        {betPlaced && <h2>Votre pari : {symbol}</h2>}
        <button onClick={() => handlePlaceBet(Math.floor(Math.random() * 10))} disabled={isLoading}>
          Placer un pari de 0.1 Sonic
        </button>
        <button onClick={handleDrawWinner} disabled={isLoading || !betPlaced}>
          Tirer le gagnant
        </button>
        <button onClick={handleWithdraw} disabled={isLoading}>
          Retirer les gains
        </button>
      </div>
      <Map locations={[]} selectedNode={null} onNodeClick={() => {}} />
    </div>
  );
}

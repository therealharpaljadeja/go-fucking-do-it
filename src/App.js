import './App.css';
import { useState } from "react";
import { Stack, useDisclosure } from "@chakra-ui/react";
import Header from './Header';
import PromiseForm from "./PromiseForm";
import ModalComponent from "./ModalComponent";
import InstallMetamask from "./InstallMetamask";
import React from 'react';
import AddChain from './AddChain';
import Web3 from 'web3';
import HowItWorks from './HowItWorks';
import Promises from './Promises';

function App() {
  const web3 = new Web3(window.ethereum);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentAccount, setCurrentAccount] = useState(window.ethereum.selectedAddress);
  const [isHome, setIsHome] = useState(true);

  window.ethereum.on("accountsChanged", (accounts) => {
    setCurrentAccount(accounts[0]);
  });

  window.ethereum.on("chainChanged", async (chainId) => {
    const newChainId = await web3.eth.getChainId();
    setChainId(newChainId);
  });

  const [chainId, setChainId] = useState(window.ethereum.networkVersion);
  return (
    <React.Fragment>
      <Stack justify="center" spacing={20} height="100%">
        <Header setIsHome={setIsHome} currentAccount={currentAccount} setCurrentAccount={setCurrentAccount} onOpen={onOpen} chainId={chainId} chain={chainId == "137" ? "MAINNET" : "INVALID CHAIN"}  />
        {
          isHome ? 
          <PromiseForm currentAccount={currentAccount} chainId={chainId} /> :
          <Promises currentAccount={currentAccount} chainId={chainId} />
        } 
      </Stack>
      {
        window.ethereum === undefined ?
        <ModalComponent>
          <InstallMetamask isOpen="true" /> 
        </ModalComponent> :
        <ModalComponent>
          <AddChain isOpen={!(chainId == "137")} />
        </ModalComponent>
      }
      <ModalComponent>
        <HowItWorks onClose={onClose} isOpen={isOpen} />
      </ModalComponent>
    </React.Fragment>
  );
}

export default App;

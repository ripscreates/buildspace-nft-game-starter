import React, {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import RapBattleGame from './utils/RapBattleGame.json';


import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena/Arena';
// import LoadingIndicator from './Components/LoadingIndicator';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';

// Constants
const TWITTER_HANDLE = 'ripscreates';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;


const App = () => {
  /*
   * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
   */
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);

  /*
   * Since this method will take some time, make sure to declare it as async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Yo Where MetaMask at?!');
        return;
      } else {
        console.log('Bet! We gotz the ethereumz object', ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      /*
       * User can have multiple authorized accounts, we grab the first one if its there!
       */
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Bet! Found a legit authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('Sorry Homes! No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderContent = () => {
    // if (isLoading) {
    //   return <LoadingIndicator />;
    // }
    /*
    * Scenario #1
    */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://i.imgur.com/WozCBof.gif"
            alt="Rap Battle Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
      * Scenario #2
      */
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('BRUH! Go Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Boom! We are Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

   /*
   * This runs our function when the page loads.
   */
   useEffect(() => {
    // setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

    /*
  * Add this useEffect right under the other useEffect where you are calling checkIfWalletIsConnected
  */
    useEffect(() => {
      const fetchNFTMetadata = async () => {
        console.log('Checking for Rap Battle NFTs on address:', currentAccount);
    
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const gameContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          RapBattleGame.abi,
          signer
        );
    
        const characterNFT = await gameContract.checkIfUserHasNFT();
        if (characterNFT.name) {
          console.log('Playa Playa has Rap Battle NFT');
          setCharacterNFT(transformCharacterData(characterNFT));
        }
    
        /*
         * Once we are done with all the fetching, set loading state to false
         */
        // setIsLoading(false);
      };
    
      if (currentAccount) {
        console.log('CurrentAccount:', currentAccount);
        fetchNFTMetadata();
      }
    }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🎤 Meme-Metaverse Rap Battle 🎤</p>
          <p className="sub-text">Team up to protect our turf from the boss rival!!</p>
          <div className="connect-wallet-container">
            {/* <img
              src="https://i.imgur.com/5qIm0JL.png"
              alt="Wizard War logo"
            /> */}
            {/* This is where our button and image code used to be!
            *	Remember we moved it into the render method.
            */}
            {renderContent()}
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with 💕 @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

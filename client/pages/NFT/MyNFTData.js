import React, { useState, useEffect } from 'react';
import MainTitle from "../MainTitle";
import kip17Abi from "../../components/kip17Abi";
import Mystyles from "../../styles/mynft.module.css";
import FireBaseInit from '../../components/FireBaseInit';

const MyNFTData = ({ caver, newKip17addr }) => {
  const [nftlist, setNftlist] = useState([]);  
  const [GameNFTlist, setGameNFTlist] = useState([]);
  const [Showlist, setShowlist] = useState([]);
  const [isGameNFT, setGameNFT] = useState(false);

  //Firebase Database 
  const [Info, setInfos] = useState({
    Contract: '',
    GameItemValue: -1,
    Token: -1
  });

  const SaveMyToken = async () =>{
    const tokenContract = "";
    const account = window.sessionStorage.getItem('ID');

    console.log("NFT : " + newKip17addr);
    console.log("account : " + account);

    tokenContract = await new caver.klay.Contract(kip17Abi, newKip17addr);

    const name = await tokenContract.methods.name().call();
    const symbol = await tokenContract.methods.symbol().call();
    const totalSupply = await tokenContract.methods.totalSupply().call();

    const JsonURL = '';
    const JsonName = '';
    const JsonDescription = '';
    const FireBaseDB = false;

    let arr = [];
    for (let i = 1; i <= totalSupply; i++) {
      arr.push(i);
    }

    for (let tokenId of arr) {
      let tokenOwner = await tokenContract.methods.ownerOf(tokenId).call();
      if (String(tokenOwner).toLowerCase() === account) 
      {
        let tokenURI = await tokenContract.methods.tokenURI(tokenId).call();
        FireBaseDB = false;

        if (tokenURI != '') 
        {
          const MetaDataJson = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
          const GetJson = await fetch(MetaDataJson);

          const jsonFile = await GetJson.json();
          console.log("jsonFile : " + JSON.stringify(jsonFile));

          JsonName = jsonFile.name;

          JsonDescription = jsonFile.description;
          const Image = jsonFile.image;
          JsonURL = Image.replace("ipfs://", "https://ipfs.io/ipfs/");
          console.log("JsonURL : " + JsonURL);

          //FireBaseNFTData(name, symbol, tokenId, JsonURL, JsonName, JsonDescription);
          const NFTItem = FireBaseInit.collection("NFT_ITEM");

          NFTItem.doc(JsonName).get().then((doc) => {
            if(doc.exists)
            { 
              console.log("파이어베이스 이제 들어옴");

              FireBaseDB = true;
              setGameNFTlist((prevState) => {
                return [...prevState, {name, symbol, tokenId, JsonURL, JsonName, JsonDescription, FireBaseDB }];
              });        
            }
          });
        }

        setNftlist((prevState) => {
          return [...prevState, {name, symbol, tokenId, JsonURL, JsonName, JsonDescription, FireBaseDB }];
        });

        setShowlist((prevState) => {
          return [...prevState, {name, symbol, tokenId, JsonURL, JsonName, JsonDescription, FireBaseDB }];
        });
      }
    }

  };  
 

  return (
    <div>
      <MainTitle />
    </div>

  )
}

export default MyNFTData;
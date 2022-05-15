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

  useEffect(() => {
    SaveMyToken();
    KasMigrate();
    /*
    TokenHistoryQueryOptions options = new TokenHistoryQueryOptions();
    options.setStatus("completed");
    options.setSize((long)1);
    options.setType("KIP-7");

    PageableFtContractDetails details = caver.kas.tokenHistory.getFTContractList(options);
    System.out.println(details);
    */



  }, []);

  /*
  void getContractList() {
    try {
        Kip17ContractListResponse response = caver.kas.kip17.getContractList();
    } catch(ApiException e) {
        //handle error
    }
  }
  */

  const KasMigrate = async () => {
    const CaverExtKAS = require('caver-js-ext-kas');
    const caverExt = new CaverExtKAS();

    const account = 'KASKY2SYRNZ8X68SL3QKRT4C';
    const privateKey = '8AMfKLWAzy8pSALU5Emo_iijrX7K6dqOPezqOH7x';
    const chainId = '1001';
    caverExt.initKASAPI(chainId, account, privateKey);
    console.log("Init KIP17 API");

    const contracts = await caverExt.kas.kip17.getContractList();
    console.log("GetContractList : " + JSON.stringify(contracts));

    const query = {
      status: caverExt.kas.tokenHistory.queryOptions.status.COMPLETED,
      size: 100,
      type: caverExt.kas.tokenHistory.queryOptions.type.KIP17,
  }
    const result = await caverExt.kas.tokenHistory.getNFTContractList(query); 
    console.log("getNFTContractList : " + JSON.stringify(result));

    /* 
    // Create a KeyringContainer instance
    const keyringContainer = new caverExt.keyringContainer();

    // Create a keyring from private key

    const keyring = keyringContainer.keyring.createFromPrivateKey(privateKey);

    // Add a keyring to the keyringContainer
    keyringContainer.add(keyring);
    */


    //const address = keyring.address;
    //const key = keyring.key.privateKey;
    //const nonce = 0;

    //const ret = await caver.kas.wallet.migrateAccounts([{ address, key, nonce }]);
    //console.log(ret); 
  }

  const SettingGameNFT = (isOK) => {
    setGameNFT(isOK);
    if (isOK == true)
      setShowlist(GameNFTlist);
    else
      setShowlist(nftlist);

  }


  const SaveMyToken = async () => {
    const tokenContract = "";
    const account = window.sessionStorage.getItem('ID');

    console.log("NFT : " + newKip17addr);
    console.log("account : " + account);

    tokenContract = await new caver.klay.Contract(kip17Abi, newKip17addr);

    const name = await tokenContract.methods.name().call();
    const symbol = await tokenContract.methods.symbol().call();
    const totalSupply = await tokenContract.methods.totalSupply().call();

    const option = tokenContract.options;

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
      //let blocknumber = await caver.rpc.klay.getBlockByNumber(tokenId);
      //let blockhash = await caver.rpc.klay.getFilterLogs(account);
      //console.log("blockhash : " + JSON.stringify(blockhash));

      //transaction.getTransactionHash()
      //transaction.getSenderTxHash()

      if (String(tokenOwner).toLowerCase() === account) {
        let tokenURI = await tokenContract.methods.tokenURI(tokenId).call();
        FireBaseDB = false;
        console.log("tokenURI : " + tokenURI);

        //Nft nft = caver.kas.tokenHistory.getNFT(contractAddress, tokenId);
        //System.out.println(nft);

        const URL = tokenURI.substring(0, 7);
        if (URL == "ipfs://") {
          const MetaDataJson = tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");

          //const config = { headers : { 'Accept' : 'application/json'}};
          //const GetJson = await fetch(MetaDataJson,config);
          const GetJson = await fetch(MetaDataJson);

          const jsonFile = await GetJson.json();
          console.log("jsonFile : " + JSON.stringify(jsonFile));

          JsonName = jsonFile.name;

          JsonDescription = jsonFile.description;
          const Image = jsonFile.image;
          JsonURL = Image.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
          console.log("JsonURL : " + JsonURL);

          //FireBaseNFTData(name, symbol, tokenId, JsonURL, JsonName, JsonDescription);
          const NFTItem = FireBaseInit.collection("NFT_ITEM");

          NFTItem.doc(JsonName).get().then((doc) => {
            if (doc.exists) {
              console.log("파이어베이스 이제 들어옴");

              FireBaseDB = true;
              setGameNFTlist((prevState) => {
                return [...prevState, { name, symbol, tokenId, JsonURL, JsonName, JsonDescription, FireBaseDB }];
              });
            }
          });
        }
        else {
          JsonName = tokenURI;
        }

        setNftlist((prevState) => {
          return [...prevState, { name, symbol, tokenId, JsonURL, JsonName, JsonDescription, FireBaseDB }];
        });

        setShowlist((prevState) => {
          return [...prevState, { name, symbol, tokenId, JsonURL, JsonName, JsonDescription, FireBaseDB }];
        });
      }
    }

  };


  return (
    <div>
      <MainTitle />
      <div>
        <button type="button" className="btn btn-outline-dark" onClick={() => { SettingGameNFT(false) }}>ALL NFT</button>
        <button type="button" className="btn btn-outline-dark" onClick={() => { SettingGameNFT(true) }}>Game NFT</button>
      </div>
      {Showlist.map((token) => {
        return (
          <form className={Mystyles.todoNFTShowtemplate} key={token.id}>
            <div className="card mb-3">
              <h3 className="card-header">{token.FireBaseDB ? token.name + " GameNFT" : token.name}</h3>
              <div className="card-body">
                <img
                  src={token.JsonURL}
                  alt={token.id}
                  style={{ width: "100%", height: "80%", objectFit: "cover", borderTopLeftRadius: "inherit", borderTopRightRadius: "inherit", margin: "0.1px" }}
                />
              </div>

              <ul className="list-group list-group-flush">
                <li className="list-group-item">이름 : {token.JsonName} </li>
                <li className="list-group-item">ID : {token.tokenId} </li>
                <li className="list-group-item">심볼 : {token.symbol}</li>
                <li className="list-group-item">설명 : {token.JsonDescription}</li>
              </ul>
            </div>
          </form>
        );
      })}
    </div>
  );
}

export default MyNFTData;
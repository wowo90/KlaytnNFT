import React, { useState, useEffect } from 'react';
import MainTitle from "../MainTitle";
import kip17Abi from "../../src/kip17Abi";
import Mystyles from "../../styles/mynft.module.css";
import FireBaseInit from '../FireBase/FireBaseInit';

const mynft = ({ caver, newKip17addr }) => {
  const [nftlist, setNftlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //Firebase Database 
  const [Info, setInfos] = useState({
    Contract: '',
    GameItemValue: -1,
    Token: -1
  });


  useEffect(async () => {
    saveMyToken()
  }, []);

  const FireBaseNFTData = (name) => {
    /*
    데이터 저장: set() 메서드에 저장할 데이터를 인자로 전달해 호출
    데이터 삭제: remove() 메서드 호출
    데이터 읽기 & 변경사항 수신: ref에 on() 또는 once() 메서드를 사용하여 이벤트(value)를 관찰
    */
    if(name == '')
      return;
      
    const NFTItem = FireBaseInit.collection("NFT_ITEM");

    NFTItem.doc(name).get().then((doc) => {
      if(doc.exists)
      {
        // document의 데이터를 가져옴
        console.log(doc.data());      
        console.log("파이어베이스 이제 들어옴");

        const findIndex = nftlist.findIndex(element => element.JsonName == name );

        console.log("1. Count : " + nftlist.length  + "  findIndex : " + findIndex + "  Name : " + name);
        nftlist[findIndex].FireBaseDB = true;
        setNftlist(nftlist);
      }
    });

   /*
    const NFTItem = FireBaseInit.ref("/NFT/Item/" + name);
    console.log("파이어베이스 이름 : " + name + "   Item : " + NFTItem);
    if (NFTItem == null) {
      //해당 NFT가 없으면
      setIsFireBase(false);
      return false;
    }
    else {
      NFTItem.once("value", (snapshot) => {
        console.log("파이어베이스 이제 들어옴");
        if (snapshot.exists()) 
        {          
          const state = snapshot.val();
          
          //setInfos(state);
          //console.log("state " + JSON.stringify(state));
          //console.log("Info " + JSON.stringify(Info));
          setIsFireBase(true);
          //어드레스 비교
          return true;
          
        }
        else {
          setIsFireBase(false);
          return false;
        }
      });
    }
    */
  }

  const saveMyToken = async () => {
    const tokenContract = "";
    /*
    if (walletType === "eth") {
      tokenContract = await new web3.eth.Contract(erc721Abi, newErc721addr);
    } else {
      tokenContract = await new caver.klay.Contract(kip17Abi, newKip17addr);
    }
    */
    const account = window.sessionStorage.getItem('ID');

    console.log("NFT : " + newKip17addr);
    console.log("account : " + account);

    tokenContract = await new caver.klay.Contract(kip17Abi, newKip17addr);

    const name = await tokenContract.methods.name().call();
    const symbol = await tokenContract.methods.symbol().call();
    const totalSupply = await tokenContract.methods.totalSupply().call();
    const URL = await tokenContract.tokenURI;

    const Index = 0;
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
      if (String(tokenOwner).toLowerCase() === account) {
        let tokenURI = await tokenContract.methods.tokenURI(tokenId).call();
        Index = tokenId;

        if (tokenURI != '') {
          const MetaDataJson = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
          const GetJson = await fetch(MetaDataJson);

          const jsonFile = await GetJson.json();
          console.log("jsonFile : " + JSON.stringify(jsonFile));

          JsonName = jsonFile.name;

          JsonDescription = jsonFile.description;
          const Image = jsonFile.image;
          JsonURL = Image.replace("ipfs://", "https://ipfs.io/ipfs/");
          console.log("JsonURL : " + JsonURL);
          
          FireBaseDB = false;          

          setNftlist((prevState) => {
            return [...prevState, {Index, name, symbol, tokenId, tokenURI, JsonURL, JsonName, JsonDescription, FireBaseDB }];
          });
          FireBaseNFTData(JsonName.toString());          
        }
        console.log("--- tokenURI : " + tokenURI + "   Count : " + nftlist.length + "   ---");
      }
    }

    setIsLoading(false);
  };

  return (
    <div>
      <MainTitle />
      {nftlist.map((token) => {
        return (
          <form className={Mystyles.todoNFTShowtemplate}>
            <div className="card mb-3">
              <h3 className="card-header">{ token.FireBaseDB ? token.name + " GameNFT" : token.name}</h3>
              <div className="card-body">
                <img
                  src={token.JsonURL}
                  alt={token.id}
                  style={{ width: "100%", height: "80%", objectFit: "cover", borderTopLeftRadius: "inherit", borderTopRightRadius: "inherit", margin: "0.1px" }}
                />
              </div>

              <ul className="list-group list-group-flush">
                <li className="list-group-item">이름 : {token.JsonName} </li>
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

export default mynft;

/*

      {nftlist.map((token) => {
        return (
          <div key={token.tokenId} className={styles.tokenContainer}>
            <img
              src={token.JsonURL}
              alt={token.id}
              style={{ width: "100%", height: "80%", objectFit: "cover", borderTopLeftRadius: "inherit", borderTopRightRadius: "inherit", margin: "0.1px" }}
            />
            <div className={styles.desc}>
              <div className={styles.user}>
                <div className={styles.userText}>
                  <span>{token.name}</span>
                  <div>{token.symbol}</div>
                </div>
              </div>
              <div style={{ marginRight: "20px" }}>
                <p>{token.owner}</p>
              </div>
            </div>
          </div>
        );
      })}
*/
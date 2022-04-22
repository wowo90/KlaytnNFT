/*
import React, { useState, useEffect } from 'react';

const router = useRouter();
const { id } = router.query;

useEffect(async () => {
  const tokenContract = "";
  if (walletType === "eth") {
    tokenContract = await new web3.eth.Contract(erc721Abi, newErc721addr);
  } else {
    tokenContract = await new caver.klay.Contract(kip17Abi, newKip17addr);
  }
  const name = await tokenContract.methods.name().call();
  const symbol = await tokenContract.methods.symbol().call();
  let tokenURI = await tokenContract.methods.tokenURI(id).call();
  setToken({ name, symbol, id, tokenURI });
}, []);

const SendToken = async (tokenId) => {
  const tokenContract = "";
  if (walletType === "eth") {
    tokenContract = await new web3.eth.Contract(erc721Abi, newErc721addr, {
        from: account,
    });
    tokenContract.options.address = newErc721addr;
    tokenContract.methods
      .transferFrom(account, to, token.id)
      .send({
      	from: account,
      })
      .on("receipt", (receipt) => {
      	setTo("");
      	router.push("/");
      });
  } else {
    tokenContract = await new caver.klay.Contract(kip17Abi, newKip17addr, {
        from: account,
    });
    tokenContract.options.address = newKip17addr;
    tokenContract.methods
        .transferFrom(account, to, token.id)
        .send({
          from: account,
          gas: 0xf4240, 
        })
        .on("receipt", (receipt) => {
          setTo("");
          router.push("/");
        });
  }
};
*/

//내 지갑에 있는 NFT를 다른 계정(지갑)으로 전송하는 법
/*
전송할 지갑 주소를 입력 후 전송 버튼을 클릭하면 sendToken 함수가 실행되며 전송이 되는데,
walleyType에 따라 해당 이더리움/클레이튼의 컨트랙트를 불러와 transferFrom 함수로 전송되도록 구현하였다.
*/
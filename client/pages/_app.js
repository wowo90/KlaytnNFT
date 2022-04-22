//import '../styles/globals.css';
import '../styles/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import Caver from "caver-js";

function MyApp({ Component, pageProps }) {
  const [newKip17addr, setNewKip17Addr] = useState("0xDa8472F5AEd5327dbf678385645f3e52f8E8f256");
  const [caver, setCaver] = useState();

  


  useEffect(() => {
    if (typeof klaytn !== "undefined") {
      try {
        const caver = new Caver(klaytn);
        setCaver(caver);
        console.log("new Caver!");
      } catch (err) {
        console.log(err);
      }
    }
  }, []);  

  return <Component 
        caver={caver}
        newKip17addr={newKip17addr}
        />
}

export default MyApp

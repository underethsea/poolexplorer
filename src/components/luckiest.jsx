import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./modal.css";
import Select from "react-select";
import {Link} from "react-router-dom"
import { propTypes } from "react-bootstrap/esm/Image";


function modalText() {
  var randomNumber = Math.floor(Math.random() * textArray.length);
  return textArray[randomNumber];
}

var textArray = [
  "Searching for depositors. Lots AND lots of depositors...",
  "How many depositors can there be?!? Give me a minute, still looking... ",
  "Our servers may be overheating from depositor search... Please hold",
  "Can there really be thousands of depositors?!?!  BRB, double checking...",
  "Wow this many depositors looks nutty.  Still tallying it up...",
];


// function transactionString(transString) {
//     return transString.replace(transString.substring(4,56), "....");
// }
// function addressString(addString) {
//     return addString.substring(0,10);
// }

function Luckiest(props) {
  const [transactions, setTransactions] = useState([]);
  const [popup, setPopup] = useState(Boolean);

  const changeSub = async () => {
     let newLuckies = await fetchLuckies(1)
    
    setTransactions(newLuckies);
  };
  const changeRatio = async () => {
    let newLuckies = await fetchLuckies(0)
   
   setTransactions(newLuckies);
 };

  const fetchLuckies = async (luckies) => {
      let explorer = ""
      if(luckies === 0) {explorer = "https://poolexplorer.xyz/luckiestR"}
      if(luckies === 1) {explorer = "https://poolexplorer.xyz/luckiest"}
    let api = await fetch(explorer);
    let result = await api.json();
    console.log(result);
    return result;
  };


  useEffect(() => {
    setPopup(true);

    const goooo = async () => {
      let holders = await fetchLuckies(1);
      // await getMedian();

      if(props.short){holders = holders.slice(0,5)}
      setTransactions(holders);
      
      setPopup(false);
    };
    goooo();
  }, []);

  return (<div>
     {/* <div className="transactions section"> */}
      <div className="card has-table has-mobile-sort-spaced">
        <header className="card-header card-header-tall-mobile">
          {popup && (
            <div className="modal">
              <div className="modal-content">
                <center>
                  <img src="./images/Pooly.png" className="pooly" alt="pooly" />
                  &nbsp;&nbsp;{modalText()}
                  <div
                    className="loader"
                    style={{ display: "inline-block" }}
                  ></div>
                </center>
              </div>
            </div>
          )}
          <p className="card-header-title">
            LUCKIEST WINNERS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            
            <span className="numb-purp">
              {" "}
              {!popup ? (!props.short &&
                  <span><button className="luckyButton" onClick={changeSub}>win - balance</button>&nbsp;&nbsp;&nbsp;<button className="luckyButton" onClick={changeRatio}>win / balance</button></span>
              ): (
                <div
                  className="smallLoader"
                  style={{ display: "inline-block" }}
                ></div>
              )}
            </span>
            

          </p>
        </header>
        <div className="card-content">
          <div className="table-wrapper has-mobile-cards">
            <table className="is-stripped table is-hoverable">
              <thead>
                <tr>
                  {/* <th>Transaction Hash</th>
                                <th>Time</th> */}
                                
                  <th>Address</th><th>Draw</th>
                  <th>Balance</th>
                  <th>Won</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr>
                    {/* <td></td>  <td></td> */}
                    <td>                      <div className="addressTextShort">
                      {item.n === "1" && (
                              <img
                                src="./images/ethereum.png"
                                className="emoji"
                                alt="Ethereum"
                              />)}{item.n === "3" && (
                               <img
                                src="./images/polygon.png"
                                className="emoji"
                                alt="Polygon" />)}
                              {item.n === "4" && (
                              <img
                                src="./images/avalanche.png"
                                className="emoji"
                                alt="Avalanche"
                              />)}
                                {item.n === "6" && (

                              <img
                                src="./images/optimism.png"
                                className="emoji"
                                alt="Optimism"
                              />    )}&nbsp;&nbsp;
                      

                      <Link to={{pathname:"/poolers", search:"?address=" + item.a }} > 
                        {item.a}
                        {item.a ===
                        "0x8141bcfbcee654c5de17c4e2b2af26b67f9b9056" ? (
                          <img
                            src="./images/pool.png"
                            className="emoji"
                            alt="emoji"
                          ></img>
                        ) : null}
                        
                      </Link>
                      </div>
                      {/* &nbsp;{checkIfYearnOrPod(item.address)} */}
                    </td><td>
                    
                    {item.d}</td>
                    <td>
                      {/* <img
                        src={"./images/" + emoji(item.g) + ".png"}
                        className="emoji"
                        alt="emoji"
                      ></img> */}
                      &nbsp;
                      {item.g.toFixed()}</td>
                      <td>{item.w}
                    </td>
                  </tr>
                ))}
                {props.short > 0 && <tr><td><a href="./luckiest">See more ---&gt;</a></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Luckiest;

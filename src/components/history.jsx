import React, { useState, useEffect } from "react";
import Select from "react-select";
import Modal from "react-modal";

import "./modal.css";

const chains = [1, 137];
// const drawings = 99;

function separator(numb) {
  var str = numb.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}

var textArray = [
  "Searching for prizes. Lots AND lots of prizes...",
  "How many prizes can there be?!? Give me a minute, still looking... ",
  "Our servers may be overheating from prize search... Please hold",
  "Can there really be thousands of prizes per day?!?!  BRB, double checking...",
  "Wow this many prizes looks nutty.  Still tallying it up...",
];

// maintenance mode
// textArray = [ "Pooly is migrating, sorry for the inconvenience, please check back later"]

const explorerURL = "https://poolexplorer.xyz";
function modalText() {
  var randomNumber = Math.floor(Math.random() * textArray.length);
  return textArray[randomNumber];
}

const emoji = (amount) => {
  let emojiIcon = "";
  // let weiAmount = amount / 1000000;
  amount = parseFloat(amount);
  if (amount > 2499) {
    emojiIcon = "whale";
  } else if (amount > 499) {
    emojiIcon = "dolphin";
  } else if (amount > 199) {
    emojiIcon = "octopus";
  } else if (amount > 99) {
    emojiIcon = "lobster";
  } else if (amount > 9) {
    emojiIcon = "fis";
  } else {
    emojiIcon = "fish";
  }

  return emojiIcon;
};

Modal.setAppElement("#root");
function TotalHistory() {
  // const currentTimestamp = parseInt(Date.now() / 1000);
  // const ticketStartTimestamp = 1634184538;
  const [transactions, setTransactions] = useState([]);
  //   const [total, setTotal] = useState([]);
  //   const [depositors, setDepositors] = useState([]);

  const [popup, setPopup] = useState(Boolean);

  const [unique, setUnique] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setPopup(true);

      try {
        let currentDrawFetch = await fetch(explorerURL + "/history");
        let currentDrawResult = await currentDrawFetch.json();
        currentDrawResult.reverse();
        setTransactions(currentDrawResult);

        setPopup(false);
      } catch (e) {
        console.log("fetch error i ", e);
        setUnique("api error");
      }
    };
    load();
  }, []);

  let depositors = transactions.length;
  let totals = 0;
  let balance = 0;
  let twabTotal = 0;
  let winnas = 0;
  let usdctotalcount = 0;
  transactions.forEach((item) => {
    balance = item.p;
    winnas += item.w;
    twabTotal += parseFloat(item.b);
    totals += parseFloat(balance);
    usdctotalcount += parseFloat(item.c);
  });
  let winners = winnas;
  let total = totals;
  let usdctotal = usdctotalcount;
  return (
    <div className="transactions section">
      {/* <button onClick={() => setDraw(58)}>Draw 58</button><button onClick={() => setDraw(59)}>Draw 59</button><button onClick={() => setDraw(60)}>Draw 60</button> */}
      <div className="card has-table has-mobile-sort-spaced">
        <header className="card-header">
          {popup && (
            <div className="modal">
              <div className="modal-content">
                <center>
                  <p>
                    <img src="./images/Pooly.png" className="pooly" />
                    &nbsp;&nbsp;{modalText()}
                    <div
                      class="loader"
                      style={{ display: "inline-block" }}
                    ></div>
                  </p>
                </center>
              </div>
            </div>
          )}
          <p className="card-header-title">
            {/* DRAW #&nbsp;
            <Select options={options} onChange={onChange} value={draw} />
            &nbsp; &nbsp; &nbsp;
            <span className="numb-purp"> {separator(unique)}</span>{" "} */}
            &nbsp;
            {/* <span className="numb-purp"> {separator(depositors)}</span> PRIZES */}
            <span className="hidden-mobile">
              <img src="./images/poolor.png" className="token" />
              <span className="numb-purp">{separator(winners)}</span> TOTAL
              WINS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src="./images/prize.png" className="token" />
              <span className="numb-purp">{separator(total)}</span> TOTAL PRIZES
              WON&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <img src="./images/usdc.png" className="token" />
            <span className="numb-purp">{separator(usdctotal)}</span> TOTAL USDC
          </p>
        </header>
        <div className="card-content">
          <div className="table-wrapper has-mobile-cards">
            <table className="is-stripped table is-hoverable">
              <thead>
                <tr>
                  {/* <th>Transaction Hash</th>
                                <th>Time</th> */}
                  <th>Draw</th>
                  <th className="hidden-mobile">Winning Poolers</th>
                  <th>
                    Prizes <span className="hidden-mobile">Claimable</span>
                  </th>

                  <th style={{ textAlign: "right" }}>
                    USDC <span className="hidden-mobile">Claimable</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr>
                    {/* <td></td>  <td></td> */}
                    <td>
                      {" "}
                      {/* <div className="addressText"> */}
                      {/* {item.n === "1" && ( */}
                      <span>
                        <div
                          className="inlineDiv"
                          //   onClick={() => {
                          //     openModal(item.a, item.n);
                          //   }}
                        >
                          {/* <img
                                src="./images/ethereum.png"
                                className="emoji"
                                alt="Ethereum"
                              /> */}
                          &nbsp;&nbsp;
                          {item.i}
                        </div>
                      </span>
                      {/* </div> */}
                    </td>

                    <td>{item.w}</td>
                    <td className="hidden-mobile">{item.p}</td>
                    <td style={{ textAlign: "right" }}>
                      <div title={"Dropped:" + item.d}>
                        {separator(item.c)}
                        <img src="./images/usdc.png" className="emoji" />
                        <span className="hidden-mobile">&nbsp;&nbsp; </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TotalHistory;

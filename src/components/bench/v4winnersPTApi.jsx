import React, { useState, useEffect } from "react";
import Select from "react-select";

import "./../modal.css";

// import { TimeConvert } from './timeConvert.js'
const chains = [1, 137];
function separator(numb) {
  var str = numb.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}

function amount(weiAmount) {
  weiAmount = parseFloat(weiAmount);
  weiAmount = weiAmount / 1000000;
  return weiAmount.toFixed(0);
}

var textArray = [
  "Searching for prizes. Lots AND lots of prizes...",
  "How many prizes can there be?!? Give me a minute, still looking... ",
  "Our servers may be overheating from prize search... Please hold",
  "Can there really be thousands of prizes per day?!?!  BRB, double checking...",
  "Wow this many prizes looks nutty.  Still tallying it up...",
];

function modalText() {
  var randomNumber = Math.floor(Math.random() * textArray.length);
  return textArray[randomNumber];
}

function countUnique(input) {
  var arr = input,
    obj = {};
  console.log(arr, "dsfsfsf");
  for (var i = 0; i < arr.length; i++) {
    if (!obj[arr[i].address]) {
      obj[arr[i].address] = 1;
    } else if (obj[arr[i].address]) {
      obj[arr[i].address] += 1;
    }
  }
  return obj;
}

const emoji = (amount) => {
  let emojiIcon = "";
  let weiAmount = amount / 1000000;
  amount = parseFloat(weiAmount);
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

const drawings = 66;

let options = [];
for (let i = 0; i <= drawings; i++) {
  options.push({ label: i, value: i });
}
options.reverse();

function UsdcWinners() {
  const [transactions, setTransactions] = useState([]);
  //   const [total, setTotal] = useState([]);
  //   const [depositors, setDepositors] = useState([]);

  const [popup, setPopup] = useState(Boolean);
  const onChange = (selectedOption) => {
    setDraw(selectedOption);
    console.log(`Option selected:`, selectedOption);
  };
  const startDraw = { label: drawings, value: drawings };
  const [draw, setDraw] = useState(startDraw);
  const [unique, setUnique] = useState([]);

  useEffect(() => {
    console.log("useE");
    const goooo = async () => {
      setPopup(true);
      console.log(draw);
      // let [polyApi,apiMainnet] = Promise.all(x)
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      // "/api/prizes/137/0x8141bcfbcee654c5de17c4e2b2af26b67f9b9056/draw/"
      //https://thingproxy.freeboard.io/fetch/https://api.pooltogether.com
      let polyApi =
        "/api/prizes/137/0x8141bcfbcee654c5de17c4e2b2af26b67f9b9056/draw/" +
        draw.value +
        "/prizes.json";
      let mainApi =
        "/api/prizes/1/0xb9a179dca5a7bf5f8b9e088437b3a85ebb495efe/draw/" +
        draw.value +
        "/prizes.json";
      console.log(polyApi);

      let [api, apiMainnet] = await Promise.all([
        fetch(polyApi, headers),
        fetch(mainApi, headers),
      ]);

      console.log(api);
      //   api = await api.json();
      let [apiPolyJson, apiMainJson] = await Promise.all([
        api.json(),
        apiMainnet.json(),
      ]);
      apiPolyJson.forEach((v) => {
        v.chain = "137";
      });
      //   let apiMain = await apiMainnet.json();

      apiMainJson.forEach((v) => {
        v.chain = "1";
      });
      let events = apiPolyJson.concat(apiMainJson);

      events.sort(function (a, b) {
        return a.amount - b.amount;
      });
      events.reverse();

      let sortUnique = countUnique(events);
      console.log(sortUnique);

      console.log(Object.keys(sortUnique).length);
      setUnique(Object.keys(sortUnique).length);
      events = events.slice(0,1000)
      setTransactions(events);
      setPopup(false);
    };
    goooo();
  }, [draw]);
  let depositors = transactions.length;
  let totals = 0;
  let balance = 0;
  transactions.forEach((item) => {
    balance = parseFloat(amount(item.amount));
    totals += balance;
  });
  let total = totals;
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
            DRAW #&nbsp;
            <Select options={options} onChange={onChange} value={draw} />
            &nbsp; &nbsp; &nbsp;
            <span className="numb-purp"> {separator(unique)}</span>{" "}
            WINNERS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="numb-purp"> {separator(depositors)}</span> PRIZES
            <img src="./images/usdc.png" className="token" />
            <span className="numb-purp">{separator(total)}</span> TOTAL
            {/* {popup && (<div>popup</div>)} */}
            {/* <img src='./images/usdc.png' className='token'/>
                <span className="numb-purp">{separator(average.toFixed(0))}</span>
                &nbsp;AVG 
                <img src='./images/usdc.png' className='token'/>
                <span className="numb-purp">{separator(median)}</span>
                &nbsp;MEDIAN */}
          </p>
        </header>
        <div className="card-content">
          <div className="table-wrapper has-mobile-cards">
            <table className="is-stripped table is-hoverable">
              <thead>
                <tr>
                  {/* <th>Transaction Hash</th>
                                <th>Time</th> */}
                  <th>Address</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr>
                    {/* <td></td>  <td></td> */}
                    <td>                         <div className="addressText">

                      {item.chain === "1" ? (
                        <span>
                          <img
                            src="./images/ethereum.png"
                            className="emoji"
                            alt="Ethereum"
                          />{" "}
                          &nbsp;&nbsp;
                          <a
                            href={
                              "https://etherscan.io/address/" + item.address
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.address}
                          </a>
                          
                        </span>
                      ) : (
                        <span>
                          <img
                            src="./images/polygon.png"
                            className="emoji"
                            alt="Polygon"
                          />
                          &nbsp;&nbsp;
                          <a
                            href={
                              "https://polygonscan.com/address/" + item.address
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.address}
                          </a>
                        </span>
                      )}
                    </div>
                    </td>
                    <td>
                      <img
                        src={"./images/" + emoji(item.amount) + ".png"}
                        className="emoji"
                        alt="emoji"
                      ></img>
                      &nbsp;
                      {separator(amount(item.amount))}
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
export default UsdcWinners;
import React, { useState, useEffect } from "react";
// import axios from 'axios'
import { ethers } from "ethers";
// import { TimeConvert } from './timeConvert.js'

function separator(numb) {
  var str = numb.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}

function amount(weiAmount) {
  weiAmount = ethers.utils.formatUnits(weiAmount, 6);
  return Number.parseFloat(weiAmount).toFixed(0);
}

const emoji = (amount) => {
  let emojiIcon = "";
  let weiAmount = ethers.utils.formatUnits(amount, 6);
  amount = parseFloat(weiAmount);
  //         console.log("amount ",amount)
  if (amount > 50000) {
    emojiIcon = "whale";
  } else if (amount > 20000) {
    emojiIcon = "dolphin";
  } else if (amount > 10000) {
    emojiIcon = "octopus";
  } else if (amount > 5000) {
    emojiIcon = "fish";
  } else if (amount > 1000) {
    emojiIcon = "lobster";
  } else if (amount > 500) {
    emojiIcon = "fis";
  } else if (amount > 100) {
    emojiIcon = "shrimp";
  } else {
    emojiIcon = "shell";
  }

  return emojiIcon;
};

function UsdcHoldersV4Avax() {
  const [transactions, setTransactions] = useState([]);
  const [median, setMedian] = useState([]);

  useEffect(() => {
    let covalentUrl =
      "https://api.covalenthq.com/v1/43114/tokens/0xb27f379c050f6ed0973a01667458af6ecebc1d90/token_holders/?quote-currency=USD&format=JSON&block-height=latest&page-size=5000&key=ckey_d8ea1001bff74ecb8cc3afd51ec";

    fetch(covalentUrl)
      .then((api) => api.json())
      .then((result) => {
        console.log(result);

        let events = result.data.items;

        events.sort(function (a, b) {
          return a.balance - b.balance;
        });
        events.reverse();

        // shit median code
        // let length = events.length - 1
        // length = length / 2
        // length = parseInt(length)
        let medianTemp = events[parseInt(events.length / 2 - 1)].balance;
        medianTemp = parseInt(medianTemp / 1000000);

        setMedian(medianTemp);

        setTransactions(events);
      });
  }, []);
  let depositors = transactions.length - 1;
  // minus the prize tickets

  let total = 0;
  let balance = 0;
  transactions.forEach((item) => {
    if (item.address !== "0x83332f908f403ce795d90f677ce3f382fe73f3d1") {
      balance = parseFloat(amount(item.balance));
      total = total + balance;
    }
  });

  let average = total / depositors;

  return (
    <div className="transactions section">
      <div className="card has-table has-mobile-sort-spaced">
        <header className="card-header">
          <p className="card-header-title">
            AVALANCHE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="numb-purp"> {separator(depositors)}</span> PLAYERS
            <img src="./images/usdc.png" className="token" alt="usdc" />
            <span className="numb-purp">{separator(total)}</span> TOTAL
            <img src="./images/usdc.png" className="token" alt="usdc" />
            <span className="numb-purp">{separator(average.toFixed(0))}</span>
            &nbsp;AVG
            <img src="./images/usdc.png" className="token" alt="usdc" />
            <span className="numb-purp">{separator(median)}</span>
            &nbsp;MEDIAN
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
                  <tr key={item.id}>
                    {/* <td></td>  <td></td> */}
                    <td><div className="addressText">
                      <a
                        href={"https://snowtrace.io/address/" + item.address}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.address} 
                        
                      </a>
                      &nbsp;&nbsp;
                      {item.address ===
                        "0x83332f908f403ce795d90f677ce3f382fe73f3d1" ? (
                          <img
                            src="./images/pool.png"
                            className="emoji"
                            alt="emoji"
                          ></img>
                        ) : null}
                      {/* &nbsp;{checkIfYearnOrPod(item.address)} */}
                      </div>
                    </td>
                    <td>
                      <img
                        src={"./images/" + emoji(item.balance) + ".png"}
                        className="emoji"
                        alt="emoji"
                      ></img>
                      &nbsp;
                      {separator(amount(item.balance))}
                     
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
export default UsdcHoldersV4Avax;

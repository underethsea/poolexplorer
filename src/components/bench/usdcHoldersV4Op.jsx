import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

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

function UsdcHoldersV4Op() {
  const [transactions, setTransactions] = useState([]);
  const [median, setMedian] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.covalenthq.com/v1/10/tokens/0x62BB4fc73094c83B5e952C2180B23fA7054954c4/token_holders/?page-size=5000&key=" + process.env.REACT_APP_COVALENT_KEY
    )
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
        medianTemp = medianTemp / 1000000;
        setMedian(medianTemp);
        setTransactions(events);
      });
  }, []);
  let depositors = transactions.length - 1;

  let total = 0;
  let balance = 0;
  transactions.forEach((item) => {
    if (item.address !== "0x722e9bfc008358ac2d445a8d892cf7b62b550f3f") {
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
            OPTIMISM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                    <td>
                      <a
                        href={"https://optimistic.etherscan.io/address/" + item.address}
                        target="_blank"
                        rel="noopener noreferrer"
                      ><div className="addressText">
                          {item.address}&nbsp;&nbsp;
                          {item.address ===
                            "0x722e9bfc008358ac2d445a8d892cf7b62b550f3f" ? (
                            <img
                              src="./images/pool.png"
                              className="emoji"
                              alt="emoji"
                            ></img>
                          ) : null}
                        </div>
                      </a>
                      {/* &nbsp;{checkIfYearnOrPod(item.address)} */}
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
export default UsdcHoldersV4Op;

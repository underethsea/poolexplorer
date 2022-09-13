import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./../modal.css";
import Select from "react-select";

const pageDivider = 250;

function separator(numb) {
  let number = parseFloat(numb);
  var str = number.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}

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

// function transactionString(transString) {
//     return transString.replace(transString.substring(4,56), "....");
// }
// function addressString(addString) {
//     return addString.substring(0,10);
// }

function UsdcHoldersV4Poly() {
  const [transactions, setTransactions] = useState([]);
  const [median, setMedian] = useState([]);

  const [popup, setPopup] = useState(Boolean);
  const [depositors, setDepositors] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [currentPage, setCurrentPage] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [options, setOptions] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);
  const [chain,setChain] = useState([])
  const [optionsNetwork,setOptionsNetwork] = useState(0)
  const [currentNetwork,setCurrentNetwork] = useState([{label:'Polygon',value:137}])

  const onChange = (selectedOption) => {
    setCurrentPage(selectedOption);
    let fullList = allTransactions;
    let page = parseInt(selectedOption.value);
    let startArrayIndex = 0;
    if (page !== 1) {
      startArrayIndex = (page - 1) * pageDivider - 1;
    }
    let newList = fullList.slice(
      startArrayIndex,
      startArrayIndex + pageDivider
    );
    setTransactions(newList);
    console.log(`Option selected:`, selectedOption);
  };
  const onChangeNetwork = async (selectedNetwork ) => {
    setCurrentNetwork(selectedNetwork)
   if(selectedNetwork.label === "Optimism") {setChain(selectedNetwork)}
   if(selectedNetwork.label === "Ethereum") {setChain(selectedNetwork)}

   if(selectedNetwork.label === "Polygon") {setChain(selectedNetwork)}
   if(selectedNetwork.label === "Avalanche") {setChain(selectedNetwork)}

  };


  const fetchHolders = async () => {
    console.log(chain)
    let ticket = ""
    let chainToFetch = 137
    if(chain.value === 137) {chainToFetch = chain.value;ticket = "0x6a304dfdb9f808741244b6bfee65ca7b3b3a6076"}
    else if(chain.value === 10) {chainToFetch = chain.value;ticket = "0x62BB4fc73094c83B5e952C2180B23fA7054954c4"}
    else if(chain.value === 1) {chainToFetch = chain.value;ticket = "0xdd4d117723c257cee402285d3acf218e9a8236e1"}
    else if(chain.value === 43114) {chainToFetch = chain.value;ticket = "0xb27f379c050f6ed0973a01667458af6ecebc1d90"}
    else {ticket = "0x6a304dfdb9f808741244b6bfee65ca7b3b3a6076"}


    let api = await fetch(
      "https://api.covalenthq.com/v1/" + chainToFetch + "/tokens/" + ticket + "/token_holders/?page-size=15000&key=" + process.env.REACT_APP_COVALENT_KEY
    );

    console.log(api)
    let result = await api.json();

    console.log(result);

    let events = result.data.items;
    setAllTransactions(events);


    let trans = await events.sort(function (a, b) {
      return a.balance - b.balance;
    });
    trans.reverse();

    console.log(trans);
    let pages = parseInt(trans.length / pageDivider) + 1;
    let pagesArray = [];
    for (let i = 1; i <= pages; i++) {
      pagesArray.push({ label: i, value: i });
    }
    setOptions(pagesArray);
    setOptionsNetwork([{label: 'Optimism', value: 10},{label: 'Ethereum', value: 1},{label: 'Polygon', value: 137},{label: 'Avalanche',value: '43114'}])

    return trans;
  };

  const getMedian = async (data) => {
    let medianTemp = data[parseInt(data.length / 2 - 1)].balance;
    medianTemp = parseInt(medianTemp / 1000000);
    return medianTemp;
  };

  const totalBalances = async (data) => {
    let balance = 0;
    let totals = 0;
    // console.log("whats here", data);
    data.forEach((item) => {
      if (item.address !== "0x8141bcfbcee654c5de17c4e2b2af26b67f9b9056") {
        balance = parseFloat(amount(item.balance));
        totals = totals + balance;
      }
    });
    // console.log("totals",totals)
    return totals;
  };

  // const getTotals = async () => {
  //   let totals = await transactionsTotal();
  //   console.log(totals, "totals");
  //   console.log(depositors, "depositors");
  //   setTotal(totals);
  //   console.log(total, "total");
  //   let averages = total / depositors;
  //   setAverage(averages);
  // };
  const getDepositors = async (holders) => {
    let depositorsCount = holders.length - 1;
    // console.log(depositorsCount, "depositors count");
    return depositorsCount;
  };
  useEffect(() => {
   fetchHolders();
  }, [chain]);
  useEffect(() => {
    setPopup(true);
    setCurrentPage({ label: 1, value: 1 });

    // setChain(137)
    const goooo = async () => {

      let holders = await fetchHolders(chain);
      // await getMedian();
      let totalDeposited = await getDepositors(holders);
      let totalBalance = await totalBalances(holders);
      let medianDeposit = await getMedian(holders);
      //   console.log(totalBalance, "totalBalance");
      // console.log(depositors, "depositors");
      // console.log(total, "total");
      let averageBalance = totalBalance / totalDeposited;
      setAverage(averageBalance);
      setMedian(medianDeposit);
      setDepositors(totalDeposited);
      // holders.reverse();

      setAllTransactions(holders);
      let display = holders.slice(0, pageDivider);
      // holders.reverse();
      console.log(display);

      setTransactions(display);
      setTotal(totalBalance);
      // minus the prize tickets
      setPopup(false);
    };
    goooo();
  }, [chain]);

  return (
    <div className="transactions section">
      <div className="card has-table has-mobile-sort-spaced">
        <header className="card-header">
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
            
            <Select options={optionsNetwork} onChange={onChangeNetwork} value={currentNetwork} />
            <span className="numb-purp">
              {" "}
              {!popup ? (
                separator(depositors)
              ) : (
                <div
                  className="smallLoader"
                  style={{ display: "inline-block" }}
                ></div>
              )}
            </span>{" "}
            PLAYERS {!popup ? <div>
            <div className="topData">
              <span className="numb-purp">
                
                  <div className="topData">
                    <img src="./images/usdc.png" className="token" alt="usdc" />{" "}
                    {separator(total)}{" "}
                  </div>
                
              </span>
              TOTAL
            </div>
            <div className="topData">
              <span className="numb-purp">
               
                  <div className="topData">
                    <img src="./images/usdc.png" className="token" alt="usdc" />{" "}
                    {separator(parseFloat(average).toFixed(0))}
                  </div>
              </span>
              &nbsp;AVG
            </div>
            &nbsp;&nbsp;
            <div className="topData">
              <span className="numb-purp">
                
                  <div className="topData">
                    <img src="./images/usdc.png" className="token" alt="usdc" />{" "}
                    {separator(median)}
                  </div>
              </span>
              &nbsp;MEDIAN{" "}
            </div>{" "}</div>: ""
            }
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PAGE&nbsp;{" "}
            <Select options={options} onChange={onChange} value={currentPage} />
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
                        href={"https://polygonscan.com/address/" + item.address}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="addressText">{item.address}
                        {item.address ===
                        "0x8141bcfbcee654c5de17c4e2b2af26b67f9b9056" ? (
                          <img
                            src="./images/pool.png"
                            className="emoji"
                            alt="emoji"
                          ></img>
                        ) : null}
                        </div>
                      </a>
                      &nbsp;&nbsp;
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
export default UsdcHoldersV4Poly;

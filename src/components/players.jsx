import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./modal.css";
import Select from "react-select";
import {Link } from "react-router-dom"

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



function Players() {
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
    const [chain, setChain] = useState([])
    const [optionsNetwork, setOptionsNetwork] = useState(0)
    const [currentNetwork, setCurrentNetwork] = useState([{ label: 'Polygon', value: 137 }])

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
    const onChangeNetwork = async (selectedNetwork) => {
        setCurrentNetwork(selectedNetwork)
        setChain(selectedNetwork)
    };

    // const blockExplorer = () => {
    //     if(!chain.value) {return "https://polygonscan.com/address/"}
    //     if(chain.value == 1) {return "https://etherscan.io/address/"}
    //     if(chain.value == 10) {return "https://optimistic.etherscan.io/address/"}
    //     if(chain.value == 43114) {return "https://snowtrace.io/address/"}
    //     return "https://polygonscan.com/address/"
    // }
    const fetchHolders = async () => {
        let ticket = ""
        if (chain.value === 137) { ticket = "0x6a304dfdb9f808741244b6bfee65ca7b3b3a6076" }
        else if (chain.value === 10) {ticket = "0x62BB4fc73094c83B5e952C2180B23fA7054954c4" }
        else if (chain.value === 1) {ticket = "0xdd4d117723c257cee402285d3acf218e9a8236e1" }
        else if (chain.value === 43114) {ticket = "0xb27f379c050f6ed0973a01667458af6ecebc1d90" }
        else { ticket = "0x6a304dfdb9f808741244b6bfee65ca7b3b3a6076" }
        let chainNow = 137
        if(chain.value) {chainNow = chain.value}
        // let apiUrl = "https://api.covalenthq.com/v1/" + chainNow + "/tokens/" + ticket + "/token_holders/?page-size=15000&key=" + process.env.REACT_APP_COVALENT_KEY
        let apiUrl = "https://poolexplorer.xyz/players" +chainNow
        let api = await fetch(apiUrl);

        let result = await api.json();

        let events = result.data.items;
        setAllTransactions(events);

        let trans = await events.sort(function (a, b) {
            return a.balance - b.balance;
        });
        trans.reverse();

        let pages = parseInt(trans.length / pageDivider) + 1;
        let pagesArray = [];
        for (let i = 1; i <= pages; i++) {
            pagesArray.push({ label: i, value: i });
        }
        setOptions(pagesArray);
        setOptionsNetwork([{ label: 'Optimism', value: 10 },
        { label: 'Ethereum', value: 1 },
        { label: 'Polygon', value: 137 },
        { label: 'Avalanche', value: 43114 }])

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

            setAllTransactions(holders);
            let display = holders.slice(0, pageDivider);

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
                        <span className="numb-purp mobile-hidden">
                            {" "}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {!popup ? (
                                separator(depositors)
                            ) : (
                                <div
                                    className="smallLoader"
                                    style={{ display: "inline-block" }}
                                ></div>
                            )}
                        </span>{" "}<span className="hidden-mobile twenty-two">
                        PLAYERS </span>{!popup ? <div className="hidden-mobile twenty-two">
                            <div className="topData">
                                <span className="numb-purp">

                                    <div className="topData hidden-mobile twenty-two">
                                        <img src="./images/usdc.png" className="token" alt="usdc" />{" "}
                                        {separator(total)}{" "}
                                    </div>

                                </span>
                                TOTAL
                            </div>
                            <div className="topData twenty-two">
                                <span className="numb-purp">

                                    <div className="topData twenty-two">
                                        <img src="./images/usdc.png" className="token" alt="usdc" />{" "}
                                        {separator(parseFloat(average).toFixed(0))}
                                    </div>
                                </span>
                                &nbsp;AVERAGE
                            </div>
                            &nbsp;&nbsp;
                            {/* <div className="topData"> */}
                                {/* <span className="numb-purp"> */}

                                    {/* <div className="topData">
                                        <img src="./images/usdc.png" className="token" alt="usdc" />{" "}
                                        {separator(median)}
                                    </div>
                                </span>
                                &nbsp;MED{" "}
                            </div> */}
                            
                            {" "}</div> : ""
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
                                    <th style={{ textAlign: "right" }}>Amount &nbsp;&nbsp;&nbsp;&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((item) => (
                                    <tr key={item.id}>
                                        {/* <td></td>  <td></td> */}
                                       <td> <Link to={{pathname:"/poolers", 
                    search:"?address=" + item.address }} > 
                                            
                                                <div className="addressText addressTextOldPhones">{item.address}
                                                    {item.address ===
                                                        "0x8141bcfbcee654c5de17c4e2b2af26b67f9b9056" || item.address ===
                                                        "0x42cd8312d2bce04277dd5161832460e95b24262e"  || item.address ===
                                                        "0xb9a179DcA5a7bf5f8B9E088437B3A85ebB495eFe" ||  item.address ===
                                                        "0x83332f908f403ce795d90f677ce3f382fe73f3d1" ||   item.address ===
                                                        "0x722e9BFC008358aC2d445a8d892cF7b62B550F3F"  ? (
                                                        <img
                                                            src="./images/pool.png"
                                                            className="emoji"
                                                            alt="emoji"
                                                        ></img>
                                                    ) : null}
                                                </div>
                                            </Link>
                                            &nbsp;&nbsp;
                                            {/* &nbsp;{checkIfYearnOrPod(item.address)} */}
                                        </td>
                                        <td  style={{ textAlign: "right" }}>
                                            
                                            
                                            {separator(amount(item.balance))} <img
                                                src={"./images/" + emoji(item.balance) + ".png"}
                                                className="emoji"
                                                alt="emoji"
                                            ></img>&nbsp;&nbsp;&nbsp;&nbsp;
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
export default Players;

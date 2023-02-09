import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./modal.css";
import Select from "react-select";
import { Link } from "react-router-dom"
import ReactSlider from "react-slider";


function separator(numb) {
  var str = numb.toString().split(".");
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


// function transactionString(transString) {
//     return transString.replace(transString.substring(4,56), "....");
// }
// function addressString(addString) {
//     return addString.substring(0,10);
// }

function Savers() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [popup, setPopup] = useState(Boolean);
    const [currentValue, setCurrentValue] = useState(5000000);
    const [chainFilter, setChainFilter] = useState({ ethereum: true, optimism: true, polygon: true, avalanche: true })
    const [ethereum, setEthereum] = useState(true)
    const [polygon, setPolygon] = useState(true)
    const [optimism, setOptimism] = useState(true)
    const [avalanche, setAvalanche] = useState(true)


    const fetchSavers = async () => {
        let explorer = ""
        
        let api = await fetch("https://poolexplorer.xyz/savers")
        let result = await api.json();
        console.log(result);
        return result;
    };

    const flipChain = async (chain) => {
        let chainStatus = chainFilter
        //toggle chain on or off
        chainStatus[chain] = !chainStatus[chain]
        setChainFilter(chainStatus)
        // take all data and remove networks that are toggled off
        let currentData = transactions
        console.log(chainStatus)
        for (const property in chainStatus) {
            if (!chainStatus[property]) {
                currentData = currentData.filter((object) => { return object.network !== property })
            }
        }
            let filteredData = currentData.filter(obj => {
        return parseInt(obj.average_balance_in_streak) <= parseInt(currentValue);
    });
    setFilteredTransactions(filteredData.slice(0, 100))

}


const filterByThreshold = (threshold) => {
    // take chain toggled data and filter by average balance threshold
    let currentData = transactions
    for (const property in chainFilter) {
        if (!chainFilter[property]) {
            currentData = currentData.filter((object) => { return object.network !== property })
        }
    }
    let filteredData = currentData.filter(obj => {
        return parseInt(obj.average_balance_in_streak) <= parseInt(threshold);
    });
    // limit list to 100
    setFilteredTransactions(filteredData.slice(0, 100))
}

useEffect(() => {
    setPopup(true);

    const goooo = async () => {
        let holders = await fetchSavers();
        // await getMedian();
        setTransactions(holders);
        setFilteredTransactions(holders.slice(0, 100))

        setPopup(false);
    };
    goooo();
}, []);

return (
    <div className="transactions section">
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
                    POOLERS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <span className="numb-purp">
                        {" "}
                        {!popup ? (<div>
                            {/* <span> */}
                            {/* <button className="luckyButton" onClick={change100}>500+</button>&nbsp;&nbsp;&nbsp;
                  <button className="luckyButton" onClick={change500}>500+</button></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                            <span>
                                <span className="chain-toggles">

                                    <img
                                        src="./images/ethereum.png"
                                        className="emoji chain-select "
                                        className={`emoji chain-select ${!ethereum && "dim-icon"}`}
                                        alt="Ethereum"
                                        onClick={() => { setEthereum(!ethereum); flipChain("ethereum") }}
                                    />&nbsp;&nbsp;

                                    <img
                                        src="./images/polygon.png"
                                        className={`emoji chain-select ${!polygon && "dim-icon"}`}
                                        alt="Polygon"
                                        onClick={() => { setPolygon(!polygon); flipChain("polygon") }}
                                    />&nbsp;&nbsp;

                                    <img
                                        src="./images/avalanche.png"
                                        className={`emoji chain-select ${!avalanche && "dim-icon"}`}
                                        alt="Avalanche"
                                        onClick={() => { setAvalanche(!avalanche); flipChain("avalanche") }}

                                    />&nbsp;&nbsp;

                                    <img
                                        src="./images/optimism.png"
                                        className={`emoji chain-select ${!optimism && "dim-icon"}`}
                                        alt="Optimism"
                                        onClick={() => { setOptimism(!optimism); flipChain("optimism") }}

                                    />  </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <ReactSlider
                                    className="customSlider slider-div"
                                    trackClassName="customSlider-track"
                                    thumbClassName="customSlider-thumb"
                                    min={500}
                                    max={50000}
                                    step={500}
                                    defaultValue={50000}
                                    onChange={(value => { setCurrentValue(value); })}
                                    onAfterChange={(value) => { setCurrentValue(value); filterByThreshold(value); console.log(value) }}
                                /> &nbsp;&nbsp;{currentValue === 5000000 ? "Balance" : <span>&lt;&nbsp;{currentValue}</span>}

                            </span></div>
                        ) : (
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
                                <th>Score</th>
                                <th>Address</th>
                                <th>Streak</th>
                                <th>Avg Bal</th>
                                <th>Recent Bal</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? filteredTransactions.map((item) => (
                                <tr>
                                    {/* <td></td>  <td></td> */}
                                    <td>

                                        {item.score}</td><td>                      <div className="addressTextShort">
                                            {item.network === "ethereum" && (
                                                <img
                                                    src="./images/ethereum.png"
                                                    className="emoji"
                                                    alt="Ethereum"
                                                />)}{item.network === "polygon" && (
                                                    <img
                                                        src="./images/polygon.png"
                                                        className="emoji"
                                                        alt="Polygon" />)}
                                            {item.network === "avalanche" && (
                                                <img
                                                    src="./images/avalanche.png"
                                                    className="emoji"
                                                    alt="Avalanche"
                                                />)}
                                            {item.network === "optimism" && (

                                                <img
                                                    src="./images/optimism.png"
                                                    className="emoji"
                                                    alt="Optimism"
                                                />)}&nbsp;&nbsp;


                                            <Link to={{ pathname: "/poolers", search: "?address=" + "0x" + Buffer.from(item.address).toString('hex') }} >
                                                {/* {item.address.data.toString("hex")} */}
                                                {"0x" + Buffer.from(item.address).toString('hex')}
                                                {item.address.toString("hex") ===
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
                                    </td>
                                    <td style={{ textAlign: "right" }}>{item.draws_streak}</td>
                                    <td style={{ textAlign: "right" }}>
                                        {/* <img
                        src={"./images/" + emoji(item.g) + ".png"}
                        className="emoji"
                        alt="emoji"
                      ></img> */}
                                        &nbsp;
                                        {separator(parseInt(item.average_balance_in_streak))}&nbsp;</td>
                                    <td style={{ textAlign: "right" }}>{separator(parseInt(item.average_balance_last_draw))}&nbsp;
                                    </td> 
                                </tr>
                            )): !popup && <span><br></br><center>Toggle chains or increase threshold to find results</center></span>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);
}
export default Savers;

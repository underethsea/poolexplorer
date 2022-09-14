import React, { useState, useEffect } from "react";
import Select from "react-select";
import Modal from "react-modal";
// import { TvlActive } from "./tvlActive.jsx"
// import { Tvl } from "./tvl.jsx"
import { Generator } from "./generator.jsx"

import "./modal.css";

const chains = [1, 137];
// const drawings = 99;

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
    "Searching the prize machine..",
    "The protocol is hard at work, and will get us the data shortly",
    "This thing be making prize monies",
];

// maintenance mode
// textArray = [ "Pooly is migrating, sorry for the inconvenience, please check back later"]


const explorerURL = "https://poolexplorer.xyz"
function modalText() {
    var randomNumber = Math.floor(Math.random() * textArray.length);
    return textArray[randomNumber];
}


// const token-icon = (amount) => {
//     let token-iconIcon = "";
//     // let weiAmount = amount / 1000000;
//     amount = parseFloat(amount);
//     if (amount > 2499) {
//         token-iconIcon = "whale";
//     } else if (amount > 499) {
//         token-iconIcon = "dolphin";
//     } else if (amount > 199) {
//         token-iconIcon = "octopus";
//     } else if (amount > 99) {
//         token-iconIcon = "lobster";
//     } else if (amount > 9) {
//         token-iconIcon = "fis";
//     } else {
//         token-iconIcon = "fish";
//     }

//     return token-iconIcon;
// };


Modal.setAppElement("#root");
function Protocol() {

    const [popup, setPopup] = useState(Boolean);
    const [prizeGen, setPrizeGen] = useState({});
    const [tvlActive, setTvlActive] = useState({});

    const [unique, setUnique] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        const load = async () => {
            setPopup(true);

            try {
                // let tvlActive = await TvlActive()
                // let tvl = await Tvl()
                let generator = await Generator()
                setPrizeGen(generator)
                // setTvlActive(tvlActive)
                // console.log(tvl)
                // console.log(tvlActive)

                setPopup(false);
            } catch (e) {
                console.log("fetch error i ", e);
                setUnique("api error");
            }
        }
        load()
    }, [])

    return (<div>
        {popup &&
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
        }
        {prizeGen.TOTALTVL > 0 && <div className="protocol"><br></br>
            <table className="protocol"><thead>
                <tr><td colSpan={2} style={{ textAlign: "center", backgroundColor: "#e2d5fa" }}>
                    <span className="table-header">Total Value Pooled</span>
                </td>
                </tr>
            </thead>
                <tbody>
                    <tr><td><span className="table-text">
                        <img src="./images/optimism.png" className="icon child child1" alt="Optimism" />&nbsp;
                        Optimism</span></td><td style={{ textAlign: "right" }}><span className="table-text"> {separator(prizeGen.OPTIMISM.tvl.toFixed(0))}</span> <img src='./images/usdcToken.svg' className='token-icon' /></td></tr>

                    <tr><td><span className="table-text">
                        <img src="./images/polygontoken.png" className="icon child child1" alt="Polygon" />&nbsp;
                        Polygon</span></td><td style={{ textAlign: "right" }}><span className="table-text">
                            {separator(prizeGen.POLYGON.tvl.toFixed(0))}</span> <img src='./images/usdcToken.svg' className='token-icon' /></td></tr>
                    <tr><td><span className="table-text"><img src="./images/ethtoken.png" className="icon child child1" alt="Ethereum" />&nbsp;
                        Ethereum </span></td><td style={{ textAlign: "right" }}><span className="table-text">{separator(prizeGen.ETHEREUM.tvl.toFixed(0))}</span> <img src='./images/usdcToken.svg' className='token-icon' /></td></tr>
                    <tr><td><span className="table-text"><img src="./images/avalanche.png" className="icon child child1" alt="Avalanche" />&nbsp;
                        Avalanche </span></td><td style={{ textAlign: "right" }}><span className="table-text">{separator(prizeGen.AVALANCHE.tvl.toFixed(0))}</span> <img src='./images/usdcToken.svg' className='token-icon' /></td></tr>
                    <tr><td><span className="table-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TOTAL </span></td><td style={{ textAlign: "right" }}><span className="table-text">{separator(prizeGen.TOTALTVL.toFixed(0))}</span> <img src='./images/usdcToken.svg' className='token-icon' /></td></tr>
                </tbody>

            </table>
      
            <table className="protocol"><thead>
                <tr><td colSpan={2} style={{ textAlign: "center", backgroundColor: "#e2d5fa" }}>
                    <span className="table-header">Prize Generation</span>
                </td>
                </tr>
            </thead>
                <tbody>
                    <tr><td><span className="table-text">
                        <img src="./images/optimism.png" className="icon child child1" alt="Optimism" />&nbsp;
                        Optimism</span></td><td style={{ textAlign: "right" }}><span className="table-text"> {separator(prizeGen.OPTIMISM.dayYield.toFixed(0))}</span> <img src='./images/usdcToken.svg' className='token-icon' /></td></tr>
                    
                    <tr><td><span className="table-text">
                        <img src="./images/polygontoken.png" className="icon child child1" alt="Polygon" />&nbsp;
                        Polygon</span></td><td style={{ textAlign: "right" }}><span className="table-text">
                            {separator(prizeGen.POLYGON.dayYield.toFixed(0))}</span> <img src='./images/usdcToken.svg' className='token-icon' /></td></tr>
                    <tr><td><span className="table-text"><img src="./images/ethtoken.png" className="icon child child1" alt="Ethereum" />&nbsp;
                        Ethereum </span></td><td style={{ textAlign: "right" }}><span className="table-text">{separator(prizeGen.ETHEREUM.dayYield.toFixed(0))}</span> <img src='./images/usdcToken.svg' className='token-icon' /></td></tr>
                    <tr><td><span className="table-text"><img src="./images/avalanche.png" className="icon child child1" alt="Avalanche" />&nbsp;
                        Avalanche </span></td><td style={{ textAlign: "right" }}><span className="table-text">{separator(prizeGen.AVALANCHE.dayYield.toFixed(0))}</span> <img src='./images/usdcToken.svg' className='token-icon' /></td></tr>
                    <tr><td><span className="table-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TOTAL PER DAY </span></td><td style={{ textAlign: "right" }}><span className="table-text">{separator(prizeGen.TOTAL.toFixed(0))}</span> <img src='./images/usdcToken.svg' className='token-icon' /></td></tr>
                    <tr><td><span className="table-text">
                        {/* <img src="./images/optimism.png" className="icon child child1" alt="Optimism" />&nbsp;
                    Optimism */}
                    </span></td><td style={{ textAlign: "right" }}><span className="table-text">+ {separator(prizeGen.OPTIMISM.rewardsPerDay.toFixed(0))}</span><img src='./images/optimism.png' className='token-icon' /></td></tr>

                </tbody>

            </table>


    
        </div>
        }


    </div>
    );
}
export default Protocol;




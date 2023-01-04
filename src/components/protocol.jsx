import React, { useState, useEffect } from "react";
import Select from "react-select";
import Modal from "react-modal";
// import { TvlActive } from "./tvlActive.jsx"
// import { Tvl } from "./tvl.jsx"
import { Generator } from "./generator.jsx";

import "./modal.css";
import { ethereumPrizePoolAddress } from "./contractConnect.jsx";

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

const explorerURL = "https://poolexplorer.xyz";
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
  const [zap1, setZap1] = useState([]);
  const [zap137, setZap137] = useState([]);
  const [unique, setUnique] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [polStat, setPolStat] = useState({});
  const [showPolyPol, setShowPolyPol] = useState(false)
  const [showEthPol, setShowEthPol] = useState(false)

  useEffect(() => {
    const load = async () => {
      setPopup(true);

      try {
        // let tvlActive = await TvlActive()
        // let tvl = await Tvl()
        let generator = await Generator();
        setPrizeGen(generator);
        let zapper = await getZapper();
        // setTvlActive(tvlActive)
        // console.log(tvl)
        // console.log(tvlActive)

        setPopup(false);
      } catch (e) {
        console.log("fetch error i ", e);
        setUnique("api error");
      }
    };
    load();
  }, []);

  async function getZapper() {
    let one = await fetch("https://poolexplorer.xyz/zapper1");
    one = await one.json();
    let seven = await fetch("https://poolexplorer.xyz/zapper137");
    seven = await seven.json();
    // seven.balances["0x3fee50d2888f2f7106fcdc0120295eba3ae59245"].products[0].assets
    let oneSum = 0;
    one.balances[
      "0x42cd8312d2bce04277dd5161832460e95b24262e"
    ].products[0].assets.forEach(
      (asset) =>
        (oneSum += asset.tokens.reduce(
          (accumulator, currentValue) => accumulator + currentValue.balanceUSD,
          0
        ))
    );
    let sevenSum = 0;
    let sevenPool = 0;
    let sevenEth = 0;
    let onePool = 0;
    let oneEth = 0;

    seven.balances[
      "0x3fee50d2888f2f7106fcdc0120295eba3ae59245"
    ].products[0].assets.forEach(
      (asset) =>
        (sevenSum += asset.tokens.reduce(
          (accumulator, currentValue) => accumulator + currentValue.balanceUSD,
          0
        ))
    );
    seven.balances[
      "0x3fee50d2888f2f7106fcdc0120295eba3ae59245"
    ].products[0].assets.forEach((asset) => {
      let poolFilter = asset.tokens.filter((token) => token.symbol === "POOL");
      for (let x of asset.tokens) {
        x.symbol === "POOL" ? (sevenPool += x.balance) : (sevenPool += 0);
        x.symbol === "WETH" ? (sevenEth += x.balance) : (sevenEth += 0);
      }
    });
    one.balances[
      "0x42cd8312d2bce04277dd5161832460e95b24262e"
    ].products[0].assets.forEach((asset) => {
      let poolFilter = asset.tokens.filter((token) => token.symbol === "POOL");
      for (let x of asset.tokens) {
        x.symbol === "POOL" ? (onePool += x.balance) : (onePool += 0);
        x.symbol === "WETH" ? (oneEth += x.balance) : (oneEth += 0);
      }
    });

    console.log("one sum", oneSum);
    console.log("seven sum", sevenSum);
    console.log("seven pool", sevenPool);
    console.log("seven eth", sevenEth);
    console.log("seven pool", onePool);
    console.log("seven eth", oneEth);

    setPolStat({
      polyPool: sevenPool,
      polyEth: sevenEth,
      polyTotal: sevenSum,
      ethPool: onePool,
      ethEth: oneEth,
      ethTotal: oneSum,
    });
    setZap1(one);
    setZap137(seven);
  }

  return (
    <div>
      {popup && (
        <div className="modal">
          <div className="modal-content">
            <center>
              <p>
                <img src="./images/Pooly.png" className="pooly" />
                &nbsp;&nbsp;{modalText()}
                <div class="loader" style={{ display: "inline-block" }}></div>
              </p>
            </center>
          </div>
        </div>
      )}
      {prizeGen.TOTALTVL > 0 && (
        <div className="protocol">
          <br></br>
          <table className="protocol">
            <thead>
              <tr>
                <td
                  colSpan={2}
                  style={{ textAlign: "center", backgroundColor: "#e2d5fa" }}
                >
                  <span className="table-header">Total Value Pooled</span>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="table-text">
                    <img
                      src="./images/optimism.png"
                      className="icon child child1"
                      alt="Optimism"
                    />
                    &nbsp; Optimism
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="table-text">
                    <img src="./images/usdcToken.svg" className="token-icon" />{" "}
                    {separator(prizeGen.OPTIMISM.tvl.toFixed(0))}
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="table-text">
                    <img
                      src="./images/polygontoken.png"
                      className="icon child child1"
                      alt="Polygon"
                    />
                    &nbsp; Polygon
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="table-text">
                    <img src="./images/usdcToken.svg" className="token-icon" />{" "}
                    {separator(prizeGen.POLYGON.tvl.toFixed(0))}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="table-text">
                    <img
                      src="./images/ethtoken.png"
                      className="icon child child1"
                      alt="Ethereum"
                    />
                    &nbsp; Ethereum{" "}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="table-text">
                    {" "}
                    <img
                      src="./images/usdcToken.svg"
                      className="token-icon"
                    />{" "}
                    {separator(prizeGen.ETHEREUM.tvl.toFixed(0))}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="table-text">
                    <img
                      src="./images/avalanche.png"
                      className="icon child child1"
                      alt="Avalanche"
                    />
                    &nbsp; Avalanche{" "}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="table-text">
                    {" "}
                    <img
                      src="./images/usdcToken.svg"
                      className="token-icon"
                    />{" "}
                    {separator(prizeGen.AVALANCHE.tvl.toFixed(0))}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="table-text">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TOTAL{" "}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="table-text">
                    {" "}
                    <img
                      src="./images/usdcToken.svg"
                      className="token-icon"
                    />{" "}
                    {separator(prizeGen.TOTALTVL.toFixed(0))}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="protocol">
            <thead>
              <tr>
                <td
                  colSpan={2}
                  style={{ textAlign: "center", backgroundColor: "#e2d5fa" }}
                >
                  <span className="table-header">Prize Generation</span>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="table-text">
                    <img
                      src="./images/optimism.png"
                      className="icon child child1"
                      alt="Optimism"
                    />
                    &nbsp;Optimism
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="table-text">
                    {" "}
                    <img
                      src="./images/usdcToken.svg"
                      className="token-icon"
                    />{" "}
                    {separator(prizeGen.OPTIMISM.dayYield.toFixed(0))}
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="table-text">
                    <img
                      src="./images/polygontoken.png"
                      className="icon child child1"
                      alt="Polygon"
                    />
                    &nbsp; Polygon
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="table-text">
                    <img src="./images/usdcToken.svg" className="token-icon" />{" "}
                    {separator(prizeGen.POLYGON.dayYield.toFixed(0))}
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="table-text">
                    <img
                      src="./images/ethtoken.png"
                      className="icon child child1"
                      alt="Ethereum"
                    />
                    &nbsp; Ethereum{" "}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="table-text">
                    {" "}
                    <img
                      src="./images/usdcToken.svg"
                      className="token-icon"
                    />{" "}
                    {separator(prizeGen.ETHEREUM.dayYield.toFixed(0))}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="table-text">
                    <img
                      src="./images/avalanche.png"
                      className="icon child child1"
                      alt="Avalanche"
                    />
                    &nbsp; Avalanche{" "}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="table-text">
                    {" "}
                    <img
                      src="./images/usdcToken.svg"
                      className="token-icon"
                    />{" "}
                    {separator(prizeGen.AVALANCHE.dayYield.toFixed(0))}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="table-text">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TOTAL PER DAY{" "}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="table-text">
                    {" "}
                    <img
                      src="./images/usdcToken.svg"
                      className="token-icon"
                    />{" "}
                    {separator(prizeGen.TOTAL.toFixed(0))}
                  </span>
                </td>
              </tr>
              {/* <tr><td><span className="table-text"> /*}
                        {/* <img src="./images/optimism.png" className="icon child child1" alt="Optimism" />&nbsp;
                    Optimism */}
              {/*</span></td><td style={{ textAlign: "right" }}><span className="table-text">+ <img src='./images/optimism.png' className='icon' /> {separator(prizeGen.OPTIMISM.rewardsPerDay.toFixed(0))}</span>&nbsp;</td></tr>
               */}
            </tbody>
          </table>

          <br></br>
          <br></br>
          <div>
            <table className="protocol">
              <thead>
                <tr>
                  <td
                    colSpan={3}
                    style={{ textAlign: "center", backgroundColor: "#e2d5fa" }}
                  >
                    <span className="table-header">Polygon POL</span>
                    <img src="/images/info.png" className="icon info"  onClick={() => {setShowPolyPol(!showPolyPol)}} />

                  </td>
                </tr>
              </thead>
              <>
                <tr>
                  <td>
                    <span className="table-text">
                      ${separator(Math.round(polStat.polyTotal))} &nbsp;&nbsp;&nbsp;
                      <img src="/images/pool.png" className="icon"></img>{" "}
                      {separator(Math.round(polStat.polyPool))}
                      &nbsp;&nbsp;&nbsp;
                      <img src="/images/ethereum.png" className="icon"></img>
                      &nbsp;
                      {separator(Math.round(polStat.polyEth))}
                    </span>
                  </td>
                </tr>
              </>
            </table>
  
            
            {showPolyPol && <div className="pol-div">
              {zap137.balances[
                "0x3fee50d2888f2f7106fcdc0120295eba3ae59245"
              ].products[0].assets.map((asset) => (
                <div
                  style={{
                    paddingTop: "15px",
                  }}
                  className="tokens-table"
                >
                  <>
                    <table className="token-table">
                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            textAlign: "center",
                            backgroundColor: "#b6b8e8",
                          }}
                        >
                          <span className="table-text">
                            {asset.displayProps.label.includes(
                              "3.3849213185522378e+38"
                            )
                              ? asset.displayProps.label
                                  .replace("3.3849213185522378e+38", "infinity")
                                  .replace("POOL / WETH", "")
                              : asset.displayProps.label.replace(
                                  "POOL / WETH",
                                  ""
                                )}
                          </span>
                        </td>
                      </tr>
                      <>
                        {asset.tokens.map((token) => {
                          return (
                            <>
                              <tr>
                                {/* <td><span className="table-text">
       
 {token.symbol}</span> </td> */}
                                <td style={{ textAlign: "left" }}>
                                  <span className="table-text">
                                    {token.symbol === "POOL" ? (
                                      <img
                                        src="/images/pool.png"
                                        className="icon"
                                      ></img>
                                    ) : (
                                      <img
                                        src="/images/ethereum.png"
                                        className="icon"
                                      ></img>
                                    )}
                                    &nbsp;{token.balance.toFixed(2)}
                                  </span>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  <span className="table-text">
                                    {" "}
                                    ${Math.round(token.balanceUSD)}
                                  </span>{" "}
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </>{" "}
                    </table>
                  </>
                </div>
              ))}</div>}

<br></br>
<br></br>
            {!popup && (
              <>
                <table className="protocol">
                  <thead>
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          textAlign: "center",
                          backgroundColor: "#e2d5fa",
                        }}
                      >
                        <span className="table-header">Mainnet POL</span>
                        <img src="/images/info.png" className="icon info"  onClick={() => {setShowEthPol(!showEthPol)}} />
                      </td>
                    </tr>
                  </thead>
                  <>
                    <tr>
                      <td>
                        <span className="table-text">
                          ${separator(Math.round(polStat.ethTotal))}{" "}
                          &nbsp;&nbsp;&nbsp;
                          <img
                            src="/images/pool.png"
                            className="icon"
                          ></img>{" "}
                          {separator(Math.round(polStat.ethPool))}
                          &nbsp;&nbsp;&nbsp;
                          <img
                            src="/images/ethereum.png"
                            className="icon"
                          ></img>
                          &nbsp;
                          {separator(Math.round(polStat.ethEth))}
                        </span>
                      </td>
                    </tr>
                  </>
                </table>
              </>
            )}
     
           


            {showEthPol && ( <div className="pol-div">
              <>
                {zap1.balances[
                  "0x42cd8312d2bce04277dd5161832460e95b24262e"
                ].products[0].assets.map((asset) => (
                  <div
                    style={{
                      paddingTop: "15px",
                    }}
                    className="tokens-table"
                  >
                    <table>
                      <span>
                        <tr>
                          <td
                            colSpan={3}
                            style={{
                              textAlign: "center",
                              backgroundColor: "#b6b8e8",
                            }}
                          >
                            {" "}
                            <span className="table-text">
                              {asset.displayProps.label.includes(
                                "3.3849213185522378e+38"
                              )
                                ? asset.displayProps.label
                                    .replace(
                                      "3.3849213185522378e+38",
                                      "infinity"
                                    )
                                    .replace("POOL / WETH", "")
                                : asset.displayProps.label.replace(
                                    "POOL / WETH",
                                    ""
                                  )}
                            </span>
                          </td>
                        </tr>
                        {asset.tokens.map((token) => (
                          <tr>
                            {/* <td>
        <span className="table-text">
 {token.symbol}</span></td> */}
                            <td style={{ textAlign: "left" }}>
                              <span className="table-text">
                                {token.symbol === "POOL" ? (
                                  <img
                                    src="/images/pool.png"
                                    className="icon"
                                  ></img>
                                ) : (
                                  <img
                                    src="/images/ethereum.png"
                                    className="icon"
                                  ></img>
                                )}
                                &nbsp;{token.balance.toFixed(2)}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <span className="table-text">
                                {" "}
                                ${Math.round(token.balanceUSD)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </span>
                    </table>
                  </div>
                ))}
              </></div>
            )}
          </div>
        </div>
      )}<br></br><br></br><br></br><br></br><br></br>
    </div>
  );
}
export default Protocol;

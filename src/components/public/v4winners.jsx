import React, { useState, useEffect } from "react";
import Select from "react-select";
import Modal from "react-modal";
import { Link } from "react-router-dom";

import { ethers } from "ethers";
import { PolygonTicketContract,
  EthereumTicketContract,
  AvaxTicketContract,
  OptimismTicketContract
 } from "./contractConnect";

import "./../modal.css";

// const drawings = 99;
const explorerURL = "https://poolexplorer.xyz"


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

// maintenance mode
// textArray = [ "Pooly is migrating, sorry for the inconvenience, please check back later"]


let currentTicketContract = "";
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
function UsdcWinners() {
  const currentTimestamp = parseInt(Date.now() / 1000);
  const ticketStartTimestamp = 1634184538;
  const [transactions, setTransactions] = useState([]);
  //   const [total, setTotal] = useState([]);
  //   const [depositors, setDepositors] = useState([]);

  const [popup, setPopup] = useState(Boolean);
  const onChange = (selectedOption) => {
    setDraw(selectedOption);
    console.log(`Option selected:`, selectedOption);
  };
  // const startDraw = { label: drawings, value: drawings };
  const [draw, setDraw] = useState({});
  const [unique, setUnique] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAddress, setModalAddress] = useState(
    "0x6277f0457cbd2ded7ba93a8338d1deb1d08a8795"
  );
  const [playerBalance, setPlayerBalance] = useState(0);
  const [playerData, setPlayerData] = useState([]);
  const [cumulativeClaimable, setCumulativeClaimable] = useState(0);
  const [prizesWon,setPrizesWon] = useState(0)
  const [cumulativeAverageBalance, setCumulativeAverageBalance] = useState(0);
  const [averageBalanceTimeAnnualized, setAverageBalanceTimeAnnualized] =
    useState(0);
  const [drawings, setDrawings] = useState()
  const [options, setOptions] = useState([])
  const [modalNetwork, setModalNetwork] = useState("");


  useEffect(() => {
    const load = async () => {
      setPopup(true);

      try {
        let currentDrawFetch = await fetch(explorerURL + "/recent")
        let currentDrawResult = await currentDrawFetch.json()

        setTransactions(currentDrawResult.result);

        setDraw({ label: currentDrawResult.id, value: 0 })
        let drawOptions = [];
        for (let i = 0; i <= currentDrawResult.id; i++) {
          drawOptions.push({ label: i, value: i });
        }
        drawOptions.reverse();
        setOptions(drawOptions)
        setDrawings(parseInt(currentDrawResult.id))
        setUnique(currentDrawResult.result.length);
        setPopup(false);
      } catch (e) {
        console.log("fetch error i ", e);
        setUnique("api error");
      }
    }
    load()
  }, [])
  useEffect(() => {
    resetModal();
    if (modalAddress !== 0) {
      const getPlayer = async () => {
        // console.log(currentTimestamp, "current timestamp");
        // console.log(ticketStartTimestamp, "start timestamp");

        let timeElapsed = 31536000 / (currentTimestamp - ticketStartTimestamp);
        timeElapsed = timeElapsed * 100; // for APR percentage
        // console.log("time: ", timeElapsed);
        setAverageBalanceTimeAnnualized(timeElapsed);
        let playerFetch =
          explorerURL + "/player?address=" + modalAddress;
        // console.log("player fetch", playerFetch);
        // console.log("modal network: ", modalNetwork);
        let playerNetwork = "";
        if (modalNetwork == 4) {
          currentTicketContract = AvaxTicketContract;
          playerNetwork = "avalanche";
        } else if (modalNetwork == 3) {
          playerNetwork = "polygon";
          currentTicketContract = PolygonTicketContract;
        } else if (modalNetwork == 6) {
          playerNetwork = "optimism";
          currentTicketContract = OptimismTicketContract;
        } else if (modalNetwork == 1) {
          playerNetwork = "ethereum";
          currentTicketContract = EthereumTicketContract;
        }
        try {
          let [balance, averageBalance, playerData] = await Promise.all([
            currentTicketContract.balanceOf(modalAddress),
            currentTicketContract.getAverageBalanceBetween(
              modalAddress,
              ticketStartTimestamp,
              currentTimestamp
            ),
            fetch(playerFetch),
          ]);
          averageBalance = ethers.utils.formatUnits(averageBalance, 6);
          // console.log(averageBalance, "avgbal");
          balance = ethers.utils.formatUnits(balance, 6);
          balance = parseFloat(balance).toFixed(2);
          setPlayerBalance(balance);
          let playerJson = await playerData.json();
          // console.log(playerJson);
          playerJson = playerJson.filter(function (entry) {
            return entry.network === playerNetwork;
          });
          playerJson.sort(function (a, b) {
            return a.draw_id - b.draw_id;
          });
          playerJson.reverse();
          // console.log(playerJson);
          setPlayerData(playerJson);
          let totalClaimable = 0;
          let totalPrizesWon = 0

          for (let x of playerJson) {
            let total = 0;
            let prize = 0;
            // console.log("x:",x.claimable_prizes)
            if (x.claimable_prizes !== null) {
                totalPrizesWon = totalPrizesWon + x.claimable_prizes.length;
              for (let y of x.claimable_prizes) {
                prize = y / 10000000 / 10000000;
                total += parseFloat(prize);
                totalClaimable += parseFloat(prize);
              }
              // winDiv.innerHTML +=
              //   x.network + " - draw " + x.draw_id + " - prizes: " + total + "<br>";
              // console.log(x.network, " - draw ", x.draw_id, " - prizes: ", total);
            
            setCumulativeClaimable(totalClaimable.toFixed(0));
            setCumulativeAverageBalance(averageBalance);
            setPrizesWon(totalPrizesWon);
            // console.log("total claimable: ", totalClaimable);
          }}
        } catch (error) {
          console.log(error);
        }
      };
      getPlayer();
    }
  }, [modalAddress]);

  useEffect(() => {
    // console.log("useE");
    const goooo = async () => {
      if (draw.value === 0 || typeof draw.value === 'undefined') { } else {
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
        let polyApi = explorerURL + "/draw" + draw.value + "/";

        if (polyApi !== explorerURL + "/drawundefined/") {
          try {
            let api = await fetch(polyApi, headers);

            let events = await api.json();

            setUnique(events.length);
            // events = events.slice(0,1000)
            setTransactions(events);

            setPopup(false);
          } catch (e) {
            console.log("fetch error", e);
            setUnique("api fetch error");
          }
        }
      }
    };
    // console.log("draw value: ",draw.value)

    goooo()
  }, [draw]);
  async function closeModal() {
    setIsModalOpen(false);
    setModalAddress(0);
  }
  async function resetModal() {
    setPlayerBalance(0);
    setCumulativeClaimable(0);
  }
  async function openModal(address, network) {
    resetModal();
    setModalNetwork(network);
    setIsModalOpen(true);
    setModalAddress(address);
  }

  let depositors = transactions.length;
  let totals = 0;
  let balance = 0;
  let twabTotal = 0;
  transactions.forEach((item) => {
    balance = item.w;
    twabTotal += parseFloat(item.b);
    totals += parseFloat(balance);
  });
  let total = totals.toFixed(0);
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
            DRAW<span className="hidden-mobile"> #&nbsp;</span>
            <Select options={options} onChange={onChange} value={draw} />
            <span className="hidden-mobile"> &nbsp; &nbsp; &nbsp;</span>
            <span className="numb-purp hidden-mobile twenty-two"> {separator(unique)}</span>{" "}
            <span className="hidden-mobile twenty-two">WINNERS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            {/* <span className="numb-purp"> {separator(depositors)}</span> PRIZES */}
            <img src="./images/usdc.png" className="token" />
            <span className="numb-purp twenty-two">{separator(total)}</span> <span className="twenty-two">TOTAL</span>
            {/* TWAB {twabTotal} */}
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
            <table className="padded is-stripped table is-hoverable">
              <thead>
                <tr>

                  <th>Address</th>
                  <th style={{ textAlign: "right" }}>Amount&nbsp;&nbsp;&nbsp;&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr>
                    <td>
                      {" "}
                      <div className="addressText">
                        
                          <span>
                            <div
                              className="inlineDiv"
                              onClick={() => {
                                openModal(item.a, item.n);
                              }}
                            >{item.n === "1" && (
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
                              />    )}
                              &nbsp;&nbsp;
                              {item.a} {item.a === "0xb37b3b78022e6964fe80030c9161525880274010" ? <img
                                src="./images/ukraine.png"
                                className="emoji"
                                alt="Ukraine"
                              /> : ""}                            </div>
                          </span>
                        
                      </div> {item.w / (item.b / 1e14) > 300 ? "" : ""}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      
                  
                      {separator(parseInt(item.w))}&nbsp;
                      <img
                        src={"./images/" + emoji(item.w) + ".png"}
                        className="emoji"
                        alt={item.d}
                      ></img>&nbsp;&nbsp;&nbsp;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <PlayerModal /> */}
      <Modal
        isOpen={isModalOpen}
        style={{
          overlay: {
            position: "fixed",

            margin: "auto",
            top: "10%",
            borderRadius: 15,
            width: 540,
            height: 340,
            backgroundColor: "purple",
            color: "black",
          },
        }}
      ><div className="closeModal close" onClick={() => closeModal()}></div><br></br>
        <center>
          <div>
            {modalNetwork === "3" ? (
              <span>
                <img
                  src="./images/polygon.png"
                  className="emoji"
                  alt="Polygon"
                />
                &nbsp;&nbsp;<div className="addressText">
                <a
                  href={"https://polygonscan.com/address/" + modalAddress}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {modalAddress}
                </a></div>
              </span>
            ) : (
              ""
            )}
            {modalNetwork === "4" ? (
              <span>
                <img
                  src="./images/avalanche.png"
                  className="emoji"
                  alt="Avalanche"
                />
                &nbsp;&nbsp;<div className="addressText">
                <a
                  href={"https://snowtrace.io/address/" + modalAddress}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {modalAddress}
                </a></div>
              </span>
            ) : (
              ""
            )}{modalNetwork === "6" ? (
              <span>
                <img
                  src="./images/optimism.png"
                  className="emoji"
                  alt="Optimism"
                />
                &nbsp;&nbsp;<div className="addressText">
                <a
                  href={"https://optimistic.etherscan.io/address/" + modalAddress}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {modalAddress}
                </a></div>
              </span>
            ) : (
              ""
            )}
            {modalNetwork === "1" ? (
              <span>
                <img
                  src="./images/ethereum.png"
                  className="emoji"
                  alt="Ethereum"
                />
                &nbsp;&nbsp;<div className="addressText">
                <a
                  href={"https://etherscan.com/address/" + modalAddress}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {modalAddress} 
                </a> </div>
              </span>
            ) : (
              ""
            )}
          </div>
          <br></br>

          {cumulativeClaimable > 0 ? (
            <div>
              {" "}
              <table>
                <tr>
                  <td>
                    <span className="modalDesc">Current Balance</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {" "}
                    <img src="./images/usdc.png" className="token" />
                    &nbsp;{separator(parseFloat(playerBalance).toFixed())}
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="modalDesc">XP</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {" "}
                    {playerData.length} draws
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="modalDesc">Average Balance</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {" "}
                    {separator(
                      parseFloat(
                        cumulativeAverageBalance *
                        (drawings / playerData.length)
                      ).toFixed()
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="modalDesc"><Link to={{pathname:"/poolers", 
                    search:"?address=" + modalAddress }} >{prizesWon} Prizes won</Link></span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {" "}
                    <img src="./images/usdc.png" className="token" />
                    &nbsp;{cumulativeClaimable}
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="modalDesc">Prize APR</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {" "}
                    {separator(
                      parseFloat(
                        (cumulativeClaimable / cumulativeAverageBalance) *
                        averageBalanceTimeAnnualized
                      ).toFixed()
                    )}
                    %
                  </td>
                </tr>
              </table>
            </div>
          ) : (
            <div class="loader" style={{ display: "inline-block" }}></div>
          )}
          {/* <div>{playerData.map((player) => {<p>{player.draw_id}: {player.claimable_prizes}</p>})}
      </div> */}
        </center>
        <br></br>
        
        { }
      </Modal>
    </div>
  );
}
export default UsdcWinners;

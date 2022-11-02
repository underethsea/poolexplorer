import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import "./modal.css";
import { TimeConvert } from "./timeConvert.js";

const emoji = (amount) => {
  let emojiIcon = "";
  let weiAmount = ethers.utils.formatUnits(amount, 6);
  amount = parseFloat(weiAmount);
  console.log("amount ", amount);
  if (amount > 2499) {
    emojiIcon = "trophy";
  } else if (amount > 99) {
    emojiIcon = "moneybag";
  } else if (amount > 19) {
    emojiIcon = "moneywings";
  } else {
    emojiIcon = "thumbsup";
  }

  return emojiIcon;
};

const decodeAddress = (addressInput) => {
  let decoded = ethers.utils.defaultAbiCoder.decode(["address"], addressInput);
  return decoded[0];
};
const decodeAmount = (codedAmount) => {
  let decoded = ethers.utils.defaultAbiCoder.decode(["uint256"], codedAmount);
  return decoded[0];
};
function separator(numb) {
  var str = numb.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}

function amount(weiAmount) {
  weiAmount = ethers.utils.formatUnits(weiAmount, 6);
  return Number.parseFloat(weiAmount).toFixed(0);
}

function DelegationEvents() {
  const [claims, setClaims] = useState([]);
  const [popup, setPopup] = useState(Boolean);
  const [multiDelegation, setMultiDelegation] = useState([]);

  useEffect(() => {
    setPopup(true);
    let delegationData = [];
    const callEvents = async () => {
      const polygonTicketAddress = "0x6a304dFdb9f808741244b6bfEe65ca7B3b3A6076";
      const ethereumTicketAddress =
        "0xdd4d117723C257CEe402285D3aCF218E9A8236E1";
      const avalancheTicketAddress =
        "0xB27f379C050f6eD0973A01667458af6eCeBc1d90";
      const delegatedTopic =
        "0x4bc154dd35d6a5cb9206482ecb473cdbf2473006d6bce728b9cc0741bcc59ea2";
      const multiDelegationTopic =
        "0x383183291bd9a7fb8bd9c7c86c5013a89d1490c9f4e486da279804b83729a1dc";
      const multiDelegationAddress =
        "0x89Ee77Ce3F4C1b0346FF96E3004ff7C9f972dEF8";

      var endpointURL =
        "https://polygon-mainnet.g.alchemy.com/v2/" +
        process.env.REACT_APP_ALCHEMY_KEY;
      var customHttpProvider = new ethers.providers.JsonRpcProvider(
        endpointURL
      );

      const prizeDistributorAddress =
        "0x8141BcFBcEE654c5dE17C4e2B2AF26B67f9B9056";
      const prizeDistributorAbi = JSON.parse(
        '[{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"contract IERC20","name":"_token","type":"address"},{"internalType":"contract IDrawCalculator","name":"_drawCalculator","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint32","name":"drawId","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"payout","type":"uint256"}],"name":"ClaimedDraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IDrawCalculator","name":"calculator","type":"address"}],"name":"DrawCalculatorSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ERC20Withdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"pendingOwner","type":"address"}],"name":"OwnershipOffered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"}],"name":"TokenSet","type":"event"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint32[]","name":"_drawIds","type":"uint32[]"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"claim","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getDrawCalculator","outputs":[{"internalType":"contract IDrawCalculator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint32","name":"_drawId","type":"uint32"}],"name":"getDrawPayoutBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IDrawCalculator","name":"_newCalculator","type":"address"}],"name":"setDrawCalculator","outputs":[{"internalType":"contract IDrawCalculator","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"_erc20Token","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawERC20","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]'
      );
      const distributionContract = new ethers.Contract(
        prizeDistributorAddress,
        prizeDistributorAbi,
        customHttpProvider
      );

      const currentBlock = await customHttpProvider.getBlockNumber();
      const fromBlock = currentBlock - 500000;
      let url =
        "https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=" +
        fromBlock +
        "&toBlock=" +
        "latest" +
        "&address=" +
        polygonTicketAddress +
        "&topic0=" +
        delegatedTopic +
        "&apikey=" +
        process.env.REACT_APP_POLYGONSCAN_KEY;
      let urlFetch = await fetch(url);
      urlFetch = await urlFetch.json();
      console.log(urlFetch.result);
      console.log(url);
      let multiUrl =
        "https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=" +
        fromBlock +
        "&toBlock=" +
        "latest" +
        "&address=" +
        multiDelegationAddress +
        "&topic0=" +
        multiDelegationTopic +
        "&apikey=" +
        process.env.REACT_APP_POLYGONSCAN_KEY;
      let multiUrlFetch = await fetch(multiUrl);
      multiUrlFetch = await multiUrlFetch.json();
      console.log(multiUrlFetch);
      // let eventFilter = distributionContract.filters.ClaimedDraw();
      // let distributionClaim = await distributionContract.queryFilter(eventFilter,fromBlock)

      // console.log("total events ",distributionClaim.length)
      // console.log(distributionClaim);

      // distributionClaim.sort(function (a, b) {
      //     return a.args.payout - b.args.payout;

      //   });
      //   distributionClaim.reverse();
      let fetchedResults = urlFetch.result;
      fetchedResults.forEach((fetchResult) => {
        if (fetchResult.topics[1] != fetchResult.topics[2]) {
          let fetchObject = {
            time: ethers.utils.formatUnits(fetchResult.timeStamp, 0),
            hash: fetchResult.transactionHash,
            from: decodeAddress(fetchResult.topics[1]),
            to: decodeAddress(fetchResult.topics[2]),
          };
          delegationData.push(fetchObject);
        }
      });
      multiUrlFetch.result.forEach((multiResult) => {
        let fetchObject = {
          time: ethers.utils.formatUnits(multiResult.timeStamp, 0),
          hash: multiResult.transactionHash,
          from: decodeAddress(multiResult.topics[1]),
          to: "multi",
          amount: amount(decodeAmount(multiResult.data)),
        };
        delegationData.push(fetchObject);
      });
      delegationData.sort((a, b) => (a.time > b.time ? 1 : -1));
      delegationData.reverse();
      console.log("data:", delegationData);
      let delegationEvents = urlFetch.result.reverse();
      setMultiDelegation(multiUrlFetch.result);
      setClaims(delegationData);
      setPopup(false);
    };
    callEvents();
  }, []);

  return (
    <div className="transactions section">
      <div className="card has-table has-mobile-sort-spaced">
        <header className="card-header">
          <p className="card-header-title">
            RECENT POLYGON DELEGATIONS &nbsp;&nbsp;&nbsp;&nbsp;
            {popup && (
              <div className="loader" style={{ display: "inline-block" }}></div>
            )}
            {/* <span className="numb-purp">{separator(total)}</span><img src='./images/usdc.png' className='token'/> <span className="numb-purp"> {separator(depositors)}</span> Depositors  <span className="numb-purp">{separator(average.toFixed(0))}</span><img src='./images/usdc.png' className='token'/> average  */}
          </p>
        </header>
        <div className="card-content">
          <div className="table-wrapper has-mobile-cards">
            <table className="is-stripped table is-hoverable">
              <thead>
                <tr>
                  {/* <th>Transaction Hash</th>
                          <th>Time</th> */}
                  <th>Time</th>
                  <td>Transaction</td>
                  <th>Addresses</th>
                  {/* <th  style={{ textAlign: 'right' }}>Amount</th> */}
                </tr>
              </thead>
              <tbody>
                {claims.map((item) => (
                  <tr key={item.hash}>
                    <td>
                      {TimeConvert(item.time)}{" "}
                      {item.amount > 0 ? (
                        <img
                          src={"./images/alligator.png"}
                          className="emoji"
                          alt="emoji"
                        ></img>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      <div className="addressText">
                        <a
                          href={"https://polygonscan.com/tx/" + item.hash}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.hash.substring(0, 10)}
                        </a>
                      </div>
                      {/* &nbsp;{checkIfYearnOrPod(item.address)} */}
                    </td>
                    <td>
                      {" "}
                      <a
                        href={"https://polygonscan.com/address/" + item.from}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.from.substring(0, 8)}{" "}
                      </a>{" "}
                      {" -> "}{" "}
                      {item.to === "multi" ? (
                        <>
                          <img
                            src={"./images/usdc.png"}
                            className="emoji"
                            alt="emoji"
                          ></img>{" "}
                          {item.amount}{" "}
                        </>
                      ) : (
                        <>
                          <a
                            href={"https://polygonscan.com/address/" + item.to}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.to.substring(0, 8)}
                          </a>
                        </>
                      )}
                    </td>
                    {/* <td  style={{ textAlign: 'right' }}>{item.amount > 0 ? <><img src={'./images/usdc.png'} className='emoji' alt='emoji'></img> {item.amount}</> : "Full Balance"}</td> */}
                    {/* <td>
                                <img src={'./images/' + emoji(item.topics[2]) + '.png'} className='emoji' alt='emoji'></img>
                                &nbsp;
                                    {separator(amount(item.topics[2]))}
                                    </td> */}
                  </tr>
                ))}
                {/* {multiDelegation.map((entry) =>
                            <tr key={entry.tranactionHash}>
                              <td>{entry.topics[0]}</td>
                              <td>{entry.topics[1]}</td>
                              <td>{entry.topics[2]}</td>
                              <td>{entry.data}</td>


                            </tr>
                            )} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DelegationEvents;

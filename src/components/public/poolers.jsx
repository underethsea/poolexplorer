// react madness Optimism = optimism = oPtimism = 0ptimism = opt1m1sm

import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import Modal from "react-modal";
import "./../modal.css";
// import distributorAbi from "./distributor.json"
import { GetClaimsHistory } from "./getClaimsHistory.jsx"
import prizeDistributorAbi from "./distributor.json"
import { ethers } from "ethers";
import {
  chain,
  useAccount,
  useConnect,
  useContract,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
  useSigner,
} from "wagmi";

import "./../modal.css";

import {
  PolygonTicketContract,
  EthereumTicketContract,
  AvaxTicketContract,
  OptimismTicketContract,
  PolygonUsdcContract,
  EthereumUsdcContract,
  OptimismUsdcContract,
  AvaxUsdcContract,
  polygonPrizePoolAddress,
  ethereumPrizePoolAddress,
  optimismPrizePoolAddress,
  avaxPrizePoolAddress,
  PolygonPrizePoolContract,
  EthereumPrizePoolContract,
  OptimismPrizePoolContract,
  AvalanchePrizePoolContract
} from "./contractConnect";

const prizeDistributorFromChain = {
  optimism: "0x722e9BFC008358aC2d445a8d892cF7b62B550F3F",
  polygon: "0x8141BcFBcEE654c5dE17C4e2B2AF26B67f9B9056",
  ethereum: "0xb9a179DcA5a7bf5f8B9E088437B3A85ebB495eFe",
  avalanche: "0x83332F908f403ce795D90f677cE3f382FE73f3D1"

}

const prizeValue = (amount) => { let value = parseFloat(amount); value = value / 1e14; return value.toFixed(0) }
const prizeValueFloat = (amount) => { let value = parseFloat(amount); value = value / 1e14; return value }
const usdcValue = (amount) => { let value = parseFloat(amount); value = value / 1e6; return value }
function separator(numb) {
  numb = numb.toFixed(0)
  var str = numb.split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}

function amount(weiAmount) {
  weiAmount = parseFloat(weiAmount);
  weiAmount = weiAmount / 1000000;
  return weiAmount.toFixed(0);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const explorerURL = "https://poolexplorer.xyz"
const apiPath = "/player?wins=true&address="
// const apiPath = "/player?address="
async function getPooler(address) {
  try {
    let player = await fetch(explorerURL + apiPath + address)
    player = await player.json()
    return player
  } catch (error) { console.log("failed to fetch api/address"); return null }
}

function processClaimParameters(pooler, claimableWins, network, drawNum) {
  let networkFilter = claimableWins.filter(win => win.network.toLowerCase() === network.toLowerCase())
  networkFilter = networkFilter.filter(win => win.draw >= (drawNum - 30))

  let claimData = {
    // distributor: prizeDistributorFromChain[network.toLowerCase()],
    address: pooler,
    drawIds: [],
    winningPicks: [],
    gas: 400000
  }
  networkFilter.map((win, index) => {
    claimData.drawIds.push(win.draw)
    claimData.winningPicks.push(win.picks.sort(function (a, b) { return a - b }))
  })
  claimData.gas = 500000 + ((claimData.drawIds.length - 1) * 325000)
  claimData.winningPicks = ethers.utils.defaultAbiCoder.encode(["uint256[][]"], [claimData.winningPicks])
  // console.log("claim data", claimData)
  return claimData
}
async function getBalances(address, timestamp) {
  try {
    let [polyBalance, ethBalance, avaxBalance, opBalance, polyTwab, ethTwab, avaxTwab, opTwab] = await Promise.all([
      PolygonTicketContract.balanceOf(address),
      EthereumTicketContract.balanceOf(address),
      AvaxTicketContract.balanceOf(address),
      OptimismTicketContract.balanceOf(address),
      PolygonTicketContract.getBalanceAt(
        address,
        timestamp
      ),
      EthereumTicketContract.getBalanceAt(
        address,
        timestamp
      ),
      AvaxTicketContract.getBalanceAt(
        address,
        timestamp
      ),
      OptimismTicketContract.getBalanceAt(
        address,
        timestamp
      ),

    ]);
    let balances = {
      polygon: usdcValue(polyBalance),
      ethereum: usdcValue(ethBalance),
      avalanche: usdcValue(avaxBalance),
      optimism: usdcValue(opBalance),
      polygonTwab: usdcValue(polyTwab),
      ethereumTwab: usdcValue(ethTwab),
      avalancheTwab: usdcValue(avaxTwab),
      optimismTwab: usdcValue(opTwab)
    }
    let balanceArray = [balances]
    return balanceArray
  } catch (error) { console.log("error fetching balances"); return [null] }
}

let currentTicketContract = "";

// const emoji = (amount) => {
//   let emojiIcon = "";
//   // let weiAmount = amount / 1000000;
//   amount = parseFloat(amount);
//   if (amount > 2499) {
//     emojiIcon = "whale";
//   } else if (amount > 499) {
//     emojiIcon = "dolphin";
//   } else if (amount > 199) {
//     emojiIcon = "octopus";
//   } else if (amount > 99) {
//     emojiIcon = "lobster";
//   } else if (amount > 9) {
//     emojiIcon = "fis";
//   } else {
//     emojiIcon = "fish";
//   }

//   return emojiIcon;
// };

const sum = (a) => a.reduce((x, y) => parseInt(x) + parseInt(y));

function processWins(winsYo, claimsYo) {
  let notNull = winsYo.filter(v => v.claimable_prizes !== null);

  let queryFiltered = notNull.filter(eachWin => eachWin.claimable_prizes.length > 0)
  queryFiltered = queryFiltered.sort(function (a, b) {
    return a[1] - b[1];
  }).reverse();

  // let claims = await queryPrizeClaims(address)

  // console.log(queryFiltered)
  let winsProcessed = {}
  let winsArray = []
  let prizesCount = 0
  let sumPrizeValue = 0
  queryFiltered.map(win => {
    prizesCount += win.claimable_prizes.length;
    let prizesSum = sum(win.claimable_prizes)
    sumPrizeValue += prizeValueFloat(prizesSum)
    let claimed = false
    if (claimsYo[win.network].includes(win.draw_id.toString())) {
      claimed = true
    }
    winsArray.push({ network: capitalizeFirstLetter(win.network), draw: win.draw_id, win: prizesSum, claimed: claimed, picks: win.claimable_picks })
    // console.log(win.network, " ", win.draw_id, " ", prizesSum)
  })
  winsArray.sort(function (a, b) {
    return a.draw - b.draw
  }).reverse()
  winsProcessed.result = winsArray
  winsProcessed.prizes = prizesCount
  winsProcessed.total = sumPrizeValue
  // console.log(winsProcessed)
  return winsProcessed

}

const filterClaimsNetworkAndExpiry = (claims, network, currentDraw) => {
  let filtered = claims.filter(win => win.network.toLowerCase() === network.toLowerCase())
  filtered = filtered.filter(win => win.draw >= (currentDraw - 30))
  // console.log(filtered)
  return filtered
}

const distributorParams = {
  addressOrName: '0x722e9BFC008358aC2d445a8d892cF7b62B550F3F',
  contractInterface: prizeDistributorAbi.abi
}

const walletBalance = (balances, chain) => {
  let balance = 0
  if (chain === "Polygon") { balance = balances.polygon }
  if (chain === "Optimism") { balance = balances.optimism }
  if (chain === "Avalanche") { balance = balances.avalanche }
  if (chain === "Ethereum") { balance = balances.ethereum }
  return parseFloat(balance) / 1e6

}

// ["function claim(address _user, uint32[] _drawIds, bytes _data)","function getDrawCalculator() external view returns (IDrawCalculator)"]}

function Poolers() {

  const { connector: activeConnector, address, isConnecting, isDisconnected, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const signer = useSigner()


  const { data: calcData, isError: calcError, isLoading: calcLoading } = useContractRead({
    distributorParams,
    functionName: 'getDrawCalculator',
    chainId: 10

  })

  const [poolerAddress, setPoolerAddress] = useState("")
  const [wins, setWins] = useState([]);
  const [prizesWon, setPrizesWon] = useState(0);
  const [totalPrizeValue, setTotalPrizeValue] = useState(0);
  const [addressValue, setAddressValue] = useState("");
  const [balances, setBalances] = useState([null]);
  const [gotSome, setGotSome] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [boostBalance, setBoostedBalance] = useState(0);
  const [popup, setPopup] = useState(Boolean);
  const [xp, setXp] = useState(0);
  const [claimable, setClaimable] = useState([])
  const [currentDrawId, setCurrentDrawId] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFocus, setModalFocus] = useState("claim")
  const [allowances, setAllowances] = useState({})
  const [usdcBalances, setUsdcBalances] = useState({})
  const [prizeDistributor, setPrizeDistributor] = useState("0x722e9BFC008358aC2d445a8d892cF7b62B550F3F") // starts with OP distributor for no good reason
  const { chain, chains } = useNetwork()
  const [inputAmount, setInputAmount] = useState(0)

  const amountInput = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);
  // const {refresh, setRefresh} = useState(0)


  // console.log("pooler addy", poolerAddress)
  // console.log("address value", addressValue) 

  // for doing it right
  // const { config: claimConfig } = usePrepareContractWrite(
  //   {
  //     addressOrName: prizeDistributor,
  //     contractInterface: prizeDistributorAbi.abi,
  //     signerOrProvider: signer.data,
  //     functionName: 'claim'
  //   }
  // )
  const contractConfig = {
    addressOrName: prizeDistributor,
    contractInterface: prizeDistributorAbi.abi,
    signerOrProvider: signer.data,
    functionName: 'claim'
  };
  const { write: claimWrite, reset: claimReset, writeAsync: claimWriteAsync, isSuccess: claimSuccess, status: claimStatus, isLoading: claimLoading, isIdle: claimIdle, data: claimData, error: claimError, isError: isClaimError } = useContractWrite(contractConfig)
  const { isLoading: waitLoading, isSuccess: waitSuccess } = useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess(data) {
      console.log('Success waiting over', data)
    },
  })
  // const claimPrepared =  (a, b, c, d) => {
  //   // console.log(parameters)
  //   console.log(a,b,c,d)

  //   claimWrite({ recklesslySetUnpreparedArgs: [a, b, c]})
  // }

  // console.log("distributor: ", prizeDistributor)
  const claimPrizeFor = useContract({
    addressOrName: prizeDistributor,
    contractInterface: prizeDistributorAbi.abi,
    signerOrProvider: signer.data,
  });

  const claimNow = async (addy, dra, pic) => {
    let gas = 500000 + ((dra.length - 1) * 325000)
    let claimResult = await claimPrizeFor.claim(addy, dra, pic); // , { gasLimit: gas }
    console.log("claim result", claimResult)
    return claimResult;
  }

  const claimPrizes = async () => {
    console.log("claiming")
    // console.log("error before?",claimError)
    // console.log("data",claimData)

    try {
      let claimParams = processClaimParameters(poolerAddress, claimable, chain.name, currentDrawId)

      // old schoool
      // let claimPrizeCall = await claimNow(claimParams.address, claimParams.drawIds, claimParams.winningPicks)
      // console.log("claim prize call", claimPrizeCall)

      // prepare contract would be nice
      // let args = [claimParams.address, claimParams.drawIds, claimParams.winningPicks]
      //  console.log(args)
      claimWrite({ recklesslySetUnpreparedArgs: [claimParams.address, claimParams.drawIds, claimParams.winningPicks] })
      // claimPrepared(claimParams.address, claimParams.drawIds, claimParams.winningPicks, claimParams.gas)

      // claimIt({ args: [claimParams.address, claimParams.drawIds, claimParams.winningPicks], gasLimit:500000 + })
      // console.log("data",claimData)
      console.log(claimError)
    } catch (error) { console.log(error) }
  }

  async function openClaim() {
    setModalFocus("claim")
    setIsModalOpen(true);
  }
  async function openWallet() {
    setModalFocus("wallet")
    setIsModalOpen(true)
  }

  async function openModal() {
    setIsModalOpen(true);
  }
  async function closeModal() {
    claimReset();
    setIsModalOpen(false);
  }

  // if (address && address !== addressValue) { if (!poolerAddress) 
  //   { setPoolerAddress(address); setAddressValue(address); } }

  function Deposits() {

    if (balances[0] !== null) {
      // console.log(balances);
      return (<div>
        {balances.map(
          (object) => (<span>
            {/* <div className="div-relative"> */} {object.polygonTwab + object.ethereumTwab + object.optimismTwab + object.avalancheTwab > 0 && (

              <span>TICKETS &nbsp;&nbsp;&nbsp;&nbsp;</span>)}


            {object.polygon > 0 && (<span>&nbsp;&nbsp;&nbsp;
              <img src="./images/polygontoken.png" className="icon child child1" alt="Polygon" />
              <img src="./images/ptausdc.png" className="icon child child2 token-right" alt="PTaUSDC" />&nbsp;{separator(object.polygon)} &nbsp;&nbsp;&nbsp;</span>)}
            {object.ethereum > 0 && (<span>&nbsp;&nbsp;&nbsp; <img src="./images/ethtoken.png" className="icon child child1" alt="Ethereum" />
              <img src="./images/ptausdc.png" className="icon child child2 token-right" alt="PTaUSDC" />&nbsp;{separator(object.ethereum)}&nbsp;&nbsp;&nbsp;</span>)}
            {object.optimism > 0 && (<span>&nbsp;&nbsp;&nbsp; <img src="./images/optimism.png" className="icon child child1" alt="Optimism" />
              <img src="./images/ptausdc.png" className="icon child child2 token-right" alt="PTaUSDC" />&nbsp;{separator(object.optimism)}&nbsp;&nbsp;&nbsp;</span>)}
            {object.avalanche > 0 && (<span>&nbsp;&nbsp;&nbsp; <img src="./images/avalanche.png" className="icon child child1" alt="Avalanche" />
              <img src="./images/ptausdc.png" className="icon child child2 token-right" alt="PTaUSDC" />&nbsp;{separator(object.avalanche)}&nbsp;&nbsp;&nbsp;</span>)}
            <br></br>{object.polygonTwab + object.ethereumTwab + object.optimismTwab + object.avalancheTwab - object.polygon - object.ethereum - object.optimism - object.avalanche > 0 && (<span>
              BOOSTS &nbsp;&nbsp;&nbsp;&nbsp;
              {object.polygonTwab - object.polygon > 0 && (<span>&nbsp;&nbsp;&nbsp; <img src="./images/polygontoken.png" className="icon child child1" alt="Polygon" />
                <img src="./images/ptausdc.png" className="icon child child2 token-right" alt="PTaUSDC" />&nbsp;+{separator(object.polygonTwab - object.polygon)} &nbsp;&nbsp;&nbsp;</span>)}
              {object.ethereumTwab - object.ethereum > 0 && (<span> &nbsp;&nbsp;&nbsp;<img src="./images/ethtoken.png" className="icon child child1" alt="Ethereum" />
                <img src="./images/ptausdc.png" className="icon child child2 token-right" alt="PTaUSDC" />&nbsp;+{separator(object.ethereumTwab - object.ethereum)}&nbsp;&nbsp;&nbsp;</span>)}
              {object.optimismTwab - object.optimism > 0 && (<span> &nbsp;&nbsp;&nbsp;<img src="./images/optimism.png" className="icon child child1" alt="Optimism" />
                <img src="./images/ptausdc.png" className="icon child child2 token-right" alt="PTaUSDC" />&nbsp;+{separator(object.optimismTwab - object.optimism)}&nbsp;&nbsp;&nbsp;</span>)}
              {object.avalancheTwab - object.avalanche > 0 && (<span> &nbsp;&nbsp;&nbsp;<img src="./images/avalanche.png" className="icon child child1" alt="Avalanche" />
                <img src="./images/ptausdc.png" className="icon child child2 token-right" alt="PTaUSDC" />&nbsp;+{separator(object.avalancheTwab - object.avalanche)}</span>)}
            </span>)}
            {/* </div> */}

          </span>
          )
        )}</div>)

    } else { return null }

  }
  function GetParam() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let poolahhh = params.get('address');
    try {
      if (ethers.utils.getAddress(poolahhh)) {
        setPoolerAddress(poolahhh)
        setAddressValue(poolahhh)
      }
    } catch (error) { console.log("bad address") }
  }

  const depositTo = () => {

  }

  const handleChange = (selectedOption) => {

    setAddressValue(selectedOption.target.value)
    // console.log(selectedOption.target.value)
    try {
      if (ethers.utils.getAddress(selectedOption.target.value)) {
        setPoolerAddress(selectedOption.target.value);

        // console.log(`Address input: `, selectedOption);}
      }
    } catch (error) { setPrizesWon(0); setXp(0); console.log("invalid address ") };
  }
  useEffect(() => {

    if (chain) { setPrizeDistributor(prizeDistributorFromChain[chain.name.toLowerCase()]) }
  }, [chain]);

  useEffect(() => {
    const loadWallet = async () => {
      if (modalFocus === "wallet" && address) {
        console.log("adddresssss:", address)
        console.log("poly prize", polygonPrizePoolAddress)
        let [polygonApproval, ethereumApproval, optimismApproval, avalancheApproval, polygonUsdcBalance, ethereumUsdcBalance, optimismUsdcBalance, avalancheUsdcBalance] = await Promise.all([
          PolygonUsdcContract.allowance(address, polygonPrizePoolAddress),
          EthereumUsdcContract.allowance(address, ethereumPrizePoolAddress),
          OptimismUsdcContract.allowance(address, optimismPrizePoolAddress),
          AvaxUsdcContract.allowance(address, avaxPrizePoolAddress),
          PolygonUsdcContract.balanceOf(address),
          EthereumUsdcContract.balanceOf(address),
          OptimismUsdcContract.balanceOf(address),
          AvaxUsdcContract.balanceOf(address)
        ])
        //.catch(error => { console.log(error) })
        setAllowances({ polygon: polygonApproval, ethereum: ethereumApproval, optimism: optimismApproval, avalanche: avalancheApproval })
        setUsdcBalances({ polygon: polygonUsdcBalance, ethereum: ethereumUsdcBalance, optimism: optimismUsdcBalance, avalancheUsdcBalance })

      }
    }
    loadWallet()
  }, [modalFocus])
  useEffect(() => {
    const loadPage = async () => {
      let recent = await fetch("https://poolexplorer.xyz/recent")
      recent = await recent.json()
      recent = recent.id
      setCurrentDrawId(recent)

      // get URL parameters
      GetParam()
    }
    loadPage()

  }, []);

  useEffect(() => {
    if (balances[0] !== null) {
      let balanceSum = balances[0].polygon + balances[0].ethereum + balances[0].optimism + balances[0].avalanche
      let twabSum = balances[0].polygonTwab + balances[0].avalancheTwab + balances[0].ethereumTwab + balances[0].optimismTwab
      let boostBalanceTotal = twabSum - balanceSum
      // console.log("account ",address)

      setTotalBalance(balanceSum)
      setBoostedBalance(boostBalanceTotal)
    }
  }, [balances]);
  async function getBalancesAndApprovals() {
  }
  async function getPlayer() {

    setPopup(true)

    let setPooler = await getPooler(poolerAddress)
    let poolerClaims = await GetClaimsHistory(poolerAddress)
    // console.log("claims:", poolerClaims)
    const currentTimestamp = parseInt(Date.now() / 1000);

    let poolerBalances = await getBalances(poolerAddress, currentTimestamp)
    setBalances(poolerBalances)
    let xpFilter = setPooler.filter((value, index, self) => {
      return self.findIndex(v => v.draw_id === value.draw_id) === index;
    })
    // setXp(xpFilter.length)

    let winResult = []
    winResult = processWins(setPooler, poolerClaims)
    const winsToFilter = winResult.result
    let claimableToSet = winsToFilter.filter(win => { return win.draw >= (currentDrawId - 30) && win.claimed === false })
    claimableToSet = claimableToSet.filter(win => win.draw !== currentDrawId)
    setClaimable(claimableToSet)
    setWins(winResult.result)
    // setGotSome(true)
    setPrizesWon(winResult.prizes)
    setTotalPrizeValue(winResult.total)
    setPopup(false)
    // console.log("claimable wins", claimable)


  }

  useEffect(() => {
    const goGetPlayer = async () => {
      await getPlayer()
    }
    if (poolerAddress !== "") {
      goGetPlayer();
    }

  }, [poolerAddress, waitSuccess]);

  return (
    <div className="transactions section">
      <div className="card has-table has-mobile-sort-spaced">
        <header className="card-header">

          <p className="card-header-title">

            <input name="addressInput" className="address-input" value={addressValue} onChange={handleChange} />
            &nbsp;&nbsp;{addressValue === "" ? <div><span>Input
              <span className="hidden-mobile"> Pooler's address</span><span className="show-mobile">addy</span></span></div> : ""}{popup && <span>&nbsp;&nbsp;
                <div
                  className="smallLoader"
                  style={{ display: "inline-block" }}
                ></div>&nbsp;&nbsp;</span>
            }
            {prizesWon > 0 && (<div>
              <span className="hidden-mobile">&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="numb-purp">{prizesWon}</span>
                WINS&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="hidden-mobile">&nbsp;&nbsp;<img src='./images/usdc.png' className='token' />&nbsp;
                <span className="numb-purp">{separator(totalPrizeValue)}</span> WON</span>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>)}
            {xp > 0 && (
              <span><span className="numb-purp"> {separator(xp)}</span> <span className="hidden-mobile">DRAWS</span> XP</span>)}



          </p>
        </header>
        {wins.length > 0 &&
          <div className="card-content">
            <div className="table-wrapper has-mobile-cards">
              <table className="padded is-stripped table is-hoverable no-bottom">
                <thead style={{ backgroundColor: "#efefef" }}><th><Deposits /> 
{/*                 
                <div onClick={() => {
                  openWallet();
                }}> wallet</div>
                 */}
                </th></thead>
              </table>
              <table className="padded is-stripped table is-hoverable">
                <thead>


                  {prizesWon === 0 && <tr><th>No wins yet, friend.</th></tr>}
                  {prizesWon > 0 && (<tr>
                    <th>Prize Wins&nbsp;&nbsp;</th>
                    <th>Draw</th>
                    <th style={{ textAlign: "right" }} className="hidden-mobile">Network</th>
                  </tr>)}
                </thead>
                <tbody>
                  {wins.map((item) => (
                    <tr>
                      <td>
                        <div className="addressText">
                          <img src="./images/usdc.png" className="token no-left" />
                          {prizeValue(item.win)}&nbsp;&nbsp;{item.claimed &&
                            // <img
                            //       src="./images/bank.png"
                            //       className="emoji"
                            //       alt="Claimed"
                            //     />
                            <span className="stamp">claimed</span>
                          }

                          {!item.claimed && <span><div
                            className="inlineDiv"
                            onClick={() => {
                              openClaim();
                            }}
                          >{item.draw !== currentDrawId && item.draw >= (currentDrawId - 30) ? <span className="claimStamp blue-hover">Claim</span> : ""}</div></span>}&nbsp;&nbsp;
                          {item.draw <= (currentDrawId - 61) && !item.claimed ? <span className="stamp expired-stamp">expired</span> : ""}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="show-mobile">
                            <img
                              src={"./images/" + item.network.toLowerCase() + ".png"}
                              className="emoji"
                              alt={item.network}
                            />
                            &nbsp;&nbsp;
                          </div>
                          {item.draw}</div></td>

                      <td className="hidden-mobile" style={{ textAlign: "right" }}>
                        {" "}
                        <div className="addressText">


                          {item.network} &nbsp;
                          <img
                            src={"./images/" + item.network.toLowerCase() + ".png"}
                            className="emoji"
                            alt={item.network}
                          />
                        </div>
                      </td>


                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>}
      </div>
      <Modal
        isOpen={isModalOpen}

        style={{
          overlay: {
            position: "fixed",

            margin: "auto",
            top: "10%",
            borderRadius: 10,
            width: 475,
            height: 300,
            backgroundColor: "purple",
            color: "black",
          },
        }}><center>
           <div className="closeModal close" onClick={() => closeModal()}></div><br></br>
          {modalFocus === "claim" && <div>

            {isConnected && <div>  <span className="numb-purp"> {address.slice(0, 5)}</span> claiming for <span className="numb-purp"> {poolerAddress.slice(0, 5)}</span><br></br>
            
              {filterClaimsNetworkAndExpiry(claimable, chain.name, currentDrawId).length === 0 ? <><br></br>Switch networks, no prizes</> : <>
              <img src="../images/trophy.png" className="emoji" />
              {filterClaimsNetworkAndExpiry(claimable, chain.name, currentDrawId).length}</>} to claim on
              
              <img
                src={"./images/" + chain.name.toLowerCase() + ".png"}
                className="emoji"
                alt={chain.name}
              /><br></br></div>}
            {!isConnected && "Please connect wallet to claim"}
            {isConnected && <div>
              <br></br>
              {filterClaimsNetworkAndExpiry(claimable, chain.name, currentDrawId).length === 0 ? "" :
              <button onClick={() => claimPrizes()} className="myButton purple-hover">
                {claimLoading && "CLAIMING..."}
                {claimIdle && "CLAIM"}
                {isClaimError && "CLAIM ERROR, TRY AGAIN"}
                {waitSuccess && "CLAIMED"}
              </button>}

                </div>}
            
            <br></br>
          </div>}

          {modalFocus === "wallet" && <div>
            <div className="closeModal close" onClick={() => closeModal()}></div>


            {isConnected && <> DEPOSIT ON
              <img
                src={"./images/" + chain.name.toLowerCase() + ".png"}
                className="emoji"
                alt={chain.name}
              /> {chain.name}<br></br><br></br>
            </>}
            {!isConnected && "Please connect wallet"}
            {allowances.polygon !== undefined && <div className="amount-container">
              <table><tr><td>
                <img src="./images/usdc.png" className="icon" alt="USDC" /> USDC &nbsp;
                <input type="text" className="amount-input" value={inputAmount} ref={amountInput} onChange={e => setInputAmount(e.target.value)}  ></input>


              </td></tr>
                <tr><td style={{ textAlign: "right" }}>
                  <span className="small-balance">Balance {walletBalance(usdcBalances, chain.name)}
                    {walletBalance(usdcBalances, chain.name) > 0 && "MAX"}</span>
                </td></tr>
              </table></div>}
            {isConnected &&


              <button onClick={() => depositTo()} className="myButton purple-hover">DEPOSIT</button>}
            <br></br>
          </div>}

        </center>
      </Modal>
    </div>

  )
}
export default Poolers;
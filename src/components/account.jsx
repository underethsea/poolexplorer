// react madness Optimism = optimism = oPtimism = 0ptimism = opt1m1sm

import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import Modal from "react-modal";
import "./modal.css";
import {MyConnect} from "./myConnect.jsx"

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

import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

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
const prizePoolFromChain = {
  optimism: "0x79Bc8bD53244bC8a9C8c27509a2d573650A83373",
  polygon: "0x19DE635fb3678D8B8154E37d8C9Cdf182Fe84E60",
  ethereum: "0xd89a09084555a7D0ABe7B111b1f78DFEdDd638Be",
  avalanche: "0xF830F5Cb2422d555EC34178E27094a816c8F95EC"

}

const usdcFromChain = {
  optimism: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
  polygon: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  ethereum: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  avalanche: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
}

const usdcAbi = [
  "function balanceOf(address) public view returns (uint256)",
  "function allowance(address,address) public view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)"
]

const prizePoolAbi = [
  "function depositToAndDelegate(address to, uint256 amount, address delegate) external",
  "function withdrawFrom(address from, uint256 amount) external returns (uint256)"
]

const prizeValue = (amount) => { let value = parseFloat(amount); value = value / 1e14; if(value < 1){return value.toFixed(2)}else{return value.toFixed(0)} }
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
// function processDepositParameters(pooler, amount) {
//   console.log("processing deposit for " + pooler + " amount " + amount)
// }
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
    console.log("balances ",balances)
    let balanceArray = [balances]
    return balanceArray
  } catch (error) { console.log("error fetching balances"); return [null] }
}

let currentTicketContract = "";

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
  try{
  let balance = 0
  if (chain === "Polygon") { balance = balances.polygon }
  if (chain === "Optimism") { balance = balances.optimism }
  if (chain === "Avalanche") { balance = balances.avalanche }
  if (chain === "Ethereum") { balance = balances.ethereum }
  return parseFloat(balance) / 1e6}
  catch(error){console.log(error)}

}
const ticketBalance = (balances, chain) => {
  try{
  let balance = 0
  if (chain === "Polygon") { balance = balances[0].polygon }
  if (chain === "Optimism") { balance = balances[0].optimism }
  if (chain === "Avalanche") { balance = balances[0].avalanche }
  if (chain === "Ethereum") { balance = balances[0].ethereum }
  return balance}
  catch(error){console.log(error)}

}

function Account() {

  const { connector: activeConnector, address, isConnecting, isDisconnected, isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('Connected', { address, connector, isReconnected })
      setPoolerToWallet();
    },
  })
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const signer = useSigner()


  const { data: calcData, isError: calcError, isLoading: calcLoading } = useContractRead({
    distributorParams,
    functionName: 'getDrawCalculator',
    chainId: 10

  })

  const [poolerAddress, setPoolerAddress] = useState("")
  const [addressValue, setAddressValue] = useState("");

  const [wins, setWins] = useState([]);
  const [winsShown, setWinsShown] = useState([])
  const [showMore, setShowMore] = useState(false)
  const [prizesWon, setPrizesWon] = useState(0);
  const [totalPrizeValue, setTotalPrizeValue] = useState(0);
  const [balances, setBalances] = useState([null]);
  const [gotSome, setGotSome] = useState(false);
  // const [totalBalance, setTotalBalance] = useState(0);
  // const [boostBalance, setBoostedBalance] = useState(0);
  const [popup, setPopup] = useState(Boolean);
  const [xp, setXp] = useState(0);
  const [claimable, setClaimable] = useState([])
  const [currentDrawId, setCurrentDrawId] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFocus, setModalFocus] = useState("claim")
  const [allowances, setAllowances] = useState({})
  const [usdcBalances, setUsdcBalances] = useState({})
  const [prizeDistributor, setPrizeDistributor] = useState("0x722e9BFC008358aC2d445a8d892cF7b62B550F3F") // starts with OP distributor for no good reason
  const [inputAmount, setInputAmount] = useState(0)
  const [validAddress, setValidAddress] = useState(true)
  const [prizePoolAddress, setPrizePoolAddress] = useState("0x79Bc8bD53244bC8a9C8c27509a2d573650A83373")
  const [usdcAddress, setUsdcAddress] = useState("0x79Bc8bD53244bC8a9C8c27509a2d573650A83373")
const [updateWallet, setUpdateWallet] = useState(0)
  const [walletMessage, setWalletMessage] = useState("") // lousy bug-fix for setPoolerToWallet not getting poolerAddress useEffect to trigger
  const amountInput = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);
  // const {refresh, setRefresh} = useState(0)

  const { chain, chains } = useNetwork()

  async function openClaim() {
    setModalFocus("claim")
    setIsModalOpen(true);
  }
  async function openWallet() {
    setModalFocus("wallet")
    setIsModalOpen(true)
    setInputAmount(0)
  }
  async function openWalletWithdraw() {
    setModalFocus("withdrawWallet")
    setIsModalOpen(true)
    setInputAmount(0)
  }
  

  async function openModal() {
    setIsModalOpen(true);
  }
  async function closeModal() {
    claimReset();
    setIsModalOpen(false);
  }
  // console.log(prizeDistributor)
  console.log(balances)
  // console.log(address)
  console.log(allowances)
  const contractConfig = {
    addressOrName: prizeDistributor,
    contractInterface: prizeDistributorAbi.abi,
    signerOrProvider: signer.data,
    functionName: 'claim'
  };
  const isInvalidInputAmt = (amt) => {
    const inputAmt = Number(amt);
    return Number.isNaN(inputAmt) || inputAmt <= 0;
  };
  const amountFormatForSend = (amt) => {
    if( parseFloat(amt) > 0){ 
    return ethers.utils.parseUnits(amt.toString(),6).toString()}
    else {return "0"}}

  const { config: withdrawConfig, error: withdrawConfigError, isError: isWithdrawConfigError } = usePrepareContractWrite({
    args: [address,amountFormatForSend(inputAmount)],
    addressOrName: prizePoolAddress,
    contractInterface: prizePoolAbi,
    functionName: 'withdrawFrom',
    overrides: {
      gasLimit: 625000,
    },  })
  const { config: depositConfig, error: depositConfigError, isError: isDepositConfigError } = usePrepareContractWrite({
    args: [address,amountFormatForSend(inputAmount),address],
    addressOrName: prizePoolAddress,
    contractInterface: prizePoolAbi,
    functionName: 'depositToAndDelegate',
    overrides: {
      gasLimit: 625000,
    },
  })
  const { config: usdcConfig, error: usdcConfigError, isError: usdcConfigIsError } = usePrepareContractWrite({
    args:  [prizePoolAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935"],
    addressOrName: usdcAddress,
    contractInterface: usdcAbi,
    functionName: 'approve',
   
  })
 
  const { write: claimWrite, reset: claimReset, writeAsync: claimWriteAsync, isSuccess: claimSuccess, status: claimStatus, isLoading: claimLoading, isIdle: claimIdle, data: claimData, error: claimError, isError: isClaimError } = useContractWrite(contractConfig)
  const { isLoading: waitLoading, isSuccess: waitSuccess } = useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess(data) {
      toast("Claim success!", {
        position: toast.POSITION.BOTTOM_RIGHT})
      console.log('Success waiting over', data)
    },
  })

  const { write: approveWrite, isSuccess: approveSuccess, status: approveStatus, error: approveError, 
    isLoading: approveLoading, data: approveData, isIdle: approveIdle, isError: isApproveError } = useContractWrite(usdcConfig)

  const { write: depositWrite, error: depositError, isError: isDepositError,
    isIdle: depositIdle, data: depositData, isSuccess: depositSuccess, isLoading: depositLoading } = useContractWrite(depositConfig)

  const { write: withdrawWrite, error: withdrawError, isError: isWithdrawError,
    isIdle: withdrawIdle, data: withdrawData, isSuccess: withdrawSuccess, isLoading: withdrawLoading } = useContractWrite(withdrawConfig)

  const { isLoading: approveWaitLoading, isSuccess: approveWaitSuccess } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess(data) {
      toast("Approve success!", {
        position: toast.POSITION.BOTTOM_RIGHT})
      console.log('Approve success waiting over', data)
    },
  })

  const { isLoading: withdrawWaitLoading, isSuccess: withdrawWaitSuccess } = useWaitForTransaction({
    hash: withdrawData?.hash,
    onSuccess(data) {
      toast("Withdraw success!", {
        position: toast.POSITION.BOTTOM_RIGHT})
      closeModal()
      console.log('Withdraw success waiting over', data)
    },
  })

  const { isLoading: depositWaitLoading, isSuccess: depositWaitSuccess } = useWaitForTransaction({
    hash: depositData?.hash,
    onSuccess(data) {
      closeModal()
      toast("Deposit success!", {
        position: toast.POSITION.BOTTOM_RIGHT})
      console.log('Deposit success waiting over', data)
    },
  })

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
      let claimParams = processClaimParameters(address, claimable, chain.name, currentDrawId)
      
      claimWrite({ recklesslySetUnpreparedArgs: [claimParams.address, claimParams.drawIds, claimParams.winningPicks] })
      toast("Claiming!", {
        position: toast.POSITION.BOTTOM_RIGHT})
      console.log(claimError)
    } catch (error) {toast("Claim error"); console.log(error) }
  }

  // if (address && address !== addressValue) { if (!poolerAddress) 
  //   { setPoolerAddress(address); setAddressValue(address); } }

  function Deposits() {

    if (balances[0] !== null) {
      // console.log(balances);
      return (<div>
        {balances.map(
          (object) => (<span>
            {/*isConnected && object.polygon + object.ethereum + object.optimism + object.avalanche == 0 && <span className="right-float">&nbsp;&nbsp;Save to win&nbsp;&nbsp;&nbsp;</span>*/}

            {/* <div className="div-relative"> */}   {isConnected && 
            <span className="right-float">
              <span className="open-wallet" onClick={() => {openWallet();}}> 
              <span className="actionButton">DEPOSIT NOW</span>
              </span>
              <br></br>
              {object.polygon + object.ethereum + object.optimism + object.avalanche > 0 && 
              
              <span className="open-wallet" onClick={() => {openWalletWithdraw();}}> 
              <span className="actionButton margint right-float">WITHDRAW</span></span>}
               
              

              {/* &nbsp;<span className="wallet-message">*beta*</span> */}
              </span>
            
            }             
{object.polygon + object.ethereum + object.optimism + object.avalanche > 0 && (

              <span>TICKETS &nbsp;&nbsp;</span>)}


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
  function isValidAddress(addressToVerify) {
    try {
      if (ethers.utils.isAddress(addressToVerify)) {
        // console.log("valid address: ",addressToVerify)
        setValidAddress(true); return true
      } else { console.log("invalid address: ", addressToVerify);setValidAddress(false); return false }
    } catch (error) { console.log("invalid address catch: ", addressToVerify); setValidAddress(false); return false }
  }
  function GetParam() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let poolahhh = params.get('address');
if(params!==null){
 
    try {
      if (isValidAddress(poolahhh)) {
        setPoolerAddress(poolahhh)
        setAddressValue(poolahhh)
        
      }
    } catch (error) { console.log("bad address") }
  }}

  const approve = () => {
    try {
      approveWrite()
      toast("Approving!", {
        position: toast.POSITION.BOTTOM_RIGHT})
    } catch (error) { setWalletMessage("error"); console.log(error) }
  }
  const depositTo = () => {
    try {
      if (parseFloat(inputAmount) > walletBalance(usdcBalances, chain.name)) { setWalletMessage("insufficient balance") }
      else if(parseFloat(inputAmount) < 2) {setWalletMessage("2 usdc minimum")}
      else if (parseFloat(inputAmount) <= 0 || Number(inputAmount) != inputAmount) {
        setWalletMessage("amount invalid")
      }
      else {
        // let depositParams = processDepositParameters(address, inputAmount)
        // const depositAmount = ethers.utils.parseUnits(inputAmount.toString(), 6).toString()
        //{ recklesslySetUnpreparedArgs: [address, depositAmount, address] }
        depositWrite()
        toast("Depositing!", {
          position: toast.POSITION.BOTTOM_RIGHT})


        console.log(depositError)
      }
    } catch (error) { setWalletMessage("error"); console.log(error) }
  }

  const withdrawFrom = () => {
    try {
      let withdrawBalance = 0
      console.log("withdraw balance",balances[0][chain.name.toLowerCase()])
      if(balances[0][chain.name.toLowerCase()] === undefined){}else{withdrawBalance = parseFloat(balances[0][chain.name.toLowerCase()])
    console.log("set to ",withdrawBalance)}
      if (parseFloat(inputAmount) > withdrawBalance) { setWalletMessage("insufficient balance") }
      else if (parseFloat(inputAmount) <= 0 || Number(inputAmount) != inputAmount) {
        setWalletMessage("amount invalid")
      }
      else {
        // let depositParams = processDepositParameters(address, inputAmount)
        withdrawWrite()

        console.log(withdrawError)
      }
    } catch (error) { setWalletMessage("error"); console.log(error) }

  }


const handleChange = (selectedOption) => {
  setAddressValue(selectedOption.target.value)
  // console.log(selectedOption.target.value)
  try {
    if (isValidAddress(selectedOption.target.value)) {
      setPoolerAddress(selectedOption.target.value);

      // console.log(`Address input: `, selectedOption);}
    }
    else { setPrizesWon(0); setBalances([]) }

  } catch (error) { setPrizesWon(0); setBalances([]); console.log("invalid address ") };
}

useEffect(() => {
  if (chain && chain.unsupported !== true) {
    setPrizePoolAddress(prizePoolFromChain[chain.name.toLowerCase()]);
    setPrizeDistributor(prizeDistributorFromChain[chain.name.toLowerCase()])
    setUsdcAddress(usdcFromChain[chain.name.toLowerCase()])
  }
}, [chain]);

useEffect(() => {
  const loadWallet = async () => {
    if (modalFocus === "wallet" && address) {
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
      setAllowances({
        polygon: polygonApproval,
        ethereum: ethereumApproval,
        optimism: optimismApproval,
        avalanche: avalancheApproval
      })
      setUsdcBalances({ polygon: polygonUsdcBalance, ethereum: ethereumUsdcBalance, optimism: optimismUsdcBalance, avalancheUsdcBalance })

    }
  }
  loadWallet()
}, [modalFocus, approveWaitSuccess, depositWaitSuccess, withdrawWaitSuccess])

useEffect(() => {
  const loadPage = async () => {
    
    let recent = await fetch("https://poolexplorer.xyz/recent")
    recent = await recent.json()
    recent = recent.id
    setCurrentDrawId(recent)

    // get URL parameters
    setAddressValue(address);setPoolerAddress(address)
    // if(isConnected && addressValue.toLowerCase() !== address.toLowerCase()) {setPrizesWon(0); setBalances([]);setPoolerAddress(address);setAddressValue(address)}
  }
  console.log("wallet",address)
  loadPage()

}, []);

// useEffect(() => {
//   if (balances[0] !== null) {
//     let balanceSum = balances[0].polygon + balances[0].ethereum + balances[0].optimism + balances[0].avalanche
//     let twabSum = balances[0].polygonTwab + balances[0].avalancheTwab + balances[0].ethereumTwab + balances[0].optimismTwab
//     let boostBalanceTotal = twabSum - balanceSum
//     // console.log("account ",address)

//     setTotalBalance(balanceSum)
//     setBoostedBalance(boostBalanceTotal)
//   }
// }, [balances]);
async function getBalancesAndApprovals() {
}
async function getPlayer(fullList) {

  setPopup(true)
  setBalances([])
  setWins([])
  setWinsShown([])
  const currentTimestamp = parseInt(Date.now() / 1000);
console.log("getting player ",address)
  let poolerBalances = await getBalances(address, currentTimestamp)
  setBalances(poolerBalances)

  let setPooler = await getPooler(address)

  let poolerClaims = await GetClaimsHistory(address)
  // console.log("claims:", poolerClaims)

  // removed XP for speed

  // let xpFilter = setPooler.filter((value, index, self) => {
  //   return self.findIndex(v => v.draw_id === value.draw_id) === index;
  // })
  // console.log("xp: ",xpFilter.length)
  // setXp(xpFilter.length)

  let winResult = []
  winResult = processWins(setPooler, poolerClaims)
  const winsToFilter = winResult.result
  let claimableToSet = winsToFilter.filter(win => { return win.draw >= (currentDrawId - 30) && win.claimed === false })
  claimableToSet = claimableToSet.filter(win => win.draw !== currentDrawId)
  setClaimable(claimableToSet)
  if(fullList) {
    setWinsShown(winResult.result);setShowMore(false)
  } else {  setShowMore(true);setWinsShown(winResult.result.slice(0,5))
  }
  // setGotSome(true)
  setPrizesWon(winResult.prizes)
  setTotalPrizeValue(winResult.total)
  setPopup(false)
  // console.log("claimable wins", claimable)

}

// useEffect(() => {

// // if(isConnected && poolerAddress === "") {setPrizesWon(0); setBalances([]);setPoolerAddress(address);setAddressValue(address)}

// },[isConnected])

const setPoolerToWallet = () => {
  console.log("setting poooler to wallet")
  try {
    setAddressValue(address)

    if (isValidAddress(address)) {
      setPoolerAddress(address);
      setUpdateWallet(updateWallet + 1)

      console.log("set to wallet ",address)
      // console.log(`Address input: `, selectedOption);}
    }
}catch(error){console.log(error)}}

useEffect(() => {
  const goGetPlayer = async () => {
    await getPlayer()
  }
  console.log("triggered poolerAddress change")
  if (isValidAddress(address)) {
    console.log("getting pooler")
    goGetPlayer();
  }

}, [address,isConnected,updateWallet,poolerAddress, waitSuccess, approveWaitSuccess, depositWaitSuccess, withdrawWaitSuccess]);

return (
    <div>
{/*   <div className="transactions section"> */}
    <div >
   
{/* 
          <input name="addressInput" className="address-input" value={addressValue} onChange={handleChange} /> */}
          {/* {address !== undefined && addressValue == "" && 
          <span className="yosoy" onClick={() => {setPoolerToWallet()}}>
            <img src="./images/wallet.svg" className='yo-soy'></img>&nbsp;
            </span>}
            {addressValue!==address && addressValue !== "" && address !== undefined && 
          <span className="yosoy" onClick={() => {setPoolerToWallet()}}>
            <img src="./images/wallet.svg" className='yo-soy'></img>&nbsp;
            </span>} */}
          {/* {!validAddress && addressValue !== "" && <span className="top-bar-span">&nbsp;Invalid address</span>} */}
         
          {/* {prizesWon > 0 && !popup && (<div>
            <span className="hidden-mobile">&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="numb-purp">{prizesWon}</span>
              WINS&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span className="hidden-mobile">&nbsp;&nbsp;<img src='./images/usdc.png' className='token' />&nbsp;
              <span className="numb-purp">{separator(totalPrizeValue)}</span> WON</span>&nbsp;&nbsp;&nbsp;&nbsp;


          </div>)} */}
          {/* {prizesWon === 0 && !popup && addressValue !== "" && validAddress && <span className="top-bar-span">&nbsp;
    No wins yet, friend.</span>} */}
          {xp > 0 ? (
            <span><span className="numb-purp"> {separator(xp)}</span> <span className="hidden-mobile">DRAWS</span> XP</span>) :
            ""}
        
      
      {
        /* wins.length > 0 && */
        
        <div className="card-content">
            <center>
                {isConnected &&
          <div className="table-wrapper has-mobile-cards tablemax connecttable">
            <center>
            <table className="padded is-stripped table is-hoverable no-bottom connectbg">
              <thead className="connectbg"><th>
              {popup && <span>&nbsp;&nbsp;
          <div
            className="smallLoader"
            style={{ display: "inline-block" }}
          ></div>
          
          
          &nbsp;&nbsp;</span>
    }
              {/* {!isConnected && <span className="right-float">Want to pool and win? <MyConnect /></span>} */}
                <Deposits />

              </th></thead>
            </table>
            <table className="padded is-stripped table is-hoverable">
              <thead>
                {/* https://i.ibb.co/0Jgj6DL/pooly44.png */}
              {/* {addressValue === "" ? <tr><td className="tdcenter"><img src="./images/yolo_nolo.png" className="cool-pooly" /></td></tr> : ""}  */}

{/* {prizesWon === 0 && !popup && addressValue !== "" && <tr><td className="tdcenter">
    No wins yet, friend.<br/> 
    <img src="./images/yolo_nolo.png" className="cool-pooly" />
    </td></tr>} */}
    

               
                {prizesWon > 0 & isConnected ? (<tr>
                  <th>Prize Wins&nbsp;&nbsp;{prizesWon > 0 && <span>({prizesWon})</span>}</th>
                  <th>Draw</th>
                  <th style={{ textAlign: "right" }} className="hidden-mobile">Network</th>
                </tr>):""}
              </thead>
              <tbody>
                {prizesWon > 0 & isConnected ?
                  winsShown.map((item) => (
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


                    </tr>)):"" }
                    
                    {showMore & isConnected & prizesWon > 5 ? <tr><td>              <span className="open-wallet" onClick={() => {getPlayer(true)}}> 
See more ---&gt;</span></td></tr> : ""}
              </tbody>
            </table></center>
          </div>  } </center>
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
          width: 400,
          height: 300,
          backgroundColor: "#477bb1",
          color: "black",
        },
        content: { inset: "34px" }
      }}><center>
        <div className="closeModal close" onClick={() => closeModal()}></div>
        {modalFocus === "claim" && <div>

          {isConnected && <div>   Claiming prizes for <span className="numb-purp"> {address.slice(0, 5)}</span><br></br>

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
          {!isConnected && "Please connect wallet"}

          {isConnected && <> DEPOSIT on
            <img
              src={"./images/" + chain.name.toLowerCase() + ".png"}
              className="emoji"
              alt={chain.name}
            /> {chain.name}<br></br><br></br>

            {allowances.polygon !== undefined && <div className="amount-container">
              <table  className="not-pad"><tr><td>
                <img src="./images/usdc.png" className="icon" alt="USDC" /> USDC &nbsp;</td>
                <td style={{ textAlign: "right" }}>

                  <span className="wallet-message">
                    {walletMessage !== "" && walletMessage}
                  </span></td>

              </tr>
                <tr><td colSpan={2}>
                  <input type="text" className="amount-input" value={inputAmount} ref={amountInput} onChange={e => { setWalletMessage(""); setInputAmount(e.target.value) }}  ></input>


                </td></tr>

                <tr>
                  <td colSpan={2} style={{ textAlign: "right" }}>

                    <span className="small-balance">Balance {walletBalance(usdcBalances, chain.name)}
                      {walletBalance(usdcBalances, chain.name) > 0 && <span className="max-balance" onClick={e => setInputAmount(walletBalance(usdcBalances, chain.name))} >&nbsp;MAX</span>}</span>
                  </td></tr>

              </table></div>}


            {parseFloat(allowances[chain.name.toLowerCase()]) / 1e6 >= parseFloat(inputAmount) && parseFloat(allowances[chain.name.toLowerCase()]) !== 0 ?
              <button onClick={() => depositTo()} className="myButton purple-hover">
                {/* {depositLoading && "DEPOSITING..."}
                  {depositIdle && "DEPOSIT"}
                  {isDepositError && "DEPOSIT ERROR, TRY AGAIN"}
                  {depositWaitSuccess && "DEPOSIT SUCCESSFUL"} */}
                DEPOSIT
              </button>
              : <button onClick={() => approve()} className="myButton purple-hover">
                {/* {approveLoading && "APPROVING..."}
                  {approveIdle && "APPROVE"}
                  {isApproveError && "APPROVE ERROR, TRY AGAIN"}
                  {approveSuccess && "APPROVE SUCCESSFUL"} */}
                APPROVE
              </button>
            }

          </>}
          <br></br>
        </div>}

        {modalFocus === "withdrawWallet" && <div>
          <div className="closeModal close" onClick={() => closeModal()}></div>
          {!isConnected && "Please connect wallet"}

          {isConnected && <> WITHDRAW on
            <img
              src={"./images/" + chain.name.toLowerCase() + ".png"}
              className="emoji"
              alt={chain.name}
            /> {chain.name}<br></br><br></br>

            {/* {balances.polygon !== undefined &&  */}
            <div className="amount-container">
              <table  className="not-pad"><tr><td>
                <img src="./images/ptausdc.png" className="icon" alt="USDC" /> PTaUSDC &nbsp;</td>
                <td style={{ textAlign: "right" }}>

                  <span className="wallet-message">
                    {walletMessage !== "" && walletMessage}
                  </span></td>

              </tr>
                <tr><td colSpan={2}>
                  <input type="text" className="amount-input" value={inputAmount} ref={amountInput} onChange={e => { setWalletMessage(""); setInputAmount(e.target.value) }}  ></input>

                </td></tr>
                <tr>
                  <td  colSpan={2} style={{ textAlign: "right" }}>

                    <span className="small-balance">Balance {ticketBalance(balances,chain.name)}
                      {ticketBalance(balances,chain.name) > 0 && <span className="max-balance" onClick={e => setInputAmount(ticketBalance(balances,chain.name))} >&nbsp;MAX</span>}</span>
                  </td></tr>

              </table></div>
              {/* } */}

            <button onClick={() => withdrawFrom()} className="myButton purple-hover">

              WITHDRAW
            </button>

          </>}
          <br></br>
        </div>}

      </center>
    </Modal>
    <ToastContainer />

  </div>

)
}
export default Account;
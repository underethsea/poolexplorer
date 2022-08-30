
import { ethers } from "ethers";

const ticketAbi = [
    "function balanceOf(address) public view returns (uint256)",
    "function getAverageBalanceBetween(address,uint64,uint64) external view returns (uint256)",
    "function getBalanceAt(address user, uint64 timestamp) external view returns (uint256)"
  ];
  
  const explorerURL = "https://poolexplorer.xyz"
  
  const polygonTicketAddress = "0x6a304dFdb9f808741244b6bfEe65ca7B3b3A6076";
  const avaxTicketAddress = "0xB27f379C050f6eD0973A01667458af6eCeBc1d90";
  const ethereumTicketAddress = "0xdd4d117723C257CEe402285D3aCF218E9A8236E1";
  const optimismTicketAddress = "0x62BB4fc73094c83B5e952C2180B23fA7054954c4"
  
  const optimismEndpointURL = "https://opt-mainnet.g.alchemy.com/v2/" + process.env.REACT_APP_ALCHEMY_KEY
  const ethereumEndpointURL =
    "https://mainnet.infura.io/v3/" + process.env.REACT_APP_INFURA_KEY;
  const endpointURL =
    "https://polygon-mainnet.g.alchemy.com/v2/" + process.env.REACT_APP_ALCHEMY_KEY
  const avaxEndpointURL = "https://api.avax.network/ext/bc/C/rpc";
  
  const customHttpProvider = new ethers.providers.JsonRpcProvider(endpointURL);
  const avaxHttpProvider = new ethers.providers.JsonRpcProvider(avaxEndpointURL);
  const ethereumHttpProvider = new ethers.providers.JsonRpcProvider(ethereumEndpointURL);
  const optimismHttpProvider = new ethers.providers.JsonRpcProvider(optimismEndpointURL);
  
  export const PolygonTicketContract = new ethers.Contract(
    polygonTicketAddress,
    ticketAbi,
    customHttpProvider
  );
  export const AvaxTicketContract = new ethers.Contract(
    avaxTicketAddress,
    ticketAbi,
    avaxHttpProvider
  );
  export const EthereumTicketContract = new ethers.Contract(
    ethereumTicketAddress,
    ticketAbi,
    ethereumHttpProvider
  );
  export const OptimismTicketContract = new ethers.Contract(
    optimismTicketAddress,
    ticketAbi,
    optimismHttpProvider
  );


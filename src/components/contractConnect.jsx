
import { ethers } from "ethers";
import {PROVIDERS} from "./providers.jsx"
import { ABI } from "./abi.jsx"
import {ADDRESS} from "./address.jsx"

const ticketAbi = [
    "function balanceOf(address) public view returns (uint256)",
    "function getAverageBalanceBetween(address,uint64,uint64) external view returns (uint256)",
    "function getBalanceAt(address user, uint64 timestamp) external view returns (uint256)"
  ];
  
  const usdcAbi = [
    "function balanceOf(address) public view returns (uint256)",
    "function allowance(address,address) public view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)"
  ]

  const prizePoolAbi = [
    "function depositToAndDelegate(address to, uint256 amount, address delegate) external",
    "function withdrawFrom(address from, uint256 amount) external returns (uint256)"
  ]
  // const explorerURL = "https://poolexplorer.xyz"
  
  const polygonTicketAddress = "0x6a304dFdb9f808741244b6bfEe65ca7B3b3A6076";
  const avaxTicketAddress = "0xB27f379C050f6eD0973A01667458af6eCeBc1d90";
  const ethereumTicketAddress = "0xdd4d117723C257CEe402285D3aCF218E9A8236E1";
  const optimismTicketAddress = "0x62BB4fc73094c83B5e952C2180B23fA7054954c4";

  const polygonPrizePoolAddress = "0x19DE635fb3678D8B8154E37d8C9Cdf182Fe84E60"
  const avaxPrizePoolAddress = "0xF830F5Cb2422d555EC34178E27094a816c8F95EC"
  const ethereumPrizePoolAddress = "0xd89a09084555a7D0ABe7B111b1f78DFEdDd638Be"
  const optimismPrizePoolAddress = "0x79Bc8bD53244bC8a9C8c27509a2d573650A83373"

  export {polygonPrizePoolAddress,avaxPrizePoolAddress,ethereumPrizePoolAddress,optimismPrizePoolAddress}

  const polygonUsdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
  const avaxUsdcAddress = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
  const ethereumUsdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  const optimismUsdcAddress = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"
  
  
  export const PolygonTicketContract = new ethers.Contract(
    polygonTicketAddress,
    ticketAbi,
    PROVIDERS.POLYGON
  );
  export const AvaxTicketContract = new ethers.Contract(
    avaxTicketAddress,
    ticketAbi,
    PROVIDERS.AVALANCHE
  );
  export const EthereumTicketContract = new ethers.Contract(
    ethereumTicketAddress,
    ticketAbi,
    PROVIDERS.ETHEREUM
  );
  export const OptimismTicketContract = new ethers.Contract(
    optimismTicketAddress,
    ticketAbi,
    PROVIDERS.OPTIMISM
  );
  export const PolygonUsdcContract = new ethers.Contract(
    polygonUsdcAddress,
    usdcAbi,
    PROVIDERS.POLYGON
  );
  export const AvaxUsdcContract =  new ethers.Contract(
    avaxUsdcAddress,
    usdcAbi,
    PROVIDERS.AVALANCHE
  );
  export const OptimismUsdcContract = new ethers.Contract(
    optimismUsdcAddress,
    usdcAbi,
    PROVIDERS.OPTIMISM
  );
  export const EthereumUsdcContract =  new ethers.Contract(
    ethereumUsdcAddress,
    usdcAbi,
    PROVIDERS.ETHEREUM
  );

  export const PolygonPrizePoolContract = new ethers.Contract(
    polygonPrizePoolAddress,
    prizePoolAbi,
    PROVIDERS.POLYGON
  );

  export const EthereumPrizePoolContract = new ethers.Contract(
    ethereumPrizePoolAddress,
    prizePoolAbi,
    PROVIDERS.ETHEREUM
  );
  export const OptimismPrizePoolContract = new ethers.Contract(
    optimismPrizePoolAddress,
    prizePoolAbi,
    PROVIDERS.OPTIMISM
  );
  export const AvalanchePrizePoolContract = new ethers.Contract(
    avaxPrizePoolAddress,
    prizePoolAbi,
    PROVIDERS.AVALANCHE
  );




export const CONTRACTS = {
    TICKET: {
        POLYGON: new ethers.Contract(
            ADDRESS.POLYGON.TICKET,
            ABI.TICKET,
            PROVIDERS.POLYGON), AVALANCHE: new ethers.Contract(
                ADDRESS.AVALANCHE.TICKET,
                ABI.TICKET,
                PROVIDERS.AVALANCHE
            ),
        ETHEREUM: new ethers.Contract(
            ADDRESS.ETHEREUM.TICKET,
            ABI.TICKET,
            PROVIDERS.ETHEREUM
        ),
OPTIMISM: new ethers.Contract(
	ADDRESS.OPTIMISM.TICKET,
	ABI.TICKET,
	PROVIDERS.OPTIMISM),
    }, AAVE: {
        POLYGON: new ethers.Contract(
            ADDRESS.POLYGON.AAVETOKEN,
            ABI.AAVE,
            PROVIDERS.POLYGON
        ), AVALANCHE: new ethers.Contract(
            ADDRESS.AVALANCHE.AAVETOKEN,
            ABI.AAVE,
            PROVIDERS.AVALANCHE
        ), ETHEREUM: new ethers.Contract(
            ADDRESS.ETHEREUM.AAVETOKEN,
            ABI.AAVE,
            PROVIDERS.ETHEREUM
        ), OPTIMISM: new ethers.Contract(
            ADDRESS.OPTIMISM.AAVETOKEN,
            ABI.AAVE,
            PROVIDERS.OPTIMISM)
    }, AAVEINCENTIVES: {
        POLYGON:
            new ethers.Contract(
                ADDRESS.POLYGON.AAVEINCENTIVES,
                ABI.AAVEINCENTIVES,
                PROVIDERS.POLYGON
            ), ETHEREUM: new ethers.Contract(
                ADDRESS.ETHEREUM.AAVEINCENTIVES,
                ABI.AAVEINCENTIVES,
                PROVIDERS.ETHEREUM
            ), AVALANCHE: new ethers.Contract(
                ADDRESS.AVALANCHE.AAVEINCENTIVES,
                ABI.AAVEINCENTIVES,
                PROVIDERS.AVALANCHE
            ),OPTIMISM: new ethers.Contract(
                ADDRESS.OPTIMISM.AAVEINCENTIVES,
                ABI.AAVEINCENTIVESV3,
                PROVIDERS.OPTIMISM)
    }, PRIZETIER: {
        ETHEREUM: new ethers.Contract(
            ADDRESS.ETHEREUM.PRIZETIER,
            ABI.PRIZETIER,
            PROVIDERS.ETHEREUM
        ),
        AVALANCHE: new ethers.Contract(
            ADDRESS.AVALANCHE.PRIZETIER,
            ABI.PRIZETIER,
            PROVIDERS.AVALANCHE
        ),
        OPTIMISM: new ethers.Contract(
            ADDRESS.OPTIMISM.PRIZETIER,
            ABI.PRIZETIER,
            PROVIDERS.OPTIMISM
        ), POLYGON: new ethers.Contract(
            ADDRESS.POLYGON.PRIZETIER,
            ABI.PRIZETIER,
            PROVIDERS.POLYGON
        )
    }, AAVEDATA: {
OPTIMISM: new ethers.Contract(
            ADDRESS.OPTIMISM.AAVEDATA,
            ABI.AAVEDATA,
            PROVIDERS.OPTIMISM),
ETHEREUM: new ethers.Contract(
            ADDRESS.ETHEREUM.AAVEDATA,
            ABI.AAVEDATAV2,
            PROVIDERS.ETHEREUM),
POLYGON: new ethers.Contract(
            ADDRESS.POLYGON.AAVEDATA,
            ABI.AAVEDATAV2,
            PROVIDERS.POLYGON),
AVALANCHE: new ethers.Contract(
            ADDRESS.AVALANCHE.AAVEDATA,
            ABI.AAVEDATAV2,
            PROVIDERS.AVALANCHE)



}

}


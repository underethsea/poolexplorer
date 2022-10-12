
import { ethers } from "ethers";
import * as dotenv from 'dotenv' 
dotenv.config()

  const optimismEndpoint = "https://opt-mainnet.g.alchemy.com/v2/" + process.env.REACT_APP_ALCHEMY_KEY
  const ethereumEndpoint = "https://mainnet.infura.io/v3/" + process.env.REACT_APP_INFURA_KEY;
  const polygonEndpoint = "https://polygon-mainnet.g.alchemy.com/v2/" + process.env.REACT_APP_ALCHEMY_KEY
  const avalancheEndpoint = "https://api.avax.network/ext/bc/C/rpc";

  
   
export const PROVIDERS = {
    POLYGON: new ethers.providers.JsonRpcProvider(polygonEndpoint),
    AVALANCHE: new ethers.providers.JsonRpcProvider(avalancheEndpoint),
    ETHEREUM: new ethers.providers.JsonRpcProvider(ethereumEndpoint),
    OPTIMISM: new ethers.providers.JsonRpcProvider(optimismEndpoint)
  }
  
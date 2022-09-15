
import { ethers } from "ethers";

  // const optimismEndpoint = "https://opt-mainnet.g.alchemy.com/v2/" + process.env.REACT_APP_ALCHEMY_KEY
  //  const ethereumEndpoint = "https://mainnet.infura.io/v3/" + process.env.REACT_APP_INFURA_KEY;
  // const polygonEndpoint = "https://polygon-mainnet.g.alchemy.com/v2/" + process.env.REACT_APP_ALCHEMY_KEY
  // const avalancheEndpoint = "https://api.avax.network/ext/bc/C/rpc";

      // const optimismEndpointURL = "https://opt-mainnet.g.alchemy.com/v2/" + process.env.REACT_APP_ALCHEMY_KEY
      const optimismEndpoint = "https://opt-mainnet.g.alchemy.com/v2/" + "Km46Q-DZ04ftPfKNgPwaP6cp957PJHNl"
      //  const ethereumEndpointURL = "https://mainnet.infura.io/v3/" + process.env.REACT_APP_INFURA_KEY;
      const ethereumEndpoint = "https://mainnet.infura.io/v3/" + "657600e9d48d467aaa0cbee1bb5ce0d9"
      // const endpointURL = "https://polygon-mainnet.g.alchemy.com/v2/" + process.env.REACT_APP_ALCHEMY_KEY
      const polygonEndpoint = "https://polygon-mainnet.g.alchemy.com/v2/" +  "Km46Q-DZ04ftPfKNgPwaP6cp957PJHNl"
      const avalancheEndpoint = "https://api.avax.network/ext/bc/C/rpc";
   
export const PROVIDERS = {
    POLYGON: new ethers.providers.JsonRpcProvider(polygonEndpoint),
    AVALANCHE: new ethers.providers.JsonRpcProvider(avalancheEndpoint),
    ETHEREUM: new ethers.providers.JsonRpcProvider(ethereumEndpoint),
    OPTIMISM: new ethers.providers.JsonRpcProvider(optimismEndpoint)
  }
  

import { ADDRESS } from "./address.jsx" 
// const emoji = require("./emoji.js")
// const { Commas } = require("./commas.js")
import { CONTRACTS }from "./contractConnect.jsx"

const Usdc = (amount) => {return amount / 1e6}

export const Tvl = async () => {
    let [polygonAaveBalance, avalancheAaveBalance, ethereumAaveBalance, optimismAaveBalance] =
      await Promise.all([
        CONTRACTS.AAVE.POLYGON.balanceOf(ADDRESS.POLYGON.YIELDSOURCE),
        CONTRACTS.AAVE.AVALANCHE.balanceOf(ADDRESS.AVALANCHE.YIELDSOURCE),
        CONTRACTS.AAVE.ETHEREUM.balanceOf(ADDRESS.ETHEREUM.YIELDSOURCE),
	CONTRACTS.AAVE.OPTIMISM.balanceOf(ADDRESS.OPTIMISM.YIELDSOURCE),
      ]);
    polygonAaveBalance = Usdc(polygonAaveBalance);
    avalancheAaveBalance = Usdc(avalancheAaveBalance);
    ethereumAaveBalance = Usdc(ethereumAaveBalance);
    optimismAaveBalance = Usdc(optimismAaveBalance);
    let total = polygonAaveBalance + avalancheAaveBalance + ethereumAaveBalance + optimismAaveBalance;
    let tvlReturn = {
        TOTAL: polygonAaveBalance + optimismAaveBalance + ethereumAaveBalance + avalancheAaveBalance,
        POLYGON: polygonAaveBalance,
        OPTIMISM: optimismAaveBalance,
        ETHEREUM: ethereumAaveBalance,
        AVALANCHE: avalancheAaveBalance,
        
    }
    
    return tvlReturn;
  }

import ethers from "ethers"
import { ADDRESS } from "./address.jsx";
import { CONTRACTS } from "./contractConnect.jsx";
// import { TvlActive } from "./tvlActive.jsx";
const opPerDay = 13805
const Usdc = (amount) =>{ return amount / 1e6;}
let geckoPrice =
      "https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=usd";


const Tvl = async () => {
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
  export const Generator = async () =>{
  let TVL = await Tvl();
  // console.log(CONTRACTS.AAVEDATA.OPTIMISM ,"contract")
  // console.log(ADDRESS.OPTIMISM.USDC,"address")
  let [
    optimismLendingRate,
    polygonLendingRate,
    ethereumLendingRate,
    avalancheLendingRate,
    opPrice
  ] = await Promise.all([
    CONTRACTS.AAVEDATA.OPTIMISM.getReserveData(ADDRESS.OPTIMISM.USDC),
    CONTRACTS.AAVEDATA.POLYGON.getReserveData(ADDRESS.POLYGON.USDC),
    CONTRACTS.AAVEDATA.ETHEREUM.getReserveData(ADDRESS.ETHEREUM.USDC),
    CONTRACTS.AAVEDATA.AVALANCHE.getReserveData(ADDRESS.AVALANCHE.USDC),
   fetch(geckoPrice)  
]);
opPrice = await opPrice.json()
opPrice = parseFloat(opPrice["optimism"].usd)
  // let polygonLendingRate = await CONTRACTS.AAVEDATA.POLYGON.getReserveData(ADDRESS.POLYGON.USDC)
  // console.log(polygonLendingRate, "poly");
  // console.log("op lending rate",optimismLendingRate.totalAToken.toString())
let opATokens = parseInt(optimismLendingRate.totalAToken.toString()) / 1e6  
// console.log( opPerDay," ",opPrice," ",opATokens)
let opYieldPerDay = ((opPerDay * opPrice) / opATokens) * 100
// console.log(opYieldPerDay,"% op per day") 
let optimismRate = optimismLendingRate[5] / 1e25;
  // console.log(optimismRate, " op rate ", TVL.OPTIMISM, " op tvl");

  let polygonRate = polygonLendingRate[3] / 1e25;
  // console.log(polygonRate, "polyrate");
  let avalancheRate = avalancheLendingRate[3] / 1e25;
  // console.log(avalancheRate, "avax rate ", TVL.AVALANCHE, "tvl");

 //  let polygonRateApi = await getAaveAPI();
  // polygonRateApi = parseFloat(polygonRateApi.liquidityRate) * 100;
  // console.log(polygonRateApi, " poly rate api");

  let ethereumRate = ethereumLendingRate[3] / 1e25;
  // console.log(ethereumRate, "eth rate ", TVL.ETHEREUM, "tvl");
  let optimismDailyYield =
    ((optimismRate / 100) * parseInt(TVL.OPTIMISM)) / 365;
  let ethereumDailyYield =
    ((ethereumRate / 100) * parseInt(TVL.ETHEREUM)) / 365;
  let polygonDailyYield = ((polygonRate / 100) * parseInt(TVL.POLYGON)) / 365;
  let avalancheDailyYield =
    ((avalancheRate / 100) * parseInt(TVL.AVALANCHE)) / 365;
 let opRewardsDailyYield = TVL.OPTIMISM * opYieldPerDay / 100
  polygonDailyYield = ((polygonRate / 100) * parseInt(TVL.POLYGON)) / 365;
  console.log("op day yield: ", optimismDailyYield);
  console.log("eth day yield: ", ethereumDailyYield);
  console.log("poly day yield: ", polygonDailyYield);

  let rates = {
    TOTAL:
      optimismDailyYield +
      ethereumDailyYield +
      polygonDailyYield +
      avalancheDailyYield,
      
    TOTALTVL: TVL.OPTIMISM + TVL.ETHEREUM + TVL.POLYGON + TVL.AVALANCHE,
    AVERAGEAPR:
      (optimismRate + ethereumRate + polygonRate + avalancheRate) / 4,
    OPTIMISM: {
      apr: optimismRate.toFixed(2),
      dayYield: optimismDailyYield,
      tvl: TVL.OPTIMISM,
      rewardsPerDay: TVL.OPTIMISM / opATokens * opPerDay, 
      rewardsValuePerDay: opRewardsDailyYield,
      rewardsApr: opYieldPerDay * 365,
    },
    ETHEREUM: {
      apr: ethereumRate.toFixed(2),
      dayYield: ethereumDailyYield,
      tvl: TVL.ETHEREUM,
    },
    POLYGON: {
      apr: polygonRate.toFixed(2),
      dayYield: polygonDailyYield,
      tvl: TVL.POLYGON,
    },
    AVALANCHE: {
      apr: avalancheRate.toFixed(2),
      dayYield: avalancheDailyYield,
      tvl: TVL.AVALANCHE,
    },
  };
  return rates;
}

async function getAaveAPI() {
try{  
// aave v2 poly
  let apiData = await fetch(
    "https://aave-api-v2.aave.com/data/liquidity/v2?poolId=0xd05e3E715d945B59290df0ae8eF85c1BdB684744"
  );
  apiData = await apiData.json();
  let usdc = apiData.find((element) => element.symbol === "USDC");
  return usdc;
}catch(error){console.log(error)}}

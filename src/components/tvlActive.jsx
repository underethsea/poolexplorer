import { CONTRACTS } from "./contractConnect.jsx"
const Usdc = (amount) => {return amount / 1e6}
export const TvlActive = async () => {
    let timeNow = parseInt(Date.now() / 1000);
    let [polygonGetTotalSupply, avalancheGetTotalSupply, ethereumGetTotalSupply, optimismGetTotalSupply] =
        await Promise.all([
            CONTRACTS.TICKET.POLYGON.getTotalSupplyAt(timeNow),
            CONTRACTS.TICKET.AVALANCHE.getTotalSupplyAt(timeNow),
            CONTRACTS.TICKET.ETHEREUM.getTotalSupplyAt(timeNow),
            CONTRACTS.TICKET.OPTIMISM.getTotalSupplyAt(timeNow)
        ]);
    console.log(polygonGetTotalSupply, avalancheGetTotalSupply, "eth", ethereumGetTotalSupply)
    let tvlActiveTotal =
        Usdc(polygonGetTotalSupply) +
        Usdc(avalancheGetTotalSupply) +
        Usdc(ethereumGetTotalSupply) +
        Usdc(optimismGetTotalSupply)
    let tvlActiveReturn = {
        TOTAL: tvlActiveTotal,
        POLYGON: Usdc(polygonGetTotalSupply),
        AVALANCHE: Usdc(avalancheGetTotalSupply),
        ETHEREUM: Usdc(ethereumGetTotalSupply),
        OPTIMISM: Usdc(optimismGetTotalSupply)
    };
    return tvlActiveReturn;
}
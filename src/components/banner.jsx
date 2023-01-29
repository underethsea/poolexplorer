import Luckiest from "./luckiest.jsx";
import UsdcWinners from "./v4winners.jsx";
import Account from "./account.jsx";
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
    useAccount
  } from 'wagmi';

function Banner() {

  const { connector: activeConnector, address, isConnecting, isDisconnected, isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('Connected', { address, connector, isReconnected })
    },
  })

return (<span>{!isConnected &&
    <div className="banner">
      {/* <img src="/images/ethbrand.png" className="ethbanner" /> */}

  &nbsp;&nbsp;
  
    Connect your wallet to PoolTogether and WIN&nbsp;

  </div>}</span>)
}
export default Banner;

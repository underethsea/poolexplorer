// import PoolSwapsQuickswap from './components/transactions/poolSwapsQuickswap.jsx'
// import UsdcDeposits from './components/transactions/usdcDeposits.jsx'
// import UsdcClaims from './components/transactions/usdcClaims.jsx'
// import PoolSwapsUniswap from './components/transactions/poolSwapsUniswap.jsx'

import Players from "./components/players.jsx";
import TotalHistory from "./components/history.jsx"
import UsdcClaimsV4Poly from "./components/usdcClaimsV4Poly.jsx";
import UsdcWinners from "./components/v4winners";
import Luckiest from "./components/luckiest.jsx";
import DelegationEvents from "./components/v4DelegationEvents.jsx"
import Poolers from "./components/poolers.jsx"
import Protocol from "./components/protocol.jsx"
import Unlucky from "./components/unlucky.jsx"
import Savers from "./components/savers.jsx"
import Home from "./components/home.jsx"
import Banner from "./components/banner.jsx"

import {MyConnect} from "./components/myConnect.jsx"
import { ethers } from "ethers";


import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

import '@rainbow-me/rainbowkit/dist/index.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { unstable_UserBlockingPriority } from "scheduler";

/* adding gnosis network */
const avalancheChain = {
  id: 43114,
  name: 'Avalanche',
  network: 'Avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'AVAX',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: 'https://api.avax.network/ext/bc/C/rpc',
  },
  blockExplorers: {
    default: { name: 'Snowtrace', url: 'https://snowtrace.io/' },
  },
  iconUrls: ["https://cryptologos.cc/logos/avalanche-avax-logo.png"],
  testnet: false,
}

function App() {

  const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygon, chain.optimism, avalancheChain],
    [
      alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })


  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <Router>
          <Navbar collapseOnSelect expand="lg">
            <Container fluid>
              <Navbar.Brand href="#home" className="navBarBrand">
                <img
                  src="./images/poolerson.png"
                  width="36"
                  height="36"
                  alt="explore"
                />
                <span className="header-text hidden-mobile" />
              </Navbar.Brand>
              <Nav className="navBarBrandCollapse">

                <Nav className="connectButtons">
                  <Route path="/poolers" render={() => <MyConnect />} />
                  <Route path="/home" render={() => <MyConnect />} />

                </Nav>
                <Navbar.Toggle />
                
              </Nav>
              <Navbar.Collapse className="navBarCollapse justify-content-end" style={{marginRight:"5%"}}>
                  <NavDropdown title="EXPLORE">
                    <NavDropdown.Item href="/usdcwinners">
                      Winners
                    </NavDropdown.Item>
                    
                    {/* {/* <NavDropdown.Item href="/usdcdeposits">USDC Deposits</NavDropdown.Item> */}

                    <NavDropdown.Item href="/players">Players</NavDropdown.Item>
                    <NavDropdown.Item href="/luckiest">
                      Luckiest Winners
                    </NavDropdown.Item>
 <NavDropdown.Item href="/unlucky">
                     Bad Luck Birbs
                    </NavDropdown.Item>

                    {/* <NavDropdown.Item href="/usdcclaimsv4poly">
                    Claims Polygon
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/delegationEvents">
                    Delegations
                  </NavDropdown.Item> */}
                    <NavDropdown.Item href="/totalHistory">
                      History
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/poolers">Pooler</NavDropdown.Item>
                    <NavDropdown.Item href="/protocol">
                      Protocol
                    </NavDropdown.Item>

                    {/* 
                <NavDropdown.Item href="/usdcclaims">USDC Claims</NavDropdown.Item>
                <NavDropdown.Item href="/poolswapsquickswap">POOL Swaps Quickswap</NavDropdown.Item>
                <NavDropdown.Item href="/poolswapsuniswap">POOL Swaps Uniswap</NavDropdown.Item> */}

                    {/* <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
                  </NavDropdown>
                </Navbar.Collapse>
            </Container>
          </Navbar>
          <Route exact path="/usdcwinners">
          <center>
            <div className="banner"><img src="/images/ethbrand.png" className="ethbanner" />
          &nbsp;&nbsp;<a href="https://steth.win" className="bannerlink">A new ETH prize pool is live, stETH.win&nbsp;
          <img src="images/arrow-up-right.svg" /></a>
          </div></center>
              </Route>
              
              <Route exact path="/home">
          <center>
            <Banner /></center>
              </Route>
          <Switch>
            <center>
          <div className="transactions section">
          <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/">
              <UsdcWinners />
            </Route>
            <Route exact path="/players">
              <Players />
            </Route>
            {/* <Route exact path="/usdcclaimsV4poly">
          <UsdcClaimsV4Poly />
        </Route>
        <Route exact path="/delegationEvents">
          <DelegationEvents />
        </Route> */}
            <Route exact path="/luckiest">
              <Luckiest />
            </Route>
            <Route exact path="/usdcwinners">
              <UsdcWinners />
            </Route>
            <Route exact path="/unlucky">
              <Unlucky />
            </Route>
<Route exact path="/savers">
              <Savers />
         
</Route>

            <Route exact path="/totalHistory">
              <TotalHistory />
            </Route>
            <Route exact path="/poolers">
              <Poolers />
            </Route>
            <Route exact path="/protocol">
              <Protocol />
            </Route></div></center>
          </Switch>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;

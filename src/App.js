// import PoolSwapsQuickswap from './components/transactions/poolSwapsQuickswap.jsx'
// import UsdcDeposits from './components/transactions/usdcDeposits.jsx'
// import UsdcClaims from './components/transactions/usdcClaims.jsx'
// import PoolSwapsUniswap from './components/transactions/poolSwapsUniswap.jsx'
import UsdcHoldersV4Poly from './components/transactions/usdcHoldersV4Poly.jsx'
import UsdcHoldersV4Eth from './components/transactions/usdcHoldersV4Eth.jsx'
import UsdcClaimsV4Poly from './components/transactions/usdcClaimsV4Poly.jsx'
import UsdcWinners from './components/transactions/v4winners'






import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  } from "react-router-dom";
  import { Navbar,Nav,NavDropdown,Form,FormControl,Button } from 'react-bootstrap'
  

const linkStyle = {
  
  color: '#4c249f',
  fontSize: 16,
  fontWeight: 800
  
};
function App() {
  
  return(
<Router>  
   <Navbar bg="light" expand="lg">
  {/* <Container> */}
    <Navbar.Brand href="#home" className="navbarbrand"><img src="./images/explore.png" width="40" height="40" alt="explore"></img>&nbsp;&nbsp;Pool Together V4</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav"> 
      <Nav className="me-auto">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {/* <Nav.Link href="#home">Home</Nav.Link> */}
        {/* {window.location.href.includes('eth') ?  
        <div><Nav.Link style={linkStyle} href="/usdcholdersv4poly"><div className='switch-btn'>Polygon Players</div></Nav.Link>
        <Nav.Link style={linkStyle} href="/usdcclaimsv4poly"><div className='switch-btn'>Polygon Claims</div></Nav.Link></div> : 
        window.location.href.includes('claim') ?
        <div><Nav.Link style={linkStyle} href="/usdcholdersv4poly"><div className='switch-btn'>Polygon Players</div></Nav.Link> 
        <Nav.Link style={linkStyle} href="/usdcholdersv4eth"><div className='switch-btn'>Mainnet Players</div></Nav.Link> </div>:
        <span><Nav.Link style={linkStyle} href="/usdcclaimsv4poly"><div className='switch-btn'>Polygon Claims</div></Nav.Link> 
        <div className='switch-btn'>Extra Button</div>
        <Nav.Link style={linkStyle} href="/usdcholdersv4eth"><div className='switch-btn'>Mainnet Players</div></Nav.Link></span>}
        */}

        <NavDropdown title="EXPLORE" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/usdcwinners">Winners</NavDropdown.Item>

        {/* {/* <NavDropdown.Item href="/usdcdeposits">USDC Deposits</NavDropdown.Item> */}
        <NavDropdown.Item href="/usdcholdersv4poly">Players Polygon</NavDropdown.Item>
        <NavDropdown.Item href="/usdcholdersv4eth">Players Mainnet</NavDropdown.Item>
        <NavDropdown.Item href="/usdcclaimsv4poly">Claims Polygon</NavDropdown.Item>

{/* 
        <NavDropdown.Item href="/usdcclaims">USDC Claims</NavDropdown.Item>
    <NavDropdown.Item href="/poolswapsquickswap">POOL Swaps Quickswap</NavDropdown.Item>
    <NavDropdown.Item href="/poolswapsuniswap">POOL Swaps Uniswap</NavDropdown.Item> */}

          {/* <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  {/* </Container> */}
</Navbar>

    <Switch>
    <Route exact path="/">
    <UsdcWinners />
    </Route>
    <Route exact path="/usdcholdersv4eth">
    <UsdcHoldersV4Eth />
    </Route>
    <Route exact path="/usdcholdersV4poly">
    <UsdcHoldersV4Poly />
    </Route> 
    <Route exact path="/usdcclaimsV4poly">
    <UsdcClaimsV4Poly />
    </Route> 
    <Route exact path="/usdcwinners">
    <UsdcWinners />
    </Route> 

    {/* <Route exact path="/usdcholdersV4poly">
    <UsdcHoldersV4Poly />
    </Route> */}
    {/* <Route path="/poolswapsquickswap">
    <PoolSwapsQuickswap />
    </Route>
    <Route path="/usdcclaims">
    <UsdcClaims />
    </Route>
    <Route path="/poolswapsuniswap">
    <PoolSwapsUniswap />
    </Route> */}
    {/* <Route path="/contact-us">
    <ContactUs /> */}
  
    </Switch> 
    
    </Router>
     

   
    )  }

export default App;
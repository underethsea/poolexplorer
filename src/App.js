// import PoolSwapsQuickswap from './components/transactions/poolSwapsQuickswap.jsx'
// import UsdcDeposits from './components/transactions/usdcDeposits.jsx'
// import UsdcClaims from './components/transactions/usdcClaims.jsx'
// import PoolSwapsUniswap from './components/transactions/poolSwapsUniswap.jsx'
// import UsdcDepositsV4Poly from './components/transactions/usdcDepositsV4Poly.jsx'
import UsdcHoldersV4Poly from './components/transactions/usdcHoldersV4Poly.jsx'




import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  } from "react-router-dom";
  import { Navbar,Nav,NavDropdown,Form,FormControl,Button } from 'react-bootstrap'
  
function App() {
  return(
<Router>  
   {/* <Navbar bg="light" expand="lg"> */}
  {/* <Container> */}
    {/* <Navbar.Brand href="#home" className="navbarbrand"><img src="./images/explore.png" width="40" height="40" alt="explore"></img>&nbsp;&nbsp;Pool Together Explorer</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav"> */}
      {/* <Nav className="me-auto"> */}
        {/* <Nav.Link href="#home">Home</Nav.Link> */}
        {/* <Nav.Link href="/usdcclaims">USDC claims</Nav.Link> */}
        {/* <NavDropdown title="EXPLORE" id="basic-nav-dropdown"> */}
        {/* <NavDropdown.Item href="/usdcdeposits">USDC Deposits</NavDropdown.Item>
        <NavDropdown.Item href="/usdcdepositsv4poly">USDC Deposits V4 Poly</NavDropdown.Item> */}
        {/* <NavDropdown.Item href="/usdcholdersv4poly">USDC Holders V4 Poly</NavDropdown.Item> */}
{/* 
        <NavDropdown.Item href="/usdcclaims">USDC Claims</NavDropdown.Item>
    <NavDropdown.Item href="/poolswapsquickswap">POOL Swaps Quickswap</NavDropdown.Item>
    <NavDropdown.Item href="/poolswapsuniswap">POOL Swaps Uniswap</NavDropdown.Item> */}

          {/* <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
        {/* </NavDropdown> */}
      {/* </Nav> */}
    {/* </Navbar.Collapse> */}
  {/* </Container> */}
{/* </Navbar> */}

    <Switch>
    {/* <Route exact path="/usdcdeposits">
    <UsdcDeposits />
    </Route>
    <Route exact path="/usdcdepositsV4poly">
    <UsdcDepositsV4Poly />
    </Route> */}
    <Route exact path="/usdcholdersV4poly">
    <UsdcHoldersV4Poly />
    </Route>
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
    <ContactUs />
    </Route> */}
    </Switch>
    <div>  <UsdcHoldersV4Poly /></div>
    </Router>
     

   
    )  }

export default App;

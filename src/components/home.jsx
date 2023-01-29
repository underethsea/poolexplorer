import Luckiest from "./luckiest.jsx";
import UsdcWinners from "./v4winners.jsx";
import Account from "./account.jsx";

function Home() {
return (<span>
<div><Account/></div>
<div><UsdcWinners short={true}/></div>
<div><Luckiest short={true}/></div></span>)
}
export default Home;

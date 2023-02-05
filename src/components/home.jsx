import Luckiest from "./luckiest.jsx";
import UsdcWinners from "./v4winners.jsx";
import Account from "./account.jsx";
import { useState } from "react";

function Home() {
    const [lucky,setLucky] = useState("lucky-off")
    const [recent,setRecent] = useState("recent-on")


    const toggleNow = () => {if(lucky==="lucky-on"){setLucky("lucky-off");setRecent("recent-on")}else 
    {setLucky("lucky-on");setRecent("recent-off")}}
return (<span>
<div><Account/></div>
<div className="recent-lucky-toggle">
    <div className={`${recent} toggle-button`} onClick={toggleNow}>
        Recent Winners
    </div>
    <div className={`${lucky} toggle-button`} onClick={toggleNow}>
        Lucky Winners
    </div>
</div>
{recent==="recent-on" && 
<div><UsdcWinners short={true}/></div>}
{lucky==="lucky-on" &&
<div><Luckiest short={true}/></div>}</span>)
}
export default Home;

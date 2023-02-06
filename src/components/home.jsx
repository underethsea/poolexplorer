import Luckiest from "./luckiest.jsx";
import UsdcWinners from "./v4winners.jsx";
import Account from "./account.jsx";
import { useState, useEffect } from "react";
function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
  }
function Home() {
  const [lucky, setLucky] = useState("lucky-off");
  const [recent, setRecent] = useState("recent-on");
  const [stats, setStats] = useState({"totalPlayers":0,"op":0,"pool":0,"tvl":{"total":0,"polygon":0,"avalanche":0,"ethereum":0,"optimism":0}});

  useEffect(() => {
    const load = async () => {

      try {

        let statsGot = await getStats();
        
    setStats(statsGot)
      } catch (e) {
        console.log("fetch error i ", e);
      }
    };
    load();
  }, []);

  const toggleNow = () => {
    if (lucky === "lucky-on") {
      setLucky("lucky-off");
      setRecent("recent-on");
    } else {
      setLucky("lucky-on");
      setRecent("recent-off");
    }
  };

  async function getStats() {
    let one = await fetch("https://poolexplorer.xyz/stats");
    one = await one.json();
    return one;
  }
  return (
    <span>
      <div>
        <Account />
      </div>
      <div className="home-data">
        <span className="home-poolers-data">
          <span className="home-poolers-svg-box">
            <img src="./images/poolers.svg" />
          </span>
          {/* <span className="home-poolers-title">Total Poolers</span><br></br> */}
          <span className="home-poolers-value">{separator(parseInt(stats.totalPlayers))}</span>
        </span>
        &nbsp;&nbsp;&nbsp;
        <span className="home-poolers-data">
          <span className="home-poolers-svg-box">
        <img src="./images/tvl.svg" /></span><span className="home-poolers-value">{separator(parseInt(stats.tvl.total))}</span></span>
      </div>
      <br></br>
      <div className="recent-lucky-toggle black-text">
        <div className={`${recent} toggle-button`} onClick={toggleNow}>
          Recent Winners
        </div>
        &nbsp;&nbsp;&nbsp;
        <div className={`${lucky} toggle-button`} onClick={toggleNow}>
          Lucky Winners
        </div>
      </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div className="recent-lucky-toggle black-text">

      <img src="./images/pool.png" className="token"/>&nbsp; POOL - ${stats?.pool.toFixed(2)}
      <img src="./images/optimism.png" className="token"/>&nbsp; OP APR - {(((20000 * stats.op * 52) / stats.tvl.optimism )*100).toFixed(2)}% &nbsp;&nbsp;&nbsp;&nbsp;</div>
      {recent === "recent-on" && (
        <div>
          <UsdcWinners short={true} />
        </div>
      )}
      {lucky === "lucky-on" && (
        <div>
          <Luckiest short={true} />
        </div>
      )}
    </span>
  );
}
export default Home;

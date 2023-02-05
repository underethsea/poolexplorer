import Luckiest from "./luckiest.jsx";
import UsdcWinners from "./v4winners.jsx";
import Account from "./account.jsx";
import { useState } from "react";

function Home() {
  const [lucky, setLucky] = useState("lucky-off");
  const [recent, setRecent] = useState("recent-on");

  const toggleNow = () => {
    if (lucky === "lucky-on") {
      setLucky("lucky-off");
      setRecent("recent-on");
    } else {
      setLucky("lucky-on");
      setRecent("recent-off");
    }
  };
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
          <span className="home-poolers-value">324,344</span>
        </span>
        &nbsp;&nbsp;&nbsp;
        <span className="home-poolers-data">
          <span className="home-poolers-svg-box">
        <img src="./images/tvl.svg" /></span><span className="home-poolers-value">35,000,000</span></span>
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

      <img src="./images/pool.png" className="token"/>&nbsp; POOL - $1.01
      <img src="./images/optimism.png" className="token"/>&nbsp; OP APR - 8.9%&nbsp;&nbsp;&nbsp;&nbsp;</div>
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

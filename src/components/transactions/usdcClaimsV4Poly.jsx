import { ethers } from "ethers"
import React, {useState, useEffect} from 'react'

const emoji = (amount) => {
    let emojiIcon = "";
    let weiAmount = ethers.utils.formatUnits(amount,6);
    amount = parseFloat(weiAmount);
    console.log("amount ",amount)
    if(amount > 2499) 
        {emojiIcon = "trophy"} else
    if(amount > 99)
        {emojiIcon = "moneybag"} else
        if(amount > 19)
        {emojiIcon = "moneywings"} else
        {emojiIcon = "thumbsup"}

        return emojiIcon;
  }
  
function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}

function amount(weiAmount) {
    weiAmount = ethers.utils.formatUnits(weiAmount,6);
    return Number.parseFloat(weiAmount).toFixed(0);
      }

function UsdcClaimsV4Poly(){
    
    const [claims, setClaims] = useState([]);

    useEffect(() => {
    const callEvents = async () => {
        var endpointURL = "https://polygon-mainnet.g.alchemy.com/v2/Km46Q-DZ04ftPfKNgPwaP6cp957PJHNl";
        var customHttpProvider = new ethers.providers.JsonRpcProvider(endpointURL);
        
        const prizeDistributorAddress = "0x8141BcFBcEE654c5dE17C4e2B2AF26B67f9B9056";
        const prizeDistributorAbi = JSON.parse('[{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"contract IERC20","name":"_token","type":"address"},{"internalType":"contract IDrawCalculator","name":"_drawCalculator","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint32","name":"drawId","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"payout","type":"uint256"}],"name":"ClaimedDraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IDrawCalculator","name":"calculator","type":"address"}],"name":"DrawCalculatorSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ERC20Withdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"pendingOwner","type":"address"}],"name":"OwnershipOffered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"}],"name":"TokenSet","type":"event"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint32[]","name":"_drawIds","type":"uint32[]"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"claim","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getDrawCalculator","outputs":[{"internalType":"contract IDrawCalculator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint32","name":"_drawId","type":"uint32"}],"name":"getDrawPayoutBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IDrawCalculator","name":"_newCalculator","type":"address"}],"name":"setDrawCalculator","outputs":[{"internalType":"contract IDrawCalculator","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"_erc20Token","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawERC20","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]');
        const distributionContract = new ethers.Contract(prizeDistributorAddress, prizeDistributorAbi, customHttpProvider);
        
        const currentBlock = await customHttpProvider.getBlockNumber();
        const fromBlock = currentBlock - 30000;
        let eventFilter = distributionContract.filters.ClaimedDraw();
        let distributionClaim = await distributionContract.queryFilter(eventFilter,fromBlock)
        
        console.log("total events ",distributionClaim.length)
        console.log(distributionClaim);

        distributionClaim.sort(function (a, b) {
            return a.args.payout - b.args.payout;
    
          });
          distributionClaim.reverse();
        setClaims(distributionClaim);
    }
    callEvents();
  
  
      }
  
  , []);

  return (<div className = "transactions section">
  <div className = "card has-table has-mobile-sort-spaced">
      <header className = "card-header">
          <p className = "card-header-title">
          RECENT POLYGON CLAIMS
          {/* <span className="numb-purp">{separator(total)}</span><img src='./images/usdc.png' className='token'/> <span className="numb-purp"> {separator(depositors)}</span> Depositors  <span className="numb-purp">{separator(average.toFixed(0))}</span><img src='./images/usdc.png' className='token'/> average  */}
          </p>
      </header>
      <div className="card-content">
          <div className="table-wrapper has-mobile-cards">
              <table className="is-stripped table is-hoverable">
                  <thead>
                      <tr>
                          {/* <th>Transaction Hash</th>
                          <th>Time</th> */}
                          <th>Address</th>
                          <th>Amount</th>
                      </tr>
                  </thead>
                  <tbody>
    {claims.map((item) => (
        <tr key={item.transactionHash}>
            <td>
            <a href={'https://polygonscan.com/address/' + item.args.user} target='_blank' rel="noopener noreferrer">
                                        {item.args.user}
                                    </a>
                                    {/* &nbsp;{checkIfYearnOrPod(item.address)} */}
                                    </td>
                                <td>
                                <img src={'./images/' + emoji(item.args.payout) + '.png'} className='emoji' alt='emoji'></img>
                                &nbsp;
                                    {separator(amount(item.args.payout))}
                                    </td>
                            </tr>
                            ))}
                            </tbody></table>

                    </div></div>
            </div>
        </div>
   
)
}
export default UsdcClaimsV4Poly;    








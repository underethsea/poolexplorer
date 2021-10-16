import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { ethers } from "ethers"
import { TimeConvert } from './timeConvert.js'



const checkIfYearnOrPod = (address) => {
    let pod = "0x386eb78f2ee79adde8bdb0a0e27292755ebfea58";
    let yearn = "0x387fca8d7e2e09655b4f49548607b55c0580fc63";
    if(address === yearn) {
        return(<img src='./images/yearn.png' className='emoji' alt='yearn'></img>)
    }
    else if(address === pod)
        { return(<img src='./images/pods.png' className='emoji' alt='pods'></img>)
    }
}

function amount(weiAmount) {
    weiAmount = ethers.utils.formatUnits(weiAmount,6);
    return Number.parseFloat(weiAmount).toFixed(0);
      }
      
      const emoji = (amount) => {
        let emojiIcon = "";
        let weiAmount = ethers.utils.formatUnits(amount,6);
        amount = parseFloat(weiAmount);
        console.log("amount ",amount)
        if(amount > 50000) 
            {emojiIcon = "whale"} else
        if(amount > 20000)
            {emojiIcon = "dolphin"} else
        if(amount > 5000)
            {emojiIcon = "fish"} else
        if(amount > 1000)
            {emojiIcon = "fish"} else
            {emojiIcon = "shell"}

        return emojiIcon;
    }

function transactionString(transString) {
    return transString.replace(transString.substring(4,56), "....");
}
function addressString(addString) {
    return addString.substring(0,10);
}
function UsdcDepositsV4Poly() {
    const [transactions, setTransactions] = useState([]);
    ;
useEffect(() => {
  const query = `query MyQuery {
    ethereum(network:matic) {
      smartContractEvents(
        options: {desc: "block.height", limit: 800}
        smartContractAddress: {is: "0x19DE635fb3678D8B8154E37d8C9Cdf182Fe84E60"}
        smartContractEvent: {is: "Deposited"}
      ) {
        transaction {
          hash
        }
        block {
          height
          timestamp {
            iso8601
            unixtime
          }
        }
        arguments {
          value
          argument
          index
        }
        smartContractEvent {
          name
        }
        eventIndex
      }
    }
  }`;
    
    axios({
        url: 'https://graphql.bitquery.io/',
        method: 'post',
        data: {query
        }
    }).then((result) => {
        console.log(result);
    let events = result.data.data.ethereum.smartContractEvents;
   
    events.sort(function (a, b) {
        return a.arguments[3].value - b.arguments[3].value;

      });
      events.reverse();

      setTransactions(events);

});
}, []);

  
return (
    <div className = "transactions section">
        <div className = "card has-table has-mobile-sort-spaced">
            <header className = "card-header">
                <p className = "card-header-title">
                    USDC Pool Deposits V4 Polygon
                </p>
            </header>
            <div className="card-content">
                <div className="table-wrapper has-mobile-cards">
                    <table className="is-stripped table is-hoverable">
                        <thead>
                            <tr>
                                <th>Transaction Hash</th>
                                <th>Time</th>
                                <th>Address</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                        {transactions.map((item) => (
                            <tr key={item.id}>
                                <td><a href={'https://polygonscan.com/tx/' + item.transaction.hash} target='_blank' rel="noopener noreferrer">{transactionString(item.transaction.hash)}</a></td>
                                <td>{TimeConvert(item.block.timestamp.unixtime)}</td>
                                <td>
                                    <a href={'https://polygonscan.com/address/' + item.arguments[1].value} target='_blank' rel="noopener noreferrer">
                                        {addressString(item.arguments[1].value)}
                                    </a>
                                    &nbsp;{checkIfYearnOrPod(item.arguments[1].value)}
                                    </td>
                                <td>
                                <img src={'./images/' + emoji(item.arguments[3].value) + '.png'} className='emoji' alt='emoji'></img>
                                &nbsp;
                                    {amount(item.arguments[3].value)}
                                    </td>
                            </tr>
                        ))}
                            </tbody></table>

                    </div></div>
            </div>
        </div>

)
}
export default UsdcDepositsV4Poly;    
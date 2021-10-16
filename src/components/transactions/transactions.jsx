import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { ethers } from "ethers"

function amount(weiAmount) {
    weiAmount = ethers.utils.formatEther(weiAmount);
    return Number.parseFloat(weiAmount).toFixed(5);
      }
      
function transactionString(transString) {
    return transString.replace(transString.substring(4,56), "....");
}
function addressString(addString) {
    return addString.replace(addString.substring(4,36), "....");
}
function Transactions() {
    const [transactions, setTransactions] = useState([]);
    ;
useEffect(() => {
  const query = `query MyQuery {
    ethereum {
      smartContractEvents(
        options: {desc: "block.height", limit: 800}
        smartContractAddress: {is: "0xBD537257fAd96e977b9E545bE583bbF7028F30b9"}
        smartContractEvent: {is: "Claimed"}
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
    setTransactions(result.data.data.ethereum.smartContractEvents);
});
}, []);

  
return (
    <div className = "transactions section">
        <div className = "card has-table has-mobile-sort-spaced">
            <header className = "card-header">
                <p className = "card-header-title">
                    USDC Claim History
                </p>
            </header>
            <div className="card-content">
                <div className="table-wrapper has-mobile-cards">
                    <table className="is-stripped table is-hoverable">
                        <thead>
                            <tr>
                                <th>Transaction Hash</th>
                                <th>Time</th>
                                <th>User Address</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                        {transactions.map((item) => (
                            <tr key={item.id}>
                                <td><a href={'https://etherscan.io/tx/' + item.transaction.hash} target='_blank' rel="noopener noreferrer">{transactionString(item.transaction.hash)}</a></td>
                                <td>{item.block.timestamp.unixtime}</td>
                                <td><a href={'https://etherscan.io/address/' + item.arguments[0].value} target='_blank' rel="noopener noreferrer">{addressString(item.arguments[0].value)}</a></td>
                                <td>{amount(item.arguments[1].value)}</td>
                            </tr>
                        ))}
                            </tbody></table>

                    </div></div>
            </div>
        </div>

)
}
export default Transactions;


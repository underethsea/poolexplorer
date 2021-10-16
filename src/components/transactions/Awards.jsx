import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { ethers } from "ethers"

// const checkIfYearn = (address) => {
//     let pod = "0x386eb78f2ee79adde8bdb0a0e27292755ebfea58";
//     let yearn = "0x387fca8d7e2e09655b4f49548607b55c0580fc63";
//     if(address === yearn) {
//         return(<img src='./images/yearn.png' className='emoji'></img>)
//     }
//     else if(address === pod)
//         {        return(<img src='./images/pods.png' className='emoji'></img>)
//     }
// }

function amount(weiAmount) {
    weiAmount = ethers.utils.formatUnits(weiAmount,6);
    return Number.parseFloat(weiAmount).toFixed(5);
      }
      
//       const emoji = (amount) => {
//         let emojiIcon = "";
//         let weiAmount = ethers.utils.formatUnits(amount,6);
//         amount = parseFloat(weiAmount);
//         console.log("amount ",amount)
//         if(amount > 500000) 
//             {emojiIcon = "whale"} else
//         if(amount < 100)
//             {emojiIcon = "crying"} else
//         if(amount < 500)
//             {emojiIcon = "eek"} else
//         if(amount < 5000)
//             {emojiIcon = "hmm"} else
//             {emojiIcon = "bank"}

//         return emojiIcon;
//     }

function transactionString(transString) {
    return transString.replace(transString.substring(4,56), "....");
}
function addressString(addString) {
    return addString.replace(addString.substring(4,36), "....");
}
function UsdcAwarded() {
    const [transactions, setTransactions] = useState([]);
    ;
useEffect(() => {
  const query = `query MyQuery {
    ethereum (network:matic){
      smartContractEvents(
        options: {desc: "block.height", limit: 800}
        smartContractAddress: {is: "0xEE06AbE9e2Af61cabcb13170e01266Af2DEFa946"}
        smartContractEvent: {is: "Awarded"}
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
                    Polygon USDC Prizes
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
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                        {transactions.map((item) => (
                            <tr key={item.id}>
                                <td><a href={'https://etherscan.io/tx/' + item.transaction.hash} target='_blank' rel="noopener noreferrer">{transactionString(item.transaction.hash)}</a></td>
                                <td>{item.block.timestamp.unixtime}</td>
                                <td>
                                    <a href={'https://etherscan.io/address/' + item.arguments[0].value} target='_blank' rel="noopener noreferrer">
                                        {addressString(item.arguments[0].value)}
                                    </a>
                                    {/* &nbsp;{checkIfYearn(item.arguments[1].value)} */}
                                    </td>
                                <td>
                                {/* <img src={'./images/' + emoji(item.arguments[3].value) + '.png'} className='emoji'></img> */}
                                &nbsp;
                                    {amount(item.arguments[2].value)}
                                    </td>
                            </tr>
                        ))}
                            </tbody></table>

                    </div></div>
            </div>
        </div>

)
}
export default UsdcAwarded;


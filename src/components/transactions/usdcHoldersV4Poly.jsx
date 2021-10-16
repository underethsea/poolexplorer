

import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { ethers } from "ethers"
// import { TimeConvert } from './timeConvert.js'



// const checkIfYearnOrPod = (address) => {
//     let pod = "0x386eb78f2ee79adde8bdb0a0e27292755ebfea58";
//     let yearn = "0x387fca8d7e2e09655b4f49548607b55c0580fc63";
//     if(address === yearn) {
//         return(<img src='./images/yearn.png' className='emoji' alt='yearn'></img>)
//     }
//     else if(address === pod)
//         { return(<img src='./images/pods.png' className='emoji' alt='pods'></img>)
//     }
// }

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
            if(amount > 10000)
            {emojiIcon = "octopus"} else
        if(amount > 5000)
            {emojiIcon = "fish"} else
        if(amount > 1000)
            {emojiIcon = "lobster"} else
            if(amount > 500)
            {emojiIcon = "fis"} else
            if(amount > 100)
            {emojiIcon = "shrimp"} else
            {emojiIcon = "shell"}


        return emojiIcon;
    }

function transactionString(transString) {
    return transString.replace(transString.substring(4,56), "....");
}
function addressString(addString) {
    return addString.substring(0,10);
}
function UsdcHoldersV4Poly() {
    const [transactions, setTransactions] = useState([]);
    ;
useEffect(() => {
  fetch("https://api.covalenthq.com/v1/137/tokens/0x6a304dfdb9f808741244b6bfee65ca7b3b3a6076/token_holders/?page-size=5000&key=ckey_d8ea1001bff74ecb8cc3afd51ec")
    .then(api => api.json())
    .then(result => { console.log(result);

    let events = result.data.items;
   
    events.sort(function (a, b) {
        return a.balance - b.balance;

      });
      events.reverse();

      setTransactions(events);


    

    });

}, []);
let depositors = transactions.length;

let total = 0;
    let balance = 0;
    transactions.forEach((item) => {
        balance = parseFloat(amount(item.balance));
        total = total + balance;
    })

    let average = total / depositors;
    
  
return (
    <div className = "transactions section">
        <div className = "card has-table has-mobile-sort-spaced">
            <header className = "card-header">
                <p className = "card-header-title">
                Pool Together <span className="numb-purp">{total}</span><img src='./images/usdc.png' className='token'/> deposits V4 Polygon <span className="numb-purp"> {depositors}</span> Depositors  <span className="numb-purp">{average.toFixed(0)}</span><img src='./images/usdc.png' className='token'/> average 
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
                        {transactions.map((item) => (
                            <tr key={item.id}>
                                {/* <td></td>  <td></td> */}
                                <td>
                                    <a href={'https://polygonscan.com/address/' + item.address} target='_blank' rel="noopener noreferrer">
                                        {item.address}
                                    </a>
                                    {/* &nbsp;{checkIfYearnOrPod(item.address)} */}
                                    </td>
                                <td>
                                <img src={'./images/' + emoji(item.balance) + '.png'} className='emoji' alt='emoji'></img>
                                &nbsp;
                                    {amount(item.balance)}
                                    </td>
                            </tr>
                        ))}
                            </tbody></table>

                    </div></div>
            </div>
        </div>

)
}
export default UsdcHoldersV4Poly;    
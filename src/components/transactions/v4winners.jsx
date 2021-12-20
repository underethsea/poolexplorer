

import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { ethers } from "ethers"
import Select from "react-select";

// import { TimeConvert } from './timeConvert.js'

const chains = [1,137]
function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}

function amount(weiAmount) {
     weiAmount = parseFloat(weiAmount);
    weiAmount = weiAmount / 1000000;
    return weiAmount.toFixed(0);
      }
      
      const emoji = (amount) => {
        let emojiIcon = "";
        let weiAmount = amount / 1000000;
        amount = parseFloat(weiAmount);
        if(amount > 2499) 
            {emojiIcon = "whale"} else
        if(amount > 499)
            {emojiIcon = "dolphin"} else
        if(amount > 199)
            {emojiIcon = "octopus"} else
        if(amount > 99)
            {emojiIcon = "lobster"} else
        if(amount > 9)
            {emojiIcon = "fis"} else
            {emojiIcon = "fish"}



        return emojiIcon;
    }

function transactionString(transString) {
    return transString.replace(transString.substring(4,56), "....");
}
function addressString(addString) {
    return addString.substring(0,10);
}
function UsdcWinners() {
    
let options = []
    for (let i = 0; i <= 60; i++) {
        options.push({label: i,value: i})
      }
  options.reverse();
    const [transactions, setTransactions] = useState([]);
    const [median, setMedian] = useState([]);
    const [draw, setDraw] = useState([]);
    const onChange = selectedOption => {
        setDraw(selectedOption);
        console.log(`Option selected:`, selectedOption);
      };
    
useEffect(() => {
  
    const goooo = async () => {
        console.log(draw);
        // let [polyApi,apiMainnet] = Promise.all(x)
        let polyApi = "https://api.pooltogether.com/prizes/137/0x8141bcfbcee654c5de17c4e2b2af26b67f9b9056/draw/" + draw.value + "/prizes.json"
  console.log(polyApi)
        let api = await fetch(polyApi)
api = await api.json();
api.forEach((v) => {
  v.chain = "Polygon";
});
    let apiMainnet = await fetch(https://api.pooltogether.com/prizes/1/0xb9a179dca5a7bf5f8b9e088437b3a85ebb495efe/draw/" + draw.value + "/prizes.json")
      let apiMain = await apiMainnet.json()
      apiMain.forEach((v) => {
        v.chain = "Ethereum";
      });
    let result = api.concat(apiMain);

    let events = result;
   
    events.sort(function (a, b) {
        return a.amount - b.amount;

    });
      events.reverse();
      let key = 0;
      api.forEach((v) => {
        v.key = key;
        key++;
      });
      

      setTransactions(events);
}
goooo();


  

}, [draw]);
let depositors = transactions.length;
let total = 0;
    let balance = 0;
    transactions.forEach((item) => {
        balance = parseFloat(amount(item.amount));
        total = total + balance;
    })

    let average = total / depositors;
    
return (
    <div className = "transactions section">
        {/* <button onClick={() => setDraw(58)}>Draw 58</button><button onClick={() => setDraw(59)}>Draw 59</button><button onClick={() => setDraw(60)}>Draw 60</button> */}
        <div className = "card has-table has-mobile-sort-spaced">
            <header className = "card-header">
                <p className = "card-header-title">
                DRAW #&nbsp;<Select options={options} onChange={onChange} value={draw}/>&nbsp;
                WINNERS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="numb-purp"> {separator(depositors)}</span> PRIZES 
                <img src='./images/usdc.png' className='token'/> 
                <span className="numb-purp">{separator(total)}</span> TOTAL

                {/* <img src='./images/usdc.png' className='token'/>
                <span className="numb-purp">{separator(average.toFixed(0))}</span>
                &nbsp;AVG 
                <img src='./images/usdc.png' className='token'/>
                <span className="numb-purp">{separator(median)}</span>
                &nbsp;MEDIAN */}
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
                            <tr key={item}>
                                {/* <td></td>  <td></td> */}
                                <td>{item.chain == "Ethereum" ? <span><img src="./images/ethereum.png" className="emoji"/> &nbsp;&nbsp;
                                <a href={'https://etherscan.io/address/' + item.address} target='_blank' rel="noopener noreferrer">
                                {item.address} 
                            </a></span>
                                :<span><img src="./images/polygon.png" className="emoji"/>
                                &nbsp;&nbsp;
                                <a href={'https://polygonscan.com/address/' + item.address} target='_blank' rel="noopener noreferrer">
                                {item.address} 
                            </a></span>}
                                    
                                    {/* &nbsp;{checkIfYearnOrPod(item.address)} */}
                                    </td>
                                <td>
                                <img src={'./images/' + emoji(item.amount) + '.png'} className='emoji' alt='emoji'></img>
                                &nbsp;
                                    {separator(amount(item.amount))}
                                    </td>
                            </tr>
                        ))}
                            </tbody></table>

                    </div></div>
            </div>
        </div>

)
}
export default UsdcWinners;    

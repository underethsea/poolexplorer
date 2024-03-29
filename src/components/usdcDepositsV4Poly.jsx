

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ethers } from "ethers"

function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}

function amount(weiAmount) {
    weiAmount = ethers.utils.formatUnits(weiAmount, 6);
    return Number.parseFloat(weiAmount).toFixed(0);
}

const emoji = (amount) => {
    let emojiIcon = "";
    let weiAmount = ethers.utils.formatUnits(amount, 6);
    amount = parseFloat(weiAmount);
    console.log("amount ", amount)
    if (amount > 500000) { emojiIcon = "whale" } else
        if (amount < 100) { emojiIcon = "crying" } else
            if (amount < 500) { emojiIcon = "eek" } else
                if (amount < 5000) { emojiIcon = "hmm" } else { emojiIcon = "bank" }



    return emojiIcon;
}

function transactionString(transString) {
    return transString.replace(transString.substring(4, 56), "....");
}
function addressString(addString) {
    return addString.substring(0, 10);
}
function UsdcHoldersV4Eth() {
    const [transactions, setTransactions] = useState([]);
    const [median, setMedian] = useState([]);

    ;
    useEffect(() => {
        fetch("https://api.covalenthq.com/v1/1/tokens/0xdd4d117723c257cee402285d3acf218e9a8236e1/token_holders/?page-size=15000&key=" + REACT_APP_COVALENT_KEY)
            .then(api => api.json())
            .then(result => {
                console.log(result);

                let events = result.data.items;

                events.sort(function (a, b) {
                    return a.balance - b.balance;

                });
                events.reverse();
                // shit median code
                let length = events.length - 1
                length = length / 2
                length = parseInt(length)
                let medianTemp = events[parseInt(((events.length / 2) - 1))].balance
                medianTemp = medianTemp / 1000000;
                setMedian(medianTemp);
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
        <div className="transactions section">
            <div className="card has-table has-mobile-sort-spaced">
                <header className="card-header">
                    <p className="card-header-title">
                        MAINNET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="numb-purp"> {separator(depositors)}</span> PLAYERS
                        <img src='./images/usdc.png' className='token' />
                        <span className="numb-purp">{separator(total)}</span> TOTAL

                        <img src='./images/usdc.png' className='token' />
                        <span className="numb-purp">{separator(average.toFixed(0))}</span>
                        &nbsp;AVG
                        <img src='./images/usdc.png' className='token' />
                        <span className="numb-purp">{separator(median)}</span>
                        &nbsp;MEDIAN
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
                                            <a href={'https://etherscan.io/address/' + item.address} target='_blank' rel="noopener noreferrer">
                                                {item.address}
                                            </a>
                                            {/* &nbsp;{checkIfYearnOrPod(item.address)} */}
                                        </td>
                                        <td>
                                            <img src={'./images/' + emoji(item.balance) + '.png'} className='emoji' alt='emoji'></img>
                                            &nbsp;
                                            {separator(amount(item.balance))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody></table>

                    </div></div>
            </div>
        </div>

    )
}
export default UsdcHoldersV4Eth;    

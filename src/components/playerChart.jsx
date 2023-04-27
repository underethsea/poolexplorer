import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const formatBalance = (balance) => {
    if (balance >= 1000000) {
      return `${(balance / 1000000).toFixed(1)}M`;
    } else if (balance >= 1000) {
      return `${(balance / 1000).toFixed(1)}K`;
    } else {
      return balance.toFixed(0);
    }
  };
const PlayerChart = ({ address }) => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://poolexplorer.xyz/balances?address=${address}`);
        const data = await response.json();
        console.log("data",data)
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [address]);
  const formatStats = () => {
    const drawIds = Array.from(new Set(stats.map((stat) => stat.draw_id)));
    const data = drawIds.map((drawId) => {
      const balances = stats
        .filter((stat) => stat.draw_id === drawId)
        .reduce((sum, stat) => sum + Number(stat.average_balance), 0);
      return { drawId, balance: balances / 1e6 };
    }).sort((a, b) => a.drawId - b.drawId);
    console.log(data);
    const maxBalance = Math.max(...data.map((entry) => entry.balance));
    const domainMax = Math.ceil(maxBalance * 1.05);
    const minBalance = Math.min(...data.map((entry) => entry.balance));
    const domainMin = Math.ceil(minBalance-(minBalance*.05))
    return [{ data, domainMax , domainMin}];
  };
  

  const renderCharts = () => {
    const formattedStats = formatStats();
    return formattedStats.map((network) => {
      return (
        <div>
         Balance History
          <LineChart
            width={300}
            height={225}
            data={network.data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            padding={{ top: 40, right: 40, bottom: 4, left: 4 }}

            style={{ backgroundColor: 'black' }}
          >
            <XAxis 
            width = {50}
            dataKey="drawId" 
            tick={{ fontSize: 10 }} 
            stroke="white" 
            axisLine={{ stroke: '#e1e2e3' }}  
            minTickGap={15}
            />
            <YAxis
              width = {40}
              tickFormatter={formatBalance}
              tick={{ fontSize: 10  }}
              stroke="white"
              domain={[network.domainMin, network.domainMax]}
              axisLine={{ stroke: '#e1e2e3' }} 
              props={false}
              tickCount = {4}
            />
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            {/* <Tooltip labelFormatter={(value) => `Draw ${value}`} /> */}
            
            {/* <Tooltip label="" formatter={(value, name, props) => {
            if (props.payload.drawId === undefined || props.payload.balance === undefined) {
              return null;
            }
            return (
              <div style={{ color: 'black' }}>
                <div>Draw {props.payload.drawId}</div>
                <div>{formatBalance(props.payload.balance)}</div>
              </div>
            );
          }}/> */}
 
            {/* <Legend wrapperStyle={{ fontSize: 8 }} /> */}
            <Line
            type="monotone"
            dataKey="balance"
            stroke="#ff4fff"
            strokeWidth={1}
            dot = {false}
            label={false}
            // activeDot={{ r: 4 }}
          />
          </LineChart>
        </div>
      );
    });
  };
  

  return <div>{stats.length ? renderCharts() : <p>Loading...</p>}</div>;
};

export default PlayerChart;

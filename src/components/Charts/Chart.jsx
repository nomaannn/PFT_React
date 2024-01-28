import React from 'react';
import {  Pie } from '@ant-design/charts';
import './style.css'
import { Line } from 'react-chartjs-2';

const Chart = ({ sortedtransacion }) => {
    console.log("sorted ?>>>>>>>>>", sortedtransacion)
    
    const data = sortedtransacion.map((item) => {
        console.log({date: item.date, amount: item.amount})
        return { date: new Date(item.date), amount: item.amount }
    })
 

    let spendingData = sortedtransacion.filter((transaction) => {
        if (transaction.type == "expense") {
            return { tag: transaction.tag, amount: transaction.amount }
        }
    })


    let finalSpending = spendingData.reduce((acc, obj) => {
        let key = obj.tag
        if (obj.tag)
            if (!acc[key]) {
                acc[key] = { tag: obj.tag, amount: obj.amount }
            }
        return acc
    }, {})



    // const config = {
    //     data: data,
    //     width: 500,
    //     xField: 'date',
    //     yField: 'amount',

    // };

    const pieconfig = {

        data: Object.values(finalSpending),
        angleField: "amount",
        colorField: "tag",
        // width: 500

    };

    return (
        <div className="chart-wrapper">
            <div className="chart-wrapper-1">
                <h2>Your Analytics</h2>
                <Line 
               
                     data={{
                        labels: data.map((data) => data.date.toDateString()),
                        datasets: [
                          {
                            label: "Amount",
                            data: data.map((data) => data.amount),
                            backgroundColor: "#064FF0",
                            borderColor: "#064FF0",
                          }
                        ],
                        
                      }}
                    />;
            </div>
            <div className="chart-wrapper-2">
                <h2>Your Spendings</h2>
                <Pie {...pieconfig} width={300} height={400} />;
            </div>
        </div>
    )
};
export default Chart;
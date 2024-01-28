import React from 'react';
import {Chart as ChartJS} from 'chart.js/auto'
import {Bar, Doughnut, Line} from 'react-chartjs-2'


    const CChartJS = ({ sortedtransacion }) => {
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
    
        // let unique = [...new Set(spendingData.tag)];
        const unique = [...new Set(spendingData.map(item => item.tag))];
        
        const output = []
        for (let i = 0; i < spendingData.length; i++) {
            const key = spendingData.map((item)=>item.tag)
            console.log("keyyyyyyyyy",Object.entries(spendingData))
            if(key[i]==Object.keys(spendingData)){
                return
            }else{
                output.push(spendingData[i])
            }
            }


        // key = other


        console.log("output>>",output)
        let finalSpending = spendingData.reduce((acc, obj) => {
            
            let key = obj.tag
            if (obj.tag)
                if (!acc[key]) {
                    acc[key] =   obj.amount 
                }
            return acc
        },[])
       
    console.log("finalllll>>>>>>", finalSpending )
        return (
            <div className="chart-wrapper">
                <div >
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

                <Doughnut 
                     data={{
                        labels: unique.map((data) => data),
                        datasets: [
                          {
                            label: "Amount",
                            data:finalSpending.map((data)=>data),
                            backgroundColor: [
                                "rgba(43, 63, 229, 0.8)",
                                "rgba(250, 192, 19, 0.8)",
                                "rgba(253, 135, 135, 0.8)",
                              ],
                              borderColor: [
                                "rgba(43, 63, 229, 0.8)",
                                "rgba(250, 192, 19, 0.8)",
                                "rgba(253, 135, 135, 0.8)",
                              ],
                          }
                        ],
                      }}
                    />;
                </div>
               
            </div>
        )
    };

export default CChartJS;

import { Select, Table, Radio } from 'antd';
import { Option } from 'antd/es/mentions';
import React, { useState } from 'react';
import searchImg from '../../assets/search.svg'
import './style.css'
import Button from '../Button/Button';
import { parse, unparse } from "papaparse";


function TransactionTable({ transactions, addTransaction, fetchTransactions }) {
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState("")
    const [sortkey, setSortkey] = useState("")


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        }
    ];


    let filter = transactions.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter))


    let sortedTransactions = filter.sort((a, b) => {
        if (sortkey == "date") {
            return new Date(a.date) - new Date(b.date)
        } else if (sortkey == "amount") {
            return a.amount - b.amount
        } else {
            return 0
        }
    })


    function exportToCsv() {
        const csv = unparse({
            fields: ["name", "type", "tag", "date", "amount"],
            data: transactions,
        });
        const blob = new Blob([csv], { type: "text/csv;charset#utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function importFromCsv(event) {
        event.preventDefault();
        try {
            parse(event.target.files[0], {
                header: true,
                complete: async function (results) {
                    console.log("result >>>", results)
                    // // Now results.data is an array of objects representing your CSV rows
                    for (const transaction of results.data) {
                        // Write each transaction to Firebase, you can use the addTransaction function here
                        if (transaction.name != "") {
                            console.log("Transactions", transaction);
                            const newTransaction = {
                                ...transaction,
                                amount: parseFloat(transaction.amount),
                            };
                            await addTransaction(newTransaction, true);
                        }

                    }
                },
            });
            toast.success("All Transactions Added");
            fetchTransactions();
            event.target.files = null;
        } catch (e) {
            toast.error(e.message);
        }
    }
    return (
        <div
            style={{
                margin: "2rem"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                <div className='input-flex'>
                    <img src={searchImg} alt='#' width={16} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search by Name' />
                </div>
                <Select className="select-input"
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filter"
                >
                    <Option value=''>All</Option>
                    <Option value='income'>Income</Option>
                    <Option value='expense'>Expence</Option>
                </Select>
            </div>
            <div className="my-table">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "1rem",
                    }}
                >
                    <h2>My Transactions</h2>
                    <Radio.Group
                        className="input-radio"
                        onChange={(e) => setSortkey(e.target.value)}
                        value={sortkey}
                    >
                        <Radio.Button value="">No Sort</Radio.Button>
                        <Radio.Button value="date">Sort By Date</Radio.Button>
                        <Radio.Button value="amount">Sort By Amount</Radio.Button>
                    </Radio.Group>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "1rem",
                            width: "400px",
                        }}
                    >
                        <Button className="btn"
                            onClick={exportToCsv}
                            text={"Export to CSV"}
                        />
                        <label for="file-csv" className="btn btn-blue">
                            Import from CSV
                        </label>
                        <input
                            onChange={importFromCsv}

                            id="file-csv"
                            type="file"
                            accept=".csv"
                            required
                            style={{ display: "none" }}
                        />
                    </div>
                </div>
                <Table dataSource={sortedTransactions} columns={columns} />;
            </div>
        </div>
    )
}

export default TransactionTable
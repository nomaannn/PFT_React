import React, { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import Cards from '../components/Cards.jsx/Cards'
import moment from 'moment'
import AddIncomeModal from '../components/Modal/AddIncomeModal';
import AddExpenseModal from '../components/Modal/AddExpenseModal';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import TransactionTable from '../components/TransactionTable/TransactionTable';
import Chart from '../components/Charts/Chart';
import NoTransactions from '../components/NoTransation/NoTransaction';
import ChartJS from '../components/CChartJS';

function Dashboard() {
    const [user] = useAuthState(auth)
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expense, setExpenses] = useState(0);
    const [loading, setLoading] = useState(0);
    const [resetVal, setResetVal] = useState(0);

    const showExpenseModal = () => {
        setIsExpenseModalVisible(true);
    };

    const showIncomeModal = () => {
        setIsIncomeModalVisible(true);
    };

    const handleExpenseCancel = () => {
        console.log("clicked cancel")
        setIsExpenseModalVisible(false);
    };

    const handleIncomeCancel = () => {
        setIsIncomeModalVisible(false);
    };



    const onFinish = (values, type) => {
        const newTransaction = {
            type: type,
            date: values.date.format("YYYY-MM-DD"),
            amount: parseFloat(values.amount),
            tag: values.tag,
            name: values.name,
        };

        setTransactions([...transactions, newTransaction]);
        setIsExpenseModalVisible(false);
        setIsIncomeModalVisible(false);
        addTransaction(newTransaction);
        calculateBalance();
    }


    async function addTransaction(transaction, many) {
        try {
            const docRef = await addDoc(
                collection(db, `users/${user.uid}/transactions`),
                transaction
            );
            console.log("Document written with ID: ", docRef.id);
            if (!many) {
                toast.success("Transaction Added!");
            }
        } catch (e) {
            console.error("Error adding document: ", e);
            if (!many) {
                toast.error("Couldn't add transaction");
            }
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [user])

    useEffect(() => {
        calculateBalance();
    }, [transactions]);
    async function fetchTransactions() {
        setLoading(true);
        if (user) {
            const q = query(collection(db, `users/${user.uid}/transactions`));
            const querySnapshot = await getDocs(q);
            let transactionsArray = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                transactionsArray.push(doc.data());
                console.log(transactions)
            });
            setTransactions(transactionsArray);
            toast.success("Transactions Fetched!");
        }
        setLoading(false);
    }


    const calculateBalance = () => {
        let incomeTotal = 0;
        let expensesTotal = 0;

        transactions.forEach((transaction) => {
            if (transaction.type === "income") {
                incomeTotal += transaction.amount;
            } else {
                expensesTotal += transaction.amount;
            }
        });

        setIncome(incomeTotal);
        setExpenses(expensesTotal);
        setCurrentBalance(incomeTotal - expensesTotal);
        setResetVal(incomeTotal - expensesTotal)
    };


    let sortedtransacion = transactions.sort((a, b) => {
        return new Date(a.Date) - new Date(b.Date)
    })

    function reset() {
        console.log(resetVal)
        // setResetVal(0)
        // setIncome(0)
        // setExpenses(0)
    }

    return (
        <div>
            <Header />
            <Cards
                reset={reset}
                showExpenseModal={showExpenseModal}
                showIncomeModal={showIncomeModal}
                income={income}
                expense={expense}
                currentBalance={currentBalance}
            />

            <AddIncomeModal
                isIncomeModalVisible={isIncomeModalVisible}
                handleIncomeCancel={handleIncomeCancel}
                onFinish={onFinish}
            />



            <AddExpenseModal
                isExpenseModalVisible={isExpenseModalVisible}
                handleExpenseCancel={handleExpenseCancel}
                onFinish={onFinish}

            />
            {transactions.length === 0 ? (
                <NoTransactions />
            ) : 
            // (<ChartJS sortedtransacion={sortedtransacion}/>)
            (<Chart sortedtransacion={sortedtransacion} currentBalance={currentBalance} />)
            }

            <TransactionTable
                transactions={transactions}
                addTransaction={addTransaction}
                fetchTransactions={fetchTransactions}
            />
        </div>
    )
}

export default Dashboard
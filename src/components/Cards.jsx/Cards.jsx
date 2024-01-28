import React from 'react';
import { Card, Col, Row } from 'antd';
import Button from '../Button/Button'
import './style.css'
const Cards = ({ reset, showExpenseModal, showIncomeModal, income, expense, currentBalance }) => (
    <Row className='my_row'>
        <Card className='my_card' title="Current Balance">
            <p>₹ {currentBalance}</p>
            <Button text="Reset Balance" blue={true} onClick={reset} />
        </Card>
        <Card className='my_card' title="Income">
            <p>₹ {income}</p>
            <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>
        <Card className='my_card' title="Expense">
            <p>₹ {expense}</p>
            <Button text="Add Expence" blue={true} onClick={showExpenseModal} />
        </Card>
    </Row>
);
export default Cards;
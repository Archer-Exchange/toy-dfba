// frontend/src/components/OrderBook.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderBook.css';

interface Order {
    id: string;
    orderType: string;
    side: string;
    price: number;
    quantity: number;
    filledQuantity: number;
}

export const OrderBook: React.FC = () => {
    const [bidOrders, setBidOrders] = useState<Order[]>([]);
    const [askOrders, setAskOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/orders');
                setBidOrders(response.data.bidOrders);
                setAskOrders(response.data.askOrders);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 1000);

        return () => clearInterval(interval);
    }, []);

    const renderOrders = (orders: Order[], side: string) => {
        const sorted = [...orders].sort((a, b) => b.price - a.price);

        const sliced = sorted.slice(0, 10);
        const maxQuantity = sliced.length > 0 ? Math.max(...sliced.map(o => o.quantity)) : 1;

        // Create placeholder rows if less than 10 orders
        const rows = [];
        for (let i = 0; i < 10; i++) {
            if (i < sliced.length) {
                const order = sliced[i];
                const depthPercentage = (order.quantity / maxQuantity) * 100;
                rows.push(
                    <div key={order.id} className={`order-row ${side}`}>
                        <div
                            className={`depth-bar ${side}`}
                            style={{ width: `${depthPercentage}%` }}
                        ></div>
                        <span className="price">{order.price.toFixed(2)}</span>
                        <span className="quantity">{order.quantity}</span>
                        <span className="type">{order.orderType}</span>
                    </div>
                );
            } else {
                rows.push(
                    <div key={`empty-${i}`} className={`order-row ${side} empty`}>
                        <span className="price">-</span>
                        <span className="quantity">-</span>
                        <span className="type">-</span>
                    </div>
                );
            }
        }
        return rows;
    };

    return (
        <div className="order-book">
            <h2>Order Book</h2>
            <div className="order-book-header">
                <span>Price</span>
                <span>Quantity</span>
                <span>Type</span>
            </div>
            <div className="asks">
                <h3>Asks</h3>
                {renderOrders(askOrders, 'ask')}
            </div>
            <div className="spread-divider"></div>
            <div className="bids">
                <h3>Bids</h3>
                {renderOrders(bidOrders, 'bid')}
            </div>
        </div>
    );
};
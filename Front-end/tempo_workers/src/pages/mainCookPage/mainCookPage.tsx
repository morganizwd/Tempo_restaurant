import React, { useEffect } from 'react';
import "./mainCookPage.scss";
import { useGlobalStore } from '../../shared/state/globalStore';
import SingleOrderComponent from '../../components/SingleOrderComponent/SingleOrderComponent';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

const MainCookPage: React.FC = () => {
    const { orders, fetchOrders, currentUser } = useGlobalStore();

    useEffect(() => {
        console.log('Current User:', currentUser); // Логируем текущего пользователя
        if (currentUser?.cook?.id) {
            console.log('Cook ID:', currentUser.cook.id); // Логируем cookId
            fetchOrders(currentUser.cook.id);
        } else {
            console.log('Current user or cook is not defined');
        }
    }, [currentUser]);
    
    useEffect(() => {
        console.log('Fetched orders:', orders); // Логируем заказы после их получения
    }, [orders]);
    
    let orderList = [] as ReactJSXElement[];
    
    orders.forEach(order => {
        console.log('Order:', order); // Логируем каждый заказ
        if (!order.id) {
            console.error('Order is missing an id:', order);
        }
        orderList.push(<SingleOrderComponent order={order} key={order.id} />);
    });
    
    return (
        <div id='orderContainer'>
            {orderList.length > 0 ? orderList : <p>No orders available</p>}
        </div>
    );
}

export default MainCookPage;
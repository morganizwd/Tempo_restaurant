import { Paper } from '@mui/material'
import React, { useEffect } from 'react'
import "./mainWaiterPage.scss";
import { useGlobalStore } from '../../shared/state/globalStore';
import SingleOrderComponent from '../../components/SingleOrderComponent/SingleOrderComponent';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

const MainWaiterPage = () => {
  const { orders, fetchOrders, currentUser } = useGlobalStore();

  useEffect(() => {
    fetchOrders(currentUser!.waiter.id!);
  }, [])

  let orderList = [] as ReactJSXElement[];

  orders.forEach(order => orderList.push(<SingleOrderComponent order={order} key={order.id} />));

  return (
    <div id='orderContainer'>
      {orderList}
    </div>
  )
}

export default MainWaiterPage
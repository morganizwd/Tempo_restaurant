import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import React, { useEffect } from 'react'
import SingleOrderComponent from '../../components/SingleOrderComponent/SingleOrderComponent';
import { useGlobalStore } from '../../shared/state/globalStore';

const MainCookPage = () => {
  const { orders, fetchCookOrders, currentUser } = useGlobalStore();

  useEffect(() => {
    fetchCookOrders(currentUser!.cook.id!);
  }, [])

  let orderList = [] as ReactJSXElement[];

  orders.forEach(order => orderList.push(<SingleOrderComponent order={order} key={order.id} />));

  return (
    <div id='orderContainer'>
      {orderList}
    </div>
  )
}

export default MainCookPage
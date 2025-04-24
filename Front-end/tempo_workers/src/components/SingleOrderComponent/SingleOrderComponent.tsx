import React from 'react'
import OrderType from '../../shared/types/order'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider';
import './singleOrderComponent.scss'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import OrderStatus from '../../shared/types/orderStateEnum';
import DishOrderType from '../../shared/types/dishOrder';
import TablewareDishType from '../../shared/types/tablewareDish';

const SingleOrderComponent = (props: { order: OrderType }) => {
  if (props.order === undefined) {
    return (
      <Paper className='orderComp'></Paper>
    )
  }
  let dishes = [] as ReactJSXElement[];
  let drinks = [] as ReactJSXElement[];
  let tableware = getTablewareList(props.order.dishes);
  let header = {} as ReactJSXElement;

  props.order.dishes.forEach(dish => dishes.push(<p style={{ margin: '0.5rem' }}
    key={dish.dish.id}>{dish.dish.name} x {dish.number}</p>));
  props.order.drinks.forEach(drink => drinks.push(<p style={{ margin: '0.5rem' }}
    key={drink.drink.id}>{drink.drink.name} x {drink.number}</p>));
  
  if(props.order.status == OrderStatus.Ordered) header = <div className='ordered'></div>
  if(props.order.status == OrderStatus.Cooking) header = <div className='cooking'></div>
  if(props.order.status == OrderStatus.Delivering) header = <div className='delivering'></div>
  if(props.order.status == OrderStatus.Ready) header = <div>Ready</div>
  
  return (
    <Paper className='orderComp'>
      {header}
      <p style={{margin: '0.5rem'}}>Стол №{props.order.table.number}</p>
      <Divider variant="middle" sx={{ borderColor: 'black' }} />
      <p style={{margin: '0.5rem'}}>Блюда:</p>
      {dishes}
      <Divider variant="middle" sx={{ borderColor: 'black' }} />
      <p style={{margin: '0.5rem'}}>Напитки:</p>
      {drinks}
      <Divider variant="middle" sx={{ borderColor: 'black' }} />
      <p style={{margin: '0.5rem'}}>Приборы:</p>
      {tableware}
    </Paper>
  )
}

function getTablewareList(dishes: DishOrderType[]) : ReactJSXElement[] {
  let tableware = [] as ReactJSXElement[];
  const tablewareMap = new Map<string, TablewareDishType>();

  dishes.forEach(dishItem => {
    const dishMultiplier = dishItem.number; // Number of this dish ordered
    
    dishItem.dish.tablewareList.forEach(tablewareItem => {
      const existing = tablewareMap.get(tablewareItem.tableware.type);
      
      if (existing) {
        // If tableware already exists in our map, add to the quantity
        existing.number += tablewareItem.number * dishMultiplier;
      } else {
        // If new tableware, add to our map
        tablewareMap.set(tablewareItem.tableware.type, {
          ...tablewareItem,
          number: tablewareItem.number * dishMultiplier
        });
      }
    });
  });

  Array.from(tablewareMap.values()).forEach(t => tableware.push(<p style={{ margin: '0.5rem' }}
    key={t.tableware.id}>{t.tableware.type} x {t.number}</p>));
  
  return tableware;
}

export default SingleOrderComponent
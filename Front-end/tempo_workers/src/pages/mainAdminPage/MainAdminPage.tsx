import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import "./mainAdminPage.scss";
import PeopleIcon from '@mui/icons-material/People';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import CoffeeRoundedIcon from '@mui/icons-material/CoffeeRounded';
import KitchenRoundedIcon from '@mui/icons-material/KitchenRounded';
import { useGlobalStore, resetGlobalStore } from '../../shared/state/globalStore';
import MainModule from '../../modules/mainModule/MainModule';
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useState } from 'react';

export default function NestedList() {
  const { cooks, fetchCooks } = useGlobalStore();
  const { waiters, fetchWaiters } = useGlobalStore();

  const [limit, setLimit] = React.useState(5);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    fetchCooks(page, limit);
    fetchWaiters(page, limit);
  }, [page, limit]);

  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const [openEmployees, setOpenEmployees] = useState(false);
  const [openDishes, setOpenDishes] = useState(false);

  const handleToggleEmployees = () => {
    setOpenEmployees(!openEmployees);
  };

  const handleToggleDishes = () => {
    setOpenDishes(!openDishes);
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  return (
      <div className='Container'>
        <List className='secondary_color ' id='side_menu'>
          <ListItemButton onClick={handleToggleEmployees}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Сотрудники" />
            {openEmployees ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openEmployees} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemText primary="Повара" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemText primary="Официанты" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Блюда */}
          <ListItemButton onClick={handleToggleDishes}>
            <ListItemIcon>
              <LunchDiningIcon />
            </ListItemIcon>
            <ListItemText primary="Блюда" />
            {openDishes ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openDishes} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemText primary="Блюда" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
              >
                <ListItemText primary="Ингредиенты" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton selected={selectedIndex === 5}
            onClick={(event) => handleListItemClick(event, 5)}>
            <ListItemIcon>
              <CoffeeRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Напитки" />
          </ListItemButton>

          <ListItemButton selected={selectedIndex === 6}
            onClick={(event) => handleListItemClick(event, 6)}>
            <ListItemIcon>
              <KitchenRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Ингредиенты" />
        </ListItemButton>
        
        <ListItemButton
            onClick={(event) => resetGlobalStore()}>
            <ListItemIcon>
              <AccountCircleRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Выйти" />
          </ListItemButton>
        </List>

        <div style={{marginLeft: '20vw', marginRight: '5vw'}}>
          <MainModule selectedIndex={selectedIndex} />
        </div>

      </div>
  );
}
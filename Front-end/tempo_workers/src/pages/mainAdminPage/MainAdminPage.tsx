import * as React from 'react';
import { Nav, Card } from 'react-bootstrap';
import { 
  People, 
  CupHot, 
  Wrench, 
  Image,
  PersonBadge,
  EggFried
} from 'react-bootstrap-icons';
import Header from "../../modules/header/Header";
import Footer from "../../modules/footer/Footer";
import "./mainAdminPage.scss";
import { useGlobalStore } from '../../shared/state/globalStore';
import MainModule from '../../modules/mainModule/MainModule';
import EmployeeType from '../../shared/types/employee';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainAdminPage() {
  const { cooks, fetchCooks, waiters, fetchWaiters } = useGlobalStore();
  const navigate = useNavigate();

  const [limit, setLimit] = React.useState(5);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    fetchCooks(page, limit);
    fetchWaiters(page, limit);
  }, [page, limit]);

  const [selectedIndex, setSelectedIndex] = useState(1);
  const [openEmployees, setOpenEmployees] = useState(false);
  const [openDishes, setOpenDishes] = useState(false);

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  const menuItems = [
    {
      id: 1,
      label: "Повара",
      icon: PersonBadge,
      parent: "employees",
      onClick: () => handleListItemClick(1)
    },
    {
      id: 2,
      label: "Официанты",
      icon: PersonBadge,
      parent: "employees",
      onClick: () => handleListItemClick(2)
    },
    {
      id: 3,
      label: "Блюда",
      icon: EggFried,
      parent: "dishes",
      onClick: () => handleListItemClick(3)
    },
    {
      id: 4,
      label: "Ингредиенты",
      icon: Wrench,
      parent: "dishes",
      onClick: () => handleListItemClick(4)
    },
    {
      id: 5,
      label: "Напитки",
      icon: CupHot,
      onClick: () => handleListItemClick(5)
    },
    {
      id: 6,
      label: "Ингредиенты",
      icon: Wrench,
      onClick: () => handleListItemClick(6)
    },
    {
      id: 7,
      label: "AI Посты",
      icon: Image,
      onClick: () => navigate('/PostPage')
    }
  ];

  return (
    <div className="dishes-wallpaper">
      <div className="menu-board">
        <Header />
        <div id="content">
            <Card className="sidebar-card">
          <Card.Body className="p-0">
            <Nav className="flex-column sidebar-nav">
              <Nav.Item className="sidebar-section">
                <Nav.Link 
                  className="sidebar-section-header"
                  onClick={() => setOpenEmployees(!openEmployees)}
                >
                  <People className="me-2" />
                  <span>Сотрудники</span>
                  <span className="ms-auto">{openEmployees ? '−' : '+'}</span>
                </Nav.Link>
                {openEmployees && (
                  <div className="sidebar-submenu">
                    {menuItems.filter(item => item.parent === "employees").map(item => (
                      <Nav.Link
                        key={item.id}
                        className={`sidebar-item ${selectedIndex === item.id ? 'active' : ''}`}
                        onClick={item.onClick}
                      >
                        <item.icon className="me-2" />
                        {item.label}
                      </Nav.Link>
                    ))}
                  </div>
                )}
              </Nav.Item>

              <Nav.Item className="sidebar-section">
                <Nav.Link 
                  className="sidebar-section-header"
                  onClick={() => setOpenDishes(!openDishes)}
                >
                  <EggFried className="me-2" />
                  <span>Блюда</span>
                  <span className="ms-auto">{openDishes ? '−' : '+'}</span>
                </Nav.Link>
                {openDishes && (
                  <div className="sidebar-submenu">
                    {menuItems.filter(item => item.parent === "dishes").map(item => (
                      <Nav.Link
                        key={item.id}
                        className={`sidebar-item ${selectedIndex === item.id ? 'active' : ''}`}
                        onClick={item.onClick}
                      >
                        <item.icon className="me-2" />
                        {item.label}
                      </Nav.Link>
                    ))}
                  </div>
                )}
              </Nav.Item>

              {menuItems.filter(item => !item.parent).map(item => (
                <Nav.Item key={item.id}>
                  <Nav.Link
                    className={`sidebar-item ${selectedIndex === item.id ? 'active' : ''}`}
                    onClick={item.onClick}
                  >
                    <item.icon className="me-2" />
                    {item.label}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Card.Body>
        </Card>

          <div className="main-content">
            <MainModule selectedIndex={selectedIndex} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

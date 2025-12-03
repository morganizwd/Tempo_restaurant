import React, { useEffect, useState } from "react";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { Plus, Dash, CartCheck } from "react-bootstrap-icons";
import "./CartPage.scss";
import Header from "../../modules/header/Header";
import Footer from "../../modules/footer/Footer";
import { useGlobalStore } from "../../shared/state/globalStore";
import CartItemComponent from "../../components/CartComponents/CartItemComponent/CartItemComponent";

const CartPage = () => {
  const { cart, countPrice, countTime, tables, fetchTables, postOrder } =
    useGlobalStore();
  const [peopleNumber, setPeopleNumber] = useState(1);
  const [table, setTable] = useState("");

  useEffect(() => {
    fetchTables();
  }, []);

  const sortedCart = Object.fromEntries(
    Object.entries(cart).sort(([a], [b]) => (a > b ? -1 : 1))
  );

  const cartItems = Object.keys(sortedCart).map((key) => (
    <CartItemComponent item={sortedCart[key]} key={key} />
  ));

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(event.target.value) || 0;
    if (newValue < 0) {
      newValue = 0;
    }
    setPeopleNumber(newValue);
  };

  const handleIncrement = () => {
    setPeopleNumber((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setPeopleNumber((prev) => Math.max(0, prev - 1));
  };

  const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTable(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (table !== "") {
      postOrder(Number.parseInt(table), peopleNumber);
    }
  };

  return (
    <Container fluid className="Container cart-page">
      <div id="content">
        <div className="cart-wallpaper">
          <div className="menu-board">
            <div id="cart">
              <div className="cart-header">
                <h2 className="cart-title">Корзина</h2>
              </div>

          <div className="cart-items-wrapper">
            {cartItems.length > 0 ? (
              cartItems
            ) : (
              <div className="empty-cart">
                <CartCheck className="empty-cart-icon" />
                <p>Ваша корзина пуста</p>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <>
              <div className="cart-summary">
                <div className="summary-row">
                  <span className="summary-label">Итого:</span>
                  <span className="summary-value">{countPrice()} р</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Примерное время готовности:</span>
                  <span className="summary-value">{countTime()} мин</span>
                </div>
              </div>

              <Form onSubmit={handleSubmit} className="cart-form-section">
                <Form.Group className="mb-4">
                  <Form.Label>Количество людей</Form.Label>
                  <div className="people-number-control">
                    <div className="quantity-control">
                      <Button
                        variant="outline-secondary"
                        onClick={handleDecrement}
                        disabled={peopleNumber === 0}
                      >
                        <Dash />
                      </Button>
                      <Form.Control
                        type="number"
                        value={peopleNumber}
                        onChange={handleNumberChange}
                        min="0"
                        className="text-center"
                      />
                      <Button variant="outline-secondary" onClick={handleIncrement}>
                        <Plus />
                      </Button>
                    </div>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Выберите стол</Form.Label>
                  <div className="table-select-wrapper">
                    <Form.Select
                      value={table}
                      onChange={handleTableChange}
                      required
                    >
                      <option value="">Выберите стол...</option>
                      {tables.map((tableItem, i) => (
                        <option key={tableItem.id} value={`${i}`}>
                          Стол №{tableItem.number} на {tableItem.max_people} человек
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>

                <div className="submit-button-wrapper">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={table === ""}
                    className="d-flex align-items-center justify-content-center gap-2 mx-auto"
                  >
                    <CartCheck size={20} />
                    Оформить заказ
                  </Button>
                </div>
              </Form>
            </>
          )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CartPage;

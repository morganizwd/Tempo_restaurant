import React, { useEffect, useState } from "react";
import { Card, Button, InputGroup, Form } from "react-bootstrap";
import { Plus, Dash, Clock } from "react-bootstrap-icons";
import DishType from "../../../shared/types/dish";
import { IKImage } from "imagekitio-react";
import { useGlobalStore } from "../../../shared/state/globalStore";
import "./DishComponent.scss";

interface Props {
  dish?: DishType;
}

const DishComponent = ({ dish }: Props) => {
  if (dish == null) {
    return <></>;
  }

  const { setNum, addToCart, decrementInCart, cart } = useGlobalStore();
  const [quantity, setQuantity] = useState(cart[dish.id]?.num || 0);

  useEffect(() => {
    setQuantity(cart[dish.id]?.num || 0);
  }, [cart, dish.id]);

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(event.target.value) || 0;
    if (newValue < 0) {
      newValue = 0;
    }
    setNum(newValue, dish);
    setQuantity(newValue);
  };

  const handleIncrement = () => {
    addToCart(dish);
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    decrementInCart(dish);
    setQuantity((prev) => Math.max(0, prev - 1));
  };

  return (
    <Card className="dish-card">
      <div className="dish-image-wrapper">
        {dish.photo ? (
          <IKImage
            path={dish.photo}
            className="dish-image"
            transformation={[{ width: 400, height: 300, crop: "fill" }]}
          />
        ) : (
          <img
            src="./src/shared/assets/default_food.png"
            alt={dish.name}
            className="dish-image"
          />
        )}
        <div className="dish-time-badge">
          <Clock size={14} />
          <span>{dish.approx_time} {"\u043c\u0438\u043d"}</span>
        </div>
      </div>
      
      <Card.Body className="dish-body">
        <Card.Title className="dish-name">{dish.name}</Card.Title>
        <Card.Text className="dish-price">
          {dish.price} <span className="currency">{"\u0440\u0443\u0431."}</span>
        </Card.Text>
        
        <div className="dish-actions">
          {quantity > 0 ? (
            <InputGroup className="quantity-control">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleDecrement}
                className="quantity-btn"
              >
                <Dash />
              </Button>
              <Form.Control
                type="number"
                value={quantity}
                onChange={handleNumberChange}
                min="0"
                className="quantity-input"
              />
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleIncrement}
                className="quantity-btn"
              >
                <Plus />
              </Button>
            </InputGroup>
          ) : (
            <Button
              variant="primary"
              onClick={handleIncrement}
              className="add-to-cart-btn"
            >
              <Plus className="me-2" />
              {"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c"}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default DishComponent;

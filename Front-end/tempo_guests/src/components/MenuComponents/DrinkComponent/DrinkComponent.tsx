import React, { useEffect, useState } from "react";
import { Card, Button, InputGroup, Form } from "react-bootstrap";
import { Plus, Dash } from "react-bootstrap-icons";
import DrinkType from "../../../shared/types/drink";
import { IKImage } from "imagekitio-react";
import { useGlobalStore } from "../../../shared/state/globalStore";
import "./DrinkComponent.scss";

interface Props {
  drink?: DrinkType;
}

const DrinkComponent = ({ drink }: Props) => {
  if (drink == null) {
    return <></>;
  }

  const { setNum, addToCart, decrementInCart, cart } = useGlobalStore();
  const [quantity, setQuantity] = useState(cart[drink.id]?.num || 0);

  useEffect(() => {
    setQuantity(cart[drink.id]?.num || 0);
  }, [cart, drink.id]);

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(event.target.value) || 0;
    if (newValue < 0) {
      newValue = 0;
    }
    setNum(newValue, drink);
    setQuantity(newValue);
  };

  const handleIncrement = () => {
    addToCart(drink);
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    decrementInCart(drink);
    setQuantity((prev) => Math.max(0, prev - 1));
  };

  return (
    <Card className="drink-card">
      <div className="drink-image-wrapper">
        {drink.photo ? (
          <IKImage
            path={drink.photo}
            className="drink-image"
            transformation={[{ width: 400, height: 300, crop: "fill" }]}
          />
        ) : (
          <img
            src="./src/shared/assets/default_food.png"
            alt={drink.name}
            className="drink-image"
          />
        )}
      </div>
      
      <Card.Body className="drink-body">
        <Card.Title className="drink-name">{drink.name}</Card.Title>
        <Card.Text className="drink-price">
          {drink.price} <span className="currency">{"\u0440\u0443\u0431."}</span>
        </Card.Text>
        
        <div className="drink-actions">
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

export default DrinkComponent;

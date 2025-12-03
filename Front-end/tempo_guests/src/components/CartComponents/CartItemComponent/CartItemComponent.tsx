import React from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Plus, Dash } from "react-bootstrap-icons";
import "./CartItemComponent.scss";
import CartItem from "../../../shared/types/CartItem";
import { useGlobalStore } from "../../../shared/state/globalStore";
import { IKImage } from "imagekitio-react";

const CartItemComponent = ({ item }: { item: CartItem }) => {
  const { setNum, addToCart, decrementInCart } = useGlobalStore();

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(event.target.value) || 0;
    if (newValue < 0) {
      newValue = 0;
    }
    setNum(newValue, item.item);
  };

  const handleIncrement = () => {
    addToCart(item.item);
  };

  const handleDecrement = () => {
    decrementInCart(item.item);
  };

  return (
    <div className="CartItemComponent">
      {item.item.photo ? (
        <IKImage
          className="cart_photo"
          path={item.item.photo}
          transformation={[{ width: 200, height: 200, crop: "fill" }]}
        />
      ) : (
        <img
          className="cart_photo"
          src="./src/shared/assets/default_food.png"
          alt={item.item.name}
        />
      )}
      
      <div className="cart_info">
        <p className="cart_name">{item.item.name}</p>
        <p className="cart_price">
          {item.item.price} <span className="currency">р</span>
        </p>
      </div>
      
      <div className="cart_number">
        <InputGroup className="quantity-control">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleIncrement}
            className="quantity-btn"
          >
            <Plus />
          </Button>
          <Form.Control
            type="number"
            value={item.num}
            onChange={handleNumberChange}
            min="0"
            className="quantity-input"
          />
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleDecrement}
            className="quantity-btn"
          >
            <Dash />
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default CartItemComponent;

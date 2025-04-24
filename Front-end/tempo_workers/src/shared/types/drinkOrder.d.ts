import DrinkType from "./drink";
import OrderType from "./order";

declare module "DrinkOrderType"

type DrinkOrderType = {
    drink: DrinkType;
    order: OrderType;
    number: number;
}

export default DrinkOrderType
import DishType from "./dishes";
import OrderType from "./order";

declare module "DishOrderType"

type DishOrderType = {
    dish: DishType;
    order: OrderType;
    number: number;
}

export default DishOrderType
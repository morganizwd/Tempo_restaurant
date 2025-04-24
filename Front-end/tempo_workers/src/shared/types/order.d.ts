import DishOrderType from "./dishOrder";
import DrinkOrderType from "./drinkOrder";
import TableType from "./table";

declare module "OrderType"

type OrderType = {
    id?: string;
    people_num: number;
    status: number;
    table: TableType;
    user: string;
    dishes: DishOrderType[];
    drinks: DrinkOrderType[];
}

export default OrderType
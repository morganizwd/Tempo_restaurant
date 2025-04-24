import DishType from "./dishes";
import TablewareType from "./tableware";

declare module "TablewareDishType"

type TablewareDishType = {
    dish: DishType;
    tableware: TablewareType;
    number: number;
}

export default TablewareDishType
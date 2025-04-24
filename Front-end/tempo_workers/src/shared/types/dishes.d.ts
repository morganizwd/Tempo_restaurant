import CategoryType from "./category";
import TablewareDishType from "./tablewareDish";

declare module "DishType"

type DishType = {
    id?: string;
    name: string;
    approx_time: number;
    price: string;
    category: CategoryType;
    categoryId: string;
    tablewareList: TablewareDishType[];
}

export default DishType
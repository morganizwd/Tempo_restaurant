import React from "react";
import CategoryType from "../../shared/types/category";
import DishComponent from "../../components/MenuComponents/DishComponent/DishComponent";
import DrinkComponent from "../../components/MenuComponents/DrinkComponent/DrinkComponent";
import "./CategoryModule.scss";

interface Props {
  category?: CategoryType;
}

const CategoryModule = ({ category }: Props) => {
  if (category == null) {
    return <></>;
  }
  
  return (
    <div className="food_category">
      <h2 className="category_name">{category.name}</h2>
      <div className="category-items">
        {category.dishes.map((dish) => {
          return <DishComponent dish={dish} key={dish.id} />;
        })}
        {category.drinks.map((drink) => {
          return <DrinkComponent drink={drink} key={drink.id} />;
        })}
      </div>
    </div>
  );
};

export default CategoryModule;

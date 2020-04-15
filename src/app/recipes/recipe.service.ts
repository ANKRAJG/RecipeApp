import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {

    // Make this recipes array as 'private', so that you can't directly access it from outside
    private recipes: Recipe[] = [
        new Recipe('Spicy Pasta', 'Its a great Pasta Recipe!', '../../assets/images/recipe-pasta.jpg',
            [
                new Ingredient('Potatoes', 2),
                new Ingredient('Tomatoes', 4)
            ]),
        new Recipe('Big Kahuna Burger', 'Its a great Burger Recipe!', '../../assets/images/burger.jfif',
            [
                new Ingredient('Buns', 4),
                new Ingredient('Potatoes', 2),
                new Ingredient('Cheese', 2)
            ])
    ];

    getRecipes() {
        // Add slice, so that we shouldn't change the recipes array from outside
        // It returns the exact copy of recipes
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    constructor(private slService: ShoppingListService) {}

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }
}
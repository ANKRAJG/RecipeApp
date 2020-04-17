import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({providedIn: 'root'})
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

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
        this.recipesChanged.next(this.recipes.slice());
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}
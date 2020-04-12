import { EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';

export class RecipeService {
    /* You can also Encapsulate this property 'recipeSelected' by providing a method 
       to get access to it, once u emit the event */
    // recipeSelected is basically and event emitted from this service
    recipeSelected = new EventEmitter<Recipe>();

    // Make this recipes array as 'private', so that you can't directly access it from outside
    private recipes: Recipe[] = [
        new Recipe('Spicy Pasta', 'Its a great Pasta Recipe!', '../../assets/images/recipe-pasta.jpg'),
        new Recipe('Burger', 'Its a great Burger Recipe!', '../../assets/images/burger.jfif')
    ];

    getRecipes() {
        // Add slice, so that we shouldn't change the recipes array from outside
        // It returns the exact copy of recipes
        return this.recipes.slice();
    }
}
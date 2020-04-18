import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({providedIn: 'root'})
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    // Make this recipes array as 'private', so that you can't directly access it from outside
    private recipes: Recipe[] = [
        // new Recipe('Spicy Pasta', 'Its a great Pasta Recipe!', '../../assets/images/recipe-pasta.jpg',
        //     [
        //         new Ingredient('Potatoes', 2),
        //         new Ingredient('Tomatoes', 4)
        //     ]),
        // new Recipe('Big Kahuna Burger', 'Its a great Burger Recipe!', '../../assets/images/burger.jfif',
        //     [
        //         new Ingredient('Buns', 4),
        //         new Ingredient('Potatoes', 2),
        //         new Ingredient('Cheese', 2)
        //     ])
    ];

    constructor(private slService: ShoppingListService,
                private http: HttpClient) {}

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
    }

    getRecipes() {
        // Add slice, so that we shouldn't change the recipes array from outside
        // It returns the exact copy of recipes
        return this.recipes.slice();
    }

    getAllRecipesFromServer() {
        return this.http
            .get<{ [key: string]: Recipe }>('https://recipe-app-94551.firebaseio.com/recipes.json')
            .pipe(
                map(response => {
                    const recipeArr: Recipe[] = [];
                    for(const key in response) {
                        if(response.hasOwnProperty(key)) {
                            recipeArr.push({ ...response[key], recipeId: key});
                        }
                    }
                    return recipeArr;
                })
            );
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
        this.recipesChanged.next(this.recipes.slice());
    }

    addRecipe(recipe: Recipe) {
        // this.recipes.push(recipe);
        // this.recipesChanged.next(this.recipes.slice());
        return this.http.post<{ name: string }>('https://recipe-app-94551.firebaseio.com/recipes.json', recipe);
    }

    updateRecipe(recipeId: string, newRecipe: Recipe) {
        return this.http.put<Recipe>('https://recipe-app-94551.firebaseio.com/recipes/' + recipeId + '.json', newRecipe);
    }

    deleteRecipe(recipeId: string) {
        return this.http.delete<any>('https://recipe-app-94551.firebaseio.com/recipes/' + recipeId + '.json');
    }
}
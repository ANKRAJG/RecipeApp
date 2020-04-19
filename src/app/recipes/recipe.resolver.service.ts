import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]> {
    constructor(private recipeService: RecipeService) {}

    // This resolver function is for recipeDetail and RecipeDetailEdit component for case initial load
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes = this.recipeService.getRecipes();

        // get recipes from server only when you dont have it
        if(recipes.length === 0) {
            return this.recipeService.getAllRecipesFromServer();
        } else {
            return recipes;
        }
    }
}
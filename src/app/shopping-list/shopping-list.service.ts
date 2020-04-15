import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';


/* This Injectable code is used to Add this Service at the root level.
   This is same as 
    export class ShoppingListService { ... }
    and
    import { ShoppingListService } from './path/to/my.service';
 
    @NgModule({
      ...
      providers: [ShoppingListService]
    })
    export class AppModule { ... } */
@Injectable({providedIn: 'root'})
export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Tomatoes', 5),
        new Ingredient('Potatoes', 2)
    ];

    getIngredients() {
      return this.ingredients.slice();
    }

    getIngredient(index: number) {
      return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
      this.ingredients.push(ingredient);
      this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
      /* The downside of using this for loop is that, 
         we'll have to emit lot of ingredientsChanged events */
      // for(let ingredient of ingredients) {
      //   this.ingredients.push(ingredient);
      //   this.ingredientsChanged.emit(this.ingredients.slice());
      // }
      this.ingredients.push(...ingredients);
      this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngredient(index: number, newIng: Ingredient) {
      this.ingredients[index] = newIng;
      this.ingredientsChanged.next(this.ingredients.slice());
    }
}
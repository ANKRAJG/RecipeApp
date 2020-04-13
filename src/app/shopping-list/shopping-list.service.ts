import { EventEmitter, Injectable } from '@angular/core';
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
    ingredientsChanged = new EventEmitter<Ingredient[]>();

    private ingredients: Ingredient[] = [
        new Ingredient('Tomatoes', 5),
        new Ingredient('Potatoes', 2)
    ];

    getIngredients() {
      return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient) {
      this.ingredients.push(ingredient);
      this.ingredientsChanged.emit(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
      // The downside of using this for loop is that, we'll have to emit lot of ingredientsChanged events
      // for(let ingredient of ingredients) {
      //   this.ingredients.push(ingredient);
      //   this.ingredientsChanged.emit(this.ingredients.slice());
      // }
      this.ingredients.push(...ingredients);
      this.ingredientsChanged.emit(this.ingredients.slice());
    }
}
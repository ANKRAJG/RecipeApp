import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Ingredient } from '../shared/ingredient.model';
import { tap, map } from 'rxjs/operators';


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
    ingredientsChanged = new BehaviorSubject<Ingredient[]>(null);
    startedEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        // new Ingredient('Tomatoes', 5),
        // new Ingredient('Potatoes', 2)
    ];

    constructor(private http: HttpClient) {}

    setIngredients(ingredients: Ingredient[]) {
      this.ingredients = ingredients.slice();
    }

    getIngredients() {
      return this.ingredients;
    }

    getIngredientsFromServer() {
      return this.http.get<{[key: number]: Ingredient}>('https://recipe-app-94551.firebaseio.com/ingredients.json')
        .pipe(
          map(response => {
            const ingArr = [];
            for(const key in response) {
              if(response.hasOwnProperty(key) && response[key]) {
                ingArr.push({ ...response[key], ingredientId: key });
              }
            }
            return ingArr;
          })
        );
    }

    getIngredient(index: number) {
      return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
      let ingredients = this.ingredients.slice();
      ingredients.push(ingredient);
      this.addIngredientsToServer(ingredients).subscribe();
    }

    addIngredients(ingredientsToAdd: Ingredient[]) {
      /* The downside of using this for loop is that, 
         we'll have to emit lot of ingredientsChanged events */
      // for(let ingredient of ingredients) {
      //   this.ingredients.push(ingredient);
      //   this.ingredientsChanged.emit(this.ingredients.slice());
      // }
      let ingredientsOrig = this.ingredients.slice();
      ingredientsOrig.push(...ingredientsToAdd);
      return this.addIngredientsToServer(ingredientsOrig);
    }

    addIngredientsToServer(ingredients: Ingredient[]) {
      ingredients.map(item => {
        delete item.ingredientId;
        return item;
      });
      return this.http.put<Ingredient[]>('https://recipe-app-94551.firebaseio.com/ingredients.json', ingredients)
        .pipe(
          map(response => {
            const ingArr = [];
            for(const key in response) {
              if(response.hasOwnProperty(key) && response[key]) {
                ingArr.push({ ...response[key], ingredientId: key });
              }
            }
            return ingArr;
          }),
          tap(ingredients => {
            this.setIngredients(ingredients);
            this.ingredientsChanged.next(this.ingredients.slice());
          })
        );

    }

    updateIngredient(index: number, newIng: Ingredient) {
      let ingredientsCopy = this.ingredients.slice();
      ingredientsCopy[index] = newIng;
      this.addIngredientsToServer(ingredientsCopy).subscribe();
    }

    deleteIngredient(index: number, ingredientId: number) {
      this.http.delete<any>('https://recipe-app-94551.firebaseio.com/ingredients/' + ingredientId + '.json')
        .subscribe(response => {
          this.ingredients.splice(index, 1);
          this.ingredientsChanged.next(this.ingredients.slice());
        }, error => {
          console.log(error);
        });
    }

}
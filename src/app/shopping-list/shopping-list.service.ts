import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        // new Ingredient('Tomatoes', 5),
        // new Ingredient('Potatoes', 2)
    ];

    constructor(private http: HttpClient) {}

    setIngredients(ingredients: Ingredient[]) {
      this.ingredients = ingredients;
    }

    getIngredients() {
      return this.ingredients.slice();
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
      this.ingredients.push(ingredient);
      this.addIngredients(this.ingredients, 'forAddUpdate').subscribe();
    }

    addIngredients(ingredients: Ingredient[], type: string) {
      /* The downside of using this for loop is that, 
         we'll have to emit lot of ingredientsChanged events */
      // for(let ingredient of ingredients) {
      //   this.ingredients.push(ingredient);
      //   this.ingredientsChanged.emit(this.ingredients.slice());
      // }
      if(!type) {
        this.ingredients.push(...ingredients);
      }
      this.ingredients.map(item => {
        delete item.ingredientId;
        return item;
      });
      return this.http.put<Ingredient[]>('https://recipe-app-94551.firebaseio.com/ingredients.json', this.ingredients)
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
            this.ingredients = ingredients;
            this.ingredientsChanged.next(this.ingredients.slice());
          })
        );
    }

    updateIngredient(index: number, newIng: Ingredient) {
      this.ingredients[index] = newIng;
      this.addIngredients(this.ingredients, 'forAddUpdate').subscribe();
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
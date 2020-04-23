import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];
  //private igChangedSub: Subscription;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients();
    // this.igChangedSub = this.slService.ingredientsChanged
    //   .subscribe((ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   });
    
    if(this.ingredients.length === 0) {
      this.getIngredientsFromServer();
    }
  }

  // ngOnDestroy(): void {
  //   this.igChangedSub.unsubscribe();
  // }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }

  getIngredientsFromServer() {
    this.slService.getIngredientsFromServer()
      .subscribe(ingredients => {
        this.ingredients = ingredients;
        this.slService.setIngredients(this.ingredients);
        //this.slService.ingredientsChanged.next(ingredients);
      }, error => {
        console.log(error);
      });
  }
}

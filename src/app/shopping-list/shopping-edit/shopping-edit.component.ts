import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // In Angular 8+, we need to use @ViewChild('..', { static: false })
  @ViewChild('slForm', { static: false }) slForm: NgForm;
  editSubscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.editSubscription = this.slService.startedEditing
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index;
          this.editMode = true;
          this.editedItem = this.slService.getIngredient(index);
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          });
        }
      )
  }

  onSubmitItem(form: NgForm) {
    const value = form.value;
    // This syntax is when using class constructor for creating Ingredient model
    //const newIngredient = new Ingredient(value.name, value.amount);
    const newIngredient: Ingredient =  { name: value.name, amount: value.amount };
    if(this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClearForm() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDeleteItem() {
    this.slForm.reset();
    this.slService.deleteIngredient(this.editedItemIndex, this.editedItem.ingredientId);
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
  }
}

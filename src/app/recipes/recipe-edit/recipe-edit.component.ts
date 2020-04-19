import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, 
              private recipeService: RecipeService,
              private router: Router) { }

  // This onInit function gets called whenever the page gets loaded
  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = !!params['id'];
          this.initForm();
        }
      )
  }

  onSubmit() {
    /* This is how we can get new recipe from recipeform */
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['ingredients'],
    // );

    if(this.editMode) {
      this.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.addRecipe(this.recipeForm.value);
    }
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  addRecipe(recipe: Recipe) {
    this.recipeService.addRecipe(recipe)
      .subscribe(response => {
          recipe.recipeId = response.name;
          this.recipeService.updateRecipeList(recipe, null, 'add');
          this.onCancel();
      }, error => {
          console.log(error.message);
      });
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    const origNewRecipe = { ...newRecipe };
    delete newRecipe.recipeId;
    this.recipeService.updateRecipe(origNewRecipe.recipeId, newRecipe)
      .subscribe(response => {
          this.recipeService.updateRecipeList(origNewRecipe, index, 'update');
          this.onCancel();
      }, error => {
          console.log(error.message);
      });
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get ingredientControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  // This private function is responsible for initializing our form
  private initForm() {
    let recipeId = '', recipeName = '', recipeImagePath = '', recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeId = recipe.recipeId;
      recipeName =  recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if(recipe.ingredients) {
        for(let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          )
        }
      }
    }

    this.recipeForm = new FormGroup({
      'recipeId': new FormControl(recipeId),
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

}

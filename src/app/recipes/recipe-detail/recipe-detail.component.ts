import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    // This will only work for the first we load this component
    // But we want to change this id on click list-item click
    //const id = this.route.snapshot.params['id'];

    this.route.params
      .subscribe(
        (param: Params) => {
          // This '+' is used to cast it to number
          this.id = +param['id'];
          this.recipe = this.recipeService.getRecipe(this.id);
        }
      )
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.recipe.recipeId)
      .subscribe(response => {
          const recipes = this.recipeService.getRecipes();
          recipes.splice(this.id, 1);
          this.recipeService.setRecipes(recipes);
          this.recipeService.recipesChanged.next(recipes.slice());
          this.router.navigate(['/recipes'], {relativeTo: this.route});
      }, error => {
        console.log(error);
      });
  }

}

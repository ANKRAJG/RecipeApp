import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  isLoading = false;
  recipes: Recipe[];
  /* Created this recipesChangedSub to destroy it once the component is destroyed,
     to avoid memory leaks */
  //private recipesChangedSub: Subscription;

  constructor(private recipeService: RecipeService, 
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    // this.recipesChangedSub = this.recipeService.recipesChanged
    //   .subscribe((recipes: Recipe[]) => {
    //       this.recipes = recipes;
    //   });

    if(this.recipes.length === 0) {
      this.getAllRecipesFromServer();
    }
  }

  // ngOnDestroy():void {
  //   this.recipesChangedSub.unsubscribe();
  // }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  getAllRecipesFromServer() {
    this.isLoading = true;
    this.recipeService.getAllRecipesFromServer()
      .subscribe(recipes => {
        this.isLoading = false;
        this.recipes = recipes;
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
  }

}

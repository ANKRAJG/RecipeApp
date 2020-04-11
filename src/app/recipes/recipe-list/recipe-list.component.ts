import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('Pasta', 'Its a great Pasta Recipe!', '../../assets/images/recipe-pasta.jpg'),
    new Recipe('Pasta', 'Its a great Pasta Recipe!', '../../assets/images/recipe-pasta.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

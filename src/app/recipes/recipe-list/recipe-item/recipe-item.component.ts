import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss']
})
export class RecipeItemComponent implements OnInit {
  // This input decorator is used to get anything from outside
  // @Input allows us to bind this component property from outside
  @Input() recipe: Recipe;
  @Input() index: number;

  ngOnInit(): void {
  }

}

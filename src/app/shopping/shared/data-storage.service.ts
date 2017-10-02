import {AuthenticateService} from '../auth/auth.service';
import {Recipe} from '../recipes/recipe.model';
import {RecipeService} from '../recipes/recipe.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DataStorageService {
  constructor(private httpClient: HttpClient, private recipeService: RecipeService, private authService: AuthenticateService) {
  }

  storeRecipes() {
    const token = this.authService.getToken();
    return this.httpClient.put('https://ng-recipe-book-3a818.firebaseio.com/recipes.json?auth=' + token,
      this.recipeService.getRecipes());
  }

  getRecipes() {
    const token = this.authService.getToken();
    // this.httpClient.get('https://ng-recipe-book-3a818.firebaseio.com/recipes.json?auth=' + token, {
    //   observe: 'response',
    //   responseType: 'json'
    // })
    this.httpClient.get<Recipe[]>('https://ng-recipe-book-3a818.firebaseio.com/recipes.json?auth=' + token)
      .map(
        (recipes) => {
          for (const recipe of recipes) {
            if (!recipe['ingredients']) {
              recipe['ingredients'] = [];
            }
          }
          return recipes;
        }
      )
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        }
      );
  }
}

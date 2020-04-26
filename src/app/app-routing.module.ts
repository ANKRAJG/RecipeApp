import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
    // Fallback when no path is typed
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },

    /* Code below for Lazily Loading Feature Modules
       Need to run ng serve again if u add new lazy loaded paths
       This RecipesModule Import needs to be removed from AppModule */
    /* NOTE: For Lazy loading to more most efficiently, you need to make best use of imports 
        in each modules */
    // OLDER SYNTAX
    // { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' }
    // This import function returns a promise, which we get using then method
    { 
        path: 'recipes', 
        loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)
    },
    { 
        path: 'shopping-list', 
        loadChildren: () => import('./shopping-list/shopping-list.module')
                                .then(m => m.ShoppingListModule) 
    },
    { 
        path: 'user', 
        loadChildren: () => import('./user/user.module').then(m => m.UserModule) 
    },

    // Fallback when no prior route is matched
    { path: '**', redirectTo: '/recipes', pathMatch: 'full' },
];

@NgModule({
    // Preloading all modules
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

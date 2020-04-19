// export class Ingredient {
//     constructor(
//         public name: string, 
//         public amount: number
//     ) {}
// }

export interface Ingredient {
    ingredientId?: number;
    name: string;
    amount: number;
}
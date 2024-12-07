export class Category {
    'categoryId': number;
    'categoryName': string;
    'status': boolean;

    constructor(id:number, name:string) {
        this.categoryId = id;
        this.categoryName = name;
    }
}

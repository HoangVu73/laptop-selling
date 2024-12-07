import { Product } from "./Product";
import { User } from "./User";

export class Rate {
    'id': number;
    'star': number;
    'comment': string;
    'rateDate': Date;
    'product': Product;
    'user':User;
}

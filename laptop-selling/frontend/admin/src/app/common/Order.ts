import { User } from "./User";

export class Order {
    'id': number;
    'amount': number;
    'address': string;
    'phone':string;
    'orderDate': Date;
    'status': number;
    'user': User;

    constructor(id:number, amount:number, address:string, phone:string, orderDate:Date, status:number, user:User) {
        this.id = id;
        this.amount = amount;
        this.address = address;
        this.phone = phone;
        this.orderDate = orderDate;
        this.status = status;
        this.user = user;
    }
}

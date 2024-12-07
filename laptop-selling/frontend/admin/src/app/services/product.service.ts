import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = 'http://localhost:8989/api/products';

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  getOne(id:number) {
    return this.httpClient.get(this.url+'/'+id);
  }

  post(product:Product) {
    return this.httpClient.post(this.url, product);
  }

  put(id:number, product: Product) {
    return this.httpClient.put(this.url+'/'+id, product);
  }

  delete(id:number) {
    return this.httpClient.delete(this.url+'/'+id);
  }
}

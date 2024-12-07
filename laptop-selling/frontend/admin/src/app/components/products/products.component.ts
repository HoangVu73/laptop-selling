import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/common/Product';
import { User } from 'src/app/common/User';
import { ProductService } from 'src/app/services/product.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  listData!: MatTableDataSource<Product>;
  products!: Product[];
  productsLength!: number;
  columns: string[] = ['image', 'productId', 'name', 'price', 'discount', 'category', 'enteredDate', 'view', 'delete'];

  isLoading = true;

  user!:User;
  image!:string;
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService, private toastr: ToastrService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.checkLogin();
    this.getAll();
  }
  
  checkLogin() {
    this.user = this.sessionService.getSession() as User;
    if(this.user==null) {
      window.location.href = ('/login');
    }else {
      this.image = this.user.image;
    }  
  }

  logout() {
    this.sessionService.deleteSession();
    window.location.href = '/login';
  }

  //lay du lieu tu database
  getAll() {
    this.productService.getAll().subscribe(data => {
      this.isLoading = false;
      this.products = data as Product[];
      this.listData = new MatTableDataSource(this.products);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      console.log('loi' + error);
    })
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().trim().toLowerCase();

  }

  delete(id:number, name:string) {
    Swal.fire({
      title: 'Bạn muốn xoá ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(id).subscribe(data=>{
          this.ngOnInit();
          this.toastr.success('Thông báo xoá thành công!', 'Hệ thống');
        },error=>{
          this.toastr.error('Thông báo xoá thất bại, đã xảy ra lỗi!', 'Hệ thống');
        })
      }
    })
  }

  finish() {
    this.ngOnInit();
  }
}

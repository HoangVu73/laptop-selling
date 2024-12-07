import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/common/Order';
import { User } from 'src/app/common/User';
import { OrderService } from 'src/app/services/order.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  listData!: MatTableDataSource<Order>;
  orders!:Order[];
  orderLength!: number;
  columns: string[] = ['id', 'user', 'address', 'phone', 'amount', 'orderDate', 'status', 'view'];

  isLoading=true;

  user!:User;
  image!:string;
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private orderService: OrderService, private toastr: ToastrService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.checkLogin();
    this.getAllOrder();
  }
  
  checkLogin() {
    this.user = this.sessionService.getSession() as User;
    if(this.user==null) {
      window.location.href = ('/login');
    } else {
      this.image = this.user.image;
    }  
  }

  logout() {
    this.sessionService.deleteSession();
    window.location.href = '/login';
  }

  getAllOrder() {
    this.orderService.getAllOrder().subscribe(data=>{
      this.isLoading = false;
      this.orders = data as Order[];
      this.listData = new MatTableDataSource(this.orders);
      this.orderLength = this.orders.length;
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error=>{
      this.toastr.error('Lỗi! '+error.status, 'Hệ thống');
    })
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().trim().toLowerCase();

  }

  finish() {
    this.ngOnInit();
  }

}

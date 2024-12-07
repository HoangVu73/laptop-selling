import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Rate } from 'src/app/common/Rate';
import { User } from 'src/app/common/User';
import { RateService } from 'src/app/services/rate.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {

  rates!: Rate[];
  listData!: MatTableDataSource<Rate>;
  ratesLength!: number;
  columns: string[] = ['index', 'name', 'product', 'star', 'comment',  'rateDate', 'delete'];

  isLoading = true;

  user!:User;
  image!:string;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rateService: RateService, private toastr: ToastrService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.checkLogin();
    this.getAll();
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

  getAll() {
    this.rateService.getAllRate().subscribe(data=>{
      this.isLoading = false;
      this.rates = data as Rate[];
      this.listData = new MatTableDataSource(this.rates);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.ratesLength = this.rates.length;
    }, error=>{
      this.toastr.error('Lỗi! '+error.status, 'Hệ thống');
    })
  }

  delete(id:number) {
    Swal.fire({
      title: 'Bạn muốn xoá đánh giá này ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rateService.delete(id).subscribe(data=>{
          this.ngOnInit();
          this.toastr.success('Xoá thành công!', 'Hệ thống');
        },error=>{
          this.toastr.error('Xoá thất bại, đã xảy ra lỗi!' +error.status, 'Hệ thống');
        })
      }
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

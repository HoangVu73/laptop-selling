import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/common/User';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  listData!: MatTableDataSource<User>;
  users!: User[];
  usersLength!: number;
  columns: string[] = ['image', 'userId', 'name', 'email', 'phone','address', 'gender', 'registerDate', 'view', 'delete'];

  isLoading=true;

  user!:User;
  image!:string;
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, private toastr: ToastrService, private sessionService: SessionStorageService) { }

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
    this.userService.getAll().subscribe(data => {
      this.isLoading = false;
      this.users = data as User[];
      this.listData = new MatTableDataSource(this.users);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      this.toastr.error('Lỗi! '+error.status, 'Hệ thống');
    })
  }

  delete(id:number, name:string) {
    Swal.fire({
      title: 'Bạn muốn xoá khách hàng ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe(data=>{
          this.ngOnInit();
          this.toastr.success('Thông báo xoá thành công!', 'Hệ thống');
        },error=>{
          this.toastr.error('Thông báo xoá thất bại, đã xảy ra lỗi!', 'Hệ thống');
        })
      }
    })
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().toLowerCase();
  }

  finish() {
    this.ngOnInit();
  }
}

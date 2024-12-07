import { Component, OnInit, ViewChild } from '@angular/core';
import { Category } from 'src/app/common/Category';
import { CategoryService } from 'src/app/services/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/common/User';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  listData!: MatTableDataSource<Category>;
  categories!: Category[];
  categoriesLength!: number;
  columns: string[] = ['categoryId', 'categoryName', 'view', 'delete'];

  isLoading = true;

  user!: User;
  image!: string;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private categoryService: CategoryService, private toastr: ToastrService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.checkLogin();
    this.getAll();
  }

  checkLogin() {
    this.user = this.sessionService.getSession() as User;
    if (this.user == null) {
      window.location.href = ('/login');
    } else {
      this.image = this.user.image;
    }
  }

  logout() {
    this.sessionService.deleteSession();
    window.location.href = '/login';
  }

  //lay du lieu tu database
  getAll() {
    this.categoryService.getAll().subscribe(data => {
      this.isLoading = false;
      this.categories = data as Category[];
      this.listData = new MatTableDataSource(this.categories);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.categoriesLength = this.categories.length;
    }, error => {
      console.log('loi' + error);
    })
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().trim().toLowerCase();

  }

  delete(id: number, name: string) {
    Swal.fire({
      title: 'Bạn muốn xoá nhãn hàng có tên ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.delete(id).subscribe(data => {
          this.ngOnInit();
          this.toastr.success('Thông báo xoá thành công!', 'Hệ thống');
        }, error => {
          this.toastr.error('Thông báo xoá thất bại, đã xảy ra lỗi!', 'Hệ thống');
        })
      }
    })
  }

  finish() {
    this.ngOnInit();
  }

}

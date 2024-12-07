import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Login } from 'src/app/common/Login';
import { User } from 'src/app/common/User';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  show: boolean = false;
  postForm:FormGroup;
  login!:Login;
  user!:User;

  constructor(private userService: UserService, private toastr: ToastrService, private sessionService: SessionStorageService) { 
    this.postForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    })
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin() {
    this.user = this.sessionService.getSession() as User;
    if(this.user!=null) {
      window.location.href = ('/');
    }    
  }

  Login() {
    this.login = this.postForm.value;
    this.userService.login(this.login).subscribe(data=>{
      this.sessionService.saveSession(data as User);
      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công!',
        showConfirmButton: false,
        timer: 1500
      })
      window.location.href = ('/');
    }, error=>{
      if(error.status == 404) {
        this.toastr.error('Tài khoản không hợp lệ!', 'Hệ thống');
      } else {
        this.toastr.error('Mật khẩu không đúng!', 'Hệ thống');
      }
      
    })
  }

  password() {
    this.show = !this.show;
  }

}

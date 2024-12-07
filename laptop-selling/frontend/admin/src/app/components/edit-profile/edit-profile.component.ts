import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/common/User';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  postForm: FormGroup;
  user!: User;
  url = '';

  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private userService: UserService, private sessionService: SessionStorageService, private toastr: ToastrService, private modalService: NgbModal) { 
    this.postForm = new FormGroup({
      'userId': new FormControl(0),
      'name': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'email': new FormControl(null, Validators.required),
      'address': new FormControl(null, Validators.required),
      'phone': new FormControl(null, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'gender': new FormControl(true),
      'registerDate': new FormControl(new Date),
      'status': new FormControl(true),
      'role': new FormControl(false)
    })
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.user = this.sessionService.getSession() as User;
    this.postForm = new FormGroup({
      'userId': new FormControl(this.user.userId),
      'name': new FormControl(this.user.name, [Validators.required, Validators.minLength(6)]),
      'email': new FormControl(this.user.email, Validators.required),
      'address': new FormControl(this.user.address, Validators.required),
      'phone': new FormControl(this.user.phone, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
      'password': new FormControl(this.user.password, [Validators.required, Validators.minLength(6)]),
      'gender': new FormControl(this.user.gender),
      'registerDate': new FormControl(this.user.registerDate),
      'status': new FormControl(this.user.status),
      'role': new FormControl(this.user.role)
    })
    this.url = this.user.image;
  }

  update() {
    if(this.postForm.valid){
      this.user = this.postForm.value;
      this.user.image = this.url;
      this.userService.put(this.user.userId, this.user).subscribe(data=>{
        this.modalService.dismissAll();
        this.toastr.success('Cập nhật thành công!', 'Hệ thống');
        this.sessionService.saveSession(data as User);
        this.editFinish.emit('done');
      })
    } else {
      this.toastr.error('Hãy kiểm tra và nhập lại dữ liệu!', 'Hệ thống')
    }
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: "lg" });
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}

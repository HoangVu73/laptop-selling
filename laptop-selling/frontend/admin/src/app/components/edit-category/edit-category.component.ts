import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/Category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  postForm: FormGroup;
  category!:Category;

  @Input() id = 0;
  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal, private categoryService: CategoryService, private toastr: ToastrService) {
    this.postForm = new FormGroup({
      'categoryId': new FormControl(0),
      'categoryName': new FormControl(null, [Validators.required, Validators.minLength(2)]),
      'status': new FormControl(true)
    })
  }

  ngOnInit(): void {
    this.categoryService.getOne(this.id).subscribe(data=>{
      this.category = data as Category;
      this.postForm = new FormGroup({
        'categoryId': new FormControl(this.category.categoryId),
        'categoryName': new FormControl(this.category.categoryName, [Validators.required, Validators.minLength(2)]),
        'status': new FormControl(this.category.status)
      })
    }, error=>{
      this.modalService.dismissAll();
      this.toastr.error('Lỗi! không tìm thấy' + error), 'Hệ thống ';
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  update() {
    if (this.postForm.valid) {
      this.categoryService.put(this.id, this.postForm.value).subscribe(data => {
        this.modalService.dismissAll();
        this.toastr.success('Cập nhật thành công!', 'Hệ thống');
        this.editFinish.emit('done');
      }, error => {
        this.toastr.error('Cập nhật thất bại!', 'Hệ thống ' + error);
      })
    } else {
      this.toastr.error('Cập nhật thất bại!', 'Hệ thống');
    }
  }
}

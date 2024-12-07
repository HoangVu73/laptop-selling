import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/common/Order';
import { OrderDetail } from 'src/app/common/OrderDetail';
import { OrderService } from 'src/app/services/order.service';
import { SendmailService } from 'src/app/services/sendmail.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-action',
  templateUrl: './order-action.component.html',
  styleUrls: ['./order-action.component.css']
})
export class OrderActionComponent implements OnInit {

  orderDetails!: OrderDetail[];
  order!: Order;
  listData!: MatTableDataSource<OrderDetail>;
  orderDetailLength!: number;

  columns: string[] = ['index', 'image', 'product', 'price', 'quantity', 'price'];

  @Input() orderId!: number;
  @Output()
  updateFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private orderService: OrderService, private modalService: NgbModal, private toastr: ToastrService, private sendMailService:SendmailService) { }

  ngOnInit(): void {
    this.getOrder();
    this.getDetail();
  }

  getOrder() {
    this.orderService.getOrder(this.orderId).subscribe(data => {
      this.order = data as Order;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getDetail() {
    this.orderService.getByOrder(this.orderId).subscribe(data => {
      this.orderDetails = data as OrderDetail[];
      this.listData = new MatTableDataSource(this.orderDetails);
      this.orderDetailLength = this.orderDetails.length;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  confirm() {
    Swal.fire({
      title: 'Bạn muốn xác nhận đơn hàng này ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.order.status = 2;
        this.orderService.update(this.order.id, this.order).subscribe(data => {
          this.toastr.success('Xác nhận thành công!', 'Hệ thống');
          this.updateFinish.emit('done');
          this.modalService.dismissAll();
          this.sendMailService.sendMailOrder(this.order).subscribe(data=>{
            
          });
        }, error => {
          this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
        })
      }
    })
  }

  cancel() {
    Swal.fire({
      title: 'Bạn muốn huỷ đơn hàng này ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Huỷ',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.order.status = 0;
        this.orderService.update(this.order.id, this.order).subscribe(data => {
          this.toastr.success('Huỷ thành công!', 'Hệ thống');
          this.updateFinish.emit('done');
          this.modalService.dismissAll();
          this.sendMailService.sendMailOrder(this.order).subscribe(data=>{
            
          });
        }, error => {
          this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
        })
      }
    })
  }

  paid() {
    Swal.fire({
      title: 'Bạn muốn xác nhận đơn hàng này đã thanh toán?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.order.status = 3;
        this.orderService.update(this.order.id, this.order).subscribe(data => {
          this.toastr.success('Xác nhận thành công!', 'Hệ thống');
          this.updateFinish.emit('done');
          this.modalService.dismissAll();
          this.sendMailService.sendMailOrder(this.order).subscribe(data=>{

          });
        }, error => {
          this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
        })
      }
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}

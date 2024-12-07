import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/common/Order';
import { User } from 'src/app/common/User';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Chart, registerables } from "node_modules/chart.js";
import { StatisticalService } from 'src/app/services/statistical.service';
import { Statistical } from 'src/app/common/Statistical';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  orders!: Order[];
  users!: User[];
  userLength!: number;
  orderLength!: number;
  statistical!: Statistical[];

  labels: string[] = [];
  data: number[] = [];
  year: number = 2021;
  years!: number[];
  myChartBar !: Chart;
  myChartDoughnut !: Chart;

  image!: string;

  user!: User;

  constructor(private orderService: OrderService, private userService: UserService, private toastr: ToastrService,
    private statisticalService: StatisticalService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.checkLogin();
    this.getAllUser();
    this.getOrderWait();
    Chart.register(...registerables);
    this.getStatisticalYear();
    this.getYears();
  }

  checkLogin() {
    this.user = this.sessionService.getSession() as User;
    if (this.user == null) {
      window.location.href = '/login';
    } else {
      this.image = this.user.image;
    }
  }

  logout() {
    this.sessionService.deleteSession();
    window.location.href = '/login';
  }

  getStatisticalYear() {
    this.statisticalService.getStatisticalYear(this.year).subscribe(data => {
      this.statistical = data as Statistical[];
      this.statistical.forEach(item => {
        this.labels.push('Tháng ' + item.month);
        this.data.push(item.amount);
      })
      this.loadChartBar();
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getYears() {
    this.statisticalService.getYears().subscribe(data => {
      this.years = data as number[];
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  selectYear() {
    this.labels = [];
    this.data = [];
    this.myChartBar.destroy();
    this.ngOnInit();
  }

  loadChartBar() {
    this.myChartBar = new Chart('chart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          // label: '# of Votes',
          data: this.data,
          // borderColor: 'rgb(75, 192, 192)',
          // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
          // backgroundColor: 'rgba(255, 99, 132, 0.2)',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(0, 162, 71, 0.2)',
            'rgba(82, 0, 36, 0.2)',
            'rgba(82, 164, 36, 0.2)',
            'rgba(255, 158, 146, 0.2)',
            'rgba(123, 39, 56, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(0, 162, 71, 1)',
            'rgba(82, 0, 36, 1)',
            'rgba(82, 164, 36, 1)',
            'rgba(255, 158, 146, 1)',
            'rgba(123, 39, 56, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  getAllUser() {
    this.userService.getAll().subscribe(data => {
      this.users = data as User[];
      this.userLength = this.users.length;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getOrderWait() {
    this.orderService.getWait().subscribe(data => {
      this.orders = data as Order[];
      this.orderLength = this.orders.length;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  finish() {
    this.ngOnInit();
  }

}

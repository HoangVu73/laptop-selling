import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { Statistical } from 'src/app/common/Statistical';
import { User } from 'src/app/common/User';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { StatisticalService } from 'src/app/services/statistical.service';

// import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-statistical',
  templateUrl: './statistical.component.html',
  styleUrls: ['./statistical.component.css']
})
export class StatisticalComponent implements OnInit {

  statisticalDates!: Statistical[];
  statisticalDatesTable!: Statistical[];
  listDataDate!: MatTableDataSource<Statistical>;
  lengthDate!: number;
  columnsDate: string[] = ['index', 'date', 'count', 'amount'];

  statisticalMonths!: Statistical[];
  statisticalMonthsTable!: Statistical[];
  listDataMonth!: MatTableDataSource<Statistical>;
  lengthMonth!: number;
  columnsMonth: string[] = ['index', 'date', 'count', 'amount'];

  statisticalYearsTable!: Statistical[];
  listDataYear!: MatTableDataSource<Statistical>;
  lengthYears!: number;
  columnsYears: string[] = ['index', 'date', 'count', 'amount'];
  statisticalYear!: Statistical[];

  @ViewChild('sortMonth') sortMonth!: MatSort;
  @ViewChild('MatPaginatorMonth') paginatorMonth!: MatPaginator;
  @ViewChild('sortDate') sortDate!: MatSort;
  @ViewChild('MatPaginatorDate') paginatorDate!: MatPaginator;
  @ViewChild('sortYear') sortYear!: MatSort;
  @ViewChild('MatPaginatorYear') paginatorYear!: MatPaginator;


  labelsDate: any[] = [];
  dataDate: number[] = [];

  labelsMonth: any[] = [];
  dataMonth: number[] = [];

  labelsYear: any[] = [];
  dataYear: number[] = [];

  myChartLine !: Chart;
  myChartBar !: Chart;
  myCharDoughnut !: Chart;

  user!:User;
  image!:string;

  constructor(private datepipe: DatePipe, private statisticalService: StatisticalService, private toastr: ToastrService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.checkLogin();
    Chart.register(...registerables);
    this.getStatisticalAllDate();
    this.getStatisticalMonth();
    this.getStatisticalYear();
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

  getStatisticalAllDate() {
    this.statisticalService.getDate().subscribe(data => {
      //chart
      this.statisticalDates = data as Statistical[];
      this.statisticalDates.forEach(item => {
        this.dataDate.push(item.amount),
          this.labelsDate.push(this.datepipe.transform(item.date, 'dd/MM/yyyy'));
      })
      this.loadChartLineDate();

      //table
      this.statisticalDatesTable = this.statisticalDates;      
      this.statisticalDatesTable.sort((o1,o2) =>  {
        if(o1.date<o2.date) {
          return 1;
        }
        if(o1.date>o2.date) {
          return -1;
        }
        return 0;
      });
      this.listDataDate = new MatTableDataSource(this.statisticalDatesTable);
      this.lengthDate = this.statisticalDatesTable.length;
      this.listDataDate.sort = this.sortDate;
      this.listDataDate.paginator = this.paginatorDate;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getStatisticalMonth() {
    this.statisticalService.getMonth().subscribe(data => {
      //chart
      this.statisticalMonths = data as Statistical[];
      this.statisticalMonths.sort((o1,o2) =>  {
        if(o1.date>o2.date) {
          return 1;
        }
        if(o1.date<o2.date) {
          return -1;
        }
        return 0;
      });
      this.statisticalMonths.forEach(item => {
        this.dataMonth.push(item.amount),
        this.labelsMonth.push(this.datepipe.transform(item.date, 'MM/yyyy'));
      })
      this.loadChartLineMonth();

      //table
      this.statisticalMonthsTable = this.statisticalMonths;      
      this.statisticalMonthsTable.sort((o1,o2) =>  {
        if(o1.date<o2.date) {
          return 1;
        }
        if(o1.date>o2.date) {
          return -1;
        }
        return 0;
      });
      this.listDataMonth = new MatTableDataSource(this.statisticalMonthsTable);
      this.lengthMonth = this.statisticalMonthsTable.length;
      this.listDataMonth.sort = this.sortMonth;
      this.listDataMonth.paginator = this.paginatorMonth;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getStatisticalYear() {
    this.statisticalService.getYear().subscribe(data=>{
      this.statisticalYear = data as Statistical[];
      this.listDataYear = new MatTableDataSource(this.statisticalYear);
      this.lengthYears = this.statisticalYear.length;
      this.listDataYear.sort = this.sortYear;
      this.listDataYear.paginator = this.paginatorYear;
      this.statisticalYear.forEach(item=>{
        this.dataYear.push(item.amount);
        this.labelsYear.push('Năm '+ this.datepipe.transform(item.date, 'yyyy'))
      })
      this.loadChartDoughnutYear();
    }, error=>{
      this.toastr.error('Lỗi! '+error.status, 'Hệ thống');
    })
  }

  loadChartLineDate() {
    this.myChartLine = new Chart('chartDate', {
      type: 'line',
      data: {
        labels: this.labelsDate,
        datasets: [{
          // label: '# of Votes',
          data: this.dataDate,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
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

  loadChartLineMonth() {
    this.myChartBar = new Chart('chartMonth', {
      type: 'line',
      data: {
        labels: this.labelsMonth,
        datasets: [{
          // label: '# of Votes',
          data: this.dataMonth,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
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

  loadChartDoughnutYear() {
    this.myChartBar = new Chart('chartYear', {
      type: 'pie',
      data: {
        labels: this.labelsYear,
        datasets: [{
          label: 'My First Dataset',
          data: this.dataYear,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(43, 99, 71)',
            'rgb(43, 255, 222)',
            'rgb(43, 113, 222)',
            'rgb(43, 13, 222)'
          ],
          hoverOffset: 4
        }]
      },
    });
  }

  finish() {
    this.ngOnInit();
  }

}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] =['name', 'email', 'contactNumber', 'total', 'view' ];
  dataSource: any;
  responseMessage: any;

  constructor(private billService: BillService,
    private productService : ProductService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService : SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
  
  tableData(){
    
  }


}

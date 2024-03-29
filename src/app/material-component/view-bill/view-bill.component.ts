import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] =['name', 'email', 'contactNumber', 'paymentMethod','total', 'view' ];
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
    this.billService.getBills().subscribe((res : any)=>{
      debugger
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(res.replyMessage);
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSncakBar(this.responseMessage, GlobalConstants.error); 
    })
  }

  applyFilter(event: Event){
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  handleViewAction(values: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data : values
    }
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(ViewBillProductsComponent);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
  }

  handleDeleteAction(values: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `delete `+ values.name + ' bill',
      confirmation: true
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res)=>{
      debugger
      this.ngxService.start();
      this.deleteBill(values.id);
      dialogRef.close();
    })
  }

  deleteBill(id: any){
     this.billService.delete(id).subscribe((res: any)=>{
      debugger
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = res?.replyMessage;
        this.snackbarService.openSncakBar(this.responseMessage, "success");
     },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSncakBar(this.responseMessage, GlobalConstants.error); 
    })
  }

  downloadReportAction(values: any){
    debugger
     this.ngxService.start();
     var data ={
      name: values.name,
      email: values.email,
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      totalAmount: values.total.toString(),
      productDetails: values.productDetails
     }
     debugger
     this.downloadFile(values.uuid, data);
}

   downloadFile(fileName: string, data: any){
    debugger
    this.billService.getPdf(data).subscribe((res:any)=>{
      debugger
      saveAs(res,fileName + '.pdf');
      this.ngxService.stop();
    })
   }

}
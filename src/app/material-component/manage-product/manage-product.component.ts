import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { globalAgent } from 'http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ProductComponent } from '../dialog/product/product.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  displayedColumns: string[] =['name', 'description', 'price', 'edit' ];
  dataSource: any;
  length: any;
  responseMessage: any;
  constructor(private productService : ProductService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService : SnackbarService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.productService.getProducts().subscribe((res:any)=>{
      this.ngxService.stop();
      debugger
      this.dataSource = new MatTableDataSource(res.replyMessage);
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
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

  handleAddAction(){
     const dialogConfig = new MatDialogConfig();
     dialogConfig.data ={
      action: 'Add',
     }
     dialogConfig.width ="850px";
     const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
     this.router.events.subscribe(()=>{
      dialogRef.close();
     });
     const sub = dialogRef.componentInstance.onAddProduct.subscribe((res)=>{
       this.tableData();
     })
  }

  handleEditAction(values: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data ={
     action: 'Edit',
     data: values
    }
    dialogConfig.width ="850px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(()=>{
     dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditProduct.subscribe((res)=>{
      this.tableData();
    })

  }

  handleDeleteAction(values: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `delete `+ values.name + ' product',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res)=>{
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id: any){
     this.productService.delete(id).subscribe((res:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = res?.replyMessage;
      this.snackbarService.openSncakBar(this.responseMessage,"success");
     },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSncakBar(this.responseMessage, GlobalConstants.error); 
    });
  }

  onChange(status: any, id: any){
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id: id
    }
    this.productService.updateStatus(data).subscribe((res: any)=>{
      this.ngxService.stop();
      this.responseMessage =  res?.replyMessage;
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

}

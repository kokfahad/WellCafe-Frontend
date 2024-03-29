import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryComponent>,
    public snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]]
    });

    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.categoryForm.patchValue(this.dialogData.data)
    }
  }

  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit()
    } else {
      this.add();
    }
  }

  add() {
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name
    }
    this.categoryService.add(data).subscribe((res:any)=>{
      debugger
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = res.replyMessage;
      this.snackbarService.openSncakBar(this.responseMessage, "success");
    }, (error)=>{
      this.dialogRef.close();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSncakBar(this.responseMessage, GlobalConstants.error);
    });
  }

  edit() {
    var formData = this.categoryForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name
    }
    this.categoryService.update(data).subscribe((res:any)=>{
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = res.replyMessage;
      this.snackbarService.openSncakBar(this.responseMessage, "success");
    }, (error)=>{
      this.dialogRef.close();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSncakBar(this.responseMessage, GlobalConstants.error);
    });

  }


}

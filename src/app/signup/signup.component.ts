import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  password = true;
  confirmPassword = true;
  signupForm:any = FormGroup;
  responseMessage : any;

  constructor(private formBuilder : FormBuilder,
    private router : Router,
    private userService: UserService,
    private snackbarService : SnackbarService,
    public dialogRef : MatDialogRef<SignupComponent>,
    private ngxService : NgxUiLoaderService) { }

  ngOnInit(): void {
  }

}

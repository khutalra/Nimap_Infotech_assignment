import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {

  @Input() title: string = 'Register';
  registrationForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.initializeForm();
    this.getProfileData();
  }

  initializeForm() {
    this.registrationForm = this.formBuilder.group({
      photo: ['', [Validators.required]],
      fname: ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+"), Validators.maxLength(20)]],
      lname: ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required]],
      age: ['0', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      address: ['', [Validators.required]],
      tags: [[], [Validators.required]],
      newslater: [false, []]
    });
  }

  getProfileData() {
    this.userService.getProfileData().subscribe((result: any) => {
      this.registrationForm.patchValue({
        fname: result?.fname || '',
        lname: result?.lname || '',
        email: result?.email || '',
        contact: result?.contact || '',
        age: result?.age || '',
        state: result?.state || '',
        country: result?.country || '',
        address: result?.address || '',
        tags: result?.tags || '',
        newslater: result?.newslater || ''
      })
      if (result?.photo) {
        const image: any = document.getElementById("box");
        image.src = result.photo;
        this.registrationForm.controls['photo'].setValue(result.photo);
      }
    }, error => {
      console.log('Something went wrong.', error);
    })
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.userService.saveProfile(this.registrationForm.value).subscribe((result) => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/profile'])
         
        });
      }, _ => {
        alert('Something went wrong try again...');
      });
    } else {
      alert('All fields are compulsory');
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const MAX_WIDTH = 310;
    const MAX_HEIGHT = 325;

    if (file) {
      const img = document.createElement('img');
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        img.src = reader.result as string;
        if (!(img.width !== MAX_WIDTH && img.height !== MAX_HEIGHT)) {
          alert('Please select image with resolution 310 x 325 px');
        } else {
          this.registrationForm.controls['photo'].setValue(reader.result);
          const image: any = document.getElementById("box");
          image.src = reader.result;
        }
      };
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const tagsControl = this.registrationForm.controls['tags'];
      const tempArr = tagsControl.value || [];
      tempArr.push(value);
      tagsControl.setValue(tempArr);
    }
    event.chipInput!.clear();
  }

  removeTag(value: string): void {
    const index = this.registrationForm.controls['tags'].value.indexOf(value);
    if (index >= 0) {
      const tagsControl = this.registrationForm.controls['tags'];
      const tempArr = tagsControl.value || [];
      tempArr.splice(index, 1);
      tagsControl.setValue(tempArr);
    }
  }

}

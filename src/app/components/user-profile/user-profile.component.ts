import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: any;
  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getProfileData();
  }

  getProfileData() {
    this.userService.getProfileData().subscribe((result: any) => {
      this.user = result;
      if (result?.photo) {
        const image: any = document.getElementById("profile");
        image.src = result?.photo;
      }
    }, _ => {
      alert('Something Went Wrong. Please try again...');
    });
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
          this.user.photo = reader.result;
          const image: any = document.getElementById("profile");
          image.src = reader.result;
          this.saveProfile();
        }
      };
    }
  }

  saveProfile() {
    this.userService.saveProfile(this.user).subscribe((result) => {
      alert('Profile Updated Successfully');
    }, _ => {
      alert('Something went wrong try again...');
    });
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(UserRegistrationComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

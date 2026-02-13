import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProfileAvatarService } from './profile-avatar.service';
@Component({
  selector: 'app-profile-avatar',
  imports: [FaIconComponent],
  templateUrl: './profile-avatar.html',
  styleUrl: './profile-avatar.css',
})
export class ProfileAvatar {
  protected faCamera = faCamera;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private profileAvatarService: ProfileAvatarService
  ) {}

  onCameraClick() {
    this.fileInput.nativeElement.click();
  }

  imageUrl: string | ArrayBuffer | null = 'large.jpg';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      this.profileAvatarService.sendAvatarToServer(file);

      reader.readAsDataURL(file);
    }
  }
}

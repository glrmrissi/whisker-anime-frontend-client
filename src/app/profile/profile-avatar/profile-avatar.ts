import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, input, Output, ViewChild } from '@angular/core';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProfileAvatarService } from './profile-avatar.service';
import { SnackBarService } from '../../../../projects/ui/src/public-api';
@Component({
  selector: 'app-profile-avatar',
  imports: [FaIconComponent],
  templateUrl: './profile-avatar.html',
  styleUrl: './profile-avatar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileAvatar {
  protected faCamera = faCamera;
  protected baseUrl = 'http://localhost:3001/';
  protected timestamp = `?t=${new Date().getTime()}`;
  imageUrlInput = input<string | undefined>(undefined);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() avatarUpdated = new EventEmitter<void>();

  private snackBar = inject(SnackBarService);

  constructor(
    private profileAvatarService: ProfileAvatarService,
  ) {
  }

  onCameraClick() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      await this.profileAvatarService.sendAvatarToServer(file);
      this.avatarUpdated.emit();
      this.snackBar.open("Avatar updated!", 3000, "success");
    } else {
      this.snackBar.open("The avatar hasn't been updated", 3000, "error");

    }
  }
}

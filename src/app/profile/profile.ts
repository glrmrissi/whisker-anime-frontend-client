import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ProfileAvatar } from "./profile-avatar/profile-avatar";
import { A11yModule } from "@angular/cdk/a11y";
import { faEdit, faMailForward, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProfileService } from './profile.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBar } from '../../../projects/ui/src/lib/snackbar/snackbar';
import { SnackBarService } from '../../../projects/ui/src/lib/snackbar/snackbar.service';

type ProfileType = {
  username: string;
  avatarUrl: string;
  bio: string;
  nickName: string;
  createdAt: Date;
  favoriteAnimes: string[];
};

@Component({
  selector: 'app-profile',
  imports: [ProfileAvatar, A11yModule, FaIconComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  @ViewChild('profileAvatar') protected profileAvatar!: ProfileAvatar;

  protected faEdit = faEdit;
  protected faUserShield = faUserShield;
  protected faMailForward = faMailForward;

  protected disabledInput = true;
  protected hiddenEditButton = false;

  protected baseUrl = 'http://localhost:3001/';

  public profile = signal<ProfileType | null>(null);

  constructor(
    private readonly profileService: ProfileService,
    private snackBar: SnackBarService
  ) {
    this.disabledInput = true;
    this.hiddenEditButton = false;
  }

  async ngOnInit(): Promise<ProfileType | void> {
    await this.getProfile();
  }

  async getProfile(): Promise<ProfileType | void> {
    let res = await this.profileService.getUserProfile();

    if (!res) {
      return;
    }

    const timestamp = new Date().getTime();
    res.avatarUrl = `${this.baseUrl}${res.avatarUrl}?t=${timestamp}`;

    this.profile.set(res);
    return res;
  }

  async refreshData() {
    await this.getProfile()
  }

  enableInputs() {
    this.disabledInput = false
    this.hiddenEditButton = true
    this.snackBar.open(
      'You are on edit mode',
      'OK',
      3000,
      'warning'
    )
  }

  saveEdits() {
    this.hiddenEditButton = false
    this.snackBar.open(
      'Success saved',
      'OK',
      3000
    )
  }
}

import { Component, inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { ProfileAvatar } from "./profile-avatar/profile-avatar";
import { A11yModule } from "@angular/cdk/a11y";
import { faEdit, faMailForward, faUserShield, faSave } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProfileService } from './profile.service';
import { SnackBarService } from '../../../projects/ui/src/lib/snackbar/snackbar.service';
import { FormBuilder, ReactiveFormsModule, ɵInternalFormsSharedModule } from "@angular/forms";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Header } from '../header/header';

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
  imports: [CommonModule, ProfileAvatar, A11yModule, FaIconComponent, ɵInternalFormsSharedModule, ReactiveFormsModule, Header],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  @ViewChild('profileAvatar') protected profileAvatar!: ProfileAvatar;

  protected faEdit = faEdit;
  protected faUserShield = faUserShield;
  protected faMailForward = faMailForward;
  protected faSave = faSave

  protected disabledInput = true;
  protected hiddenEditButton = false;

  protected baseUrl = 'http://localhost:3001/';

  public profile = signal<ProfileType | null>(null);

  private formBuilder = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  editUserGroup = this.formBuilder.group({
    nickName: [''],
    bio: ['']
  })


  constructor(
    private readonly profileService: ProfileService,
    private snackBar: SnackBarService
  ) {
    this.disabledInput = true;
    this.hiddenEditButton = false;
  }


  async ngOnInit() { 
    if (isPlatformBrowser(this.platformId)) {
      await this.getProfile();
    }
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

  onSubmit() {
    const res = this.editUserGroup.value
    console.log(JSON.stringify(res));
  }
}

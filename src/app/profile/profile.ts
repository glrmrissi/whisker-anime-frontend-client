import { Component, inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { ProfileAvatar } from "./profile-avatar/profile-avatar";
import { faEdit, faMailForward, faUserShield, faSave, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProfileService } from './profile.service';
import { SnackBarService } from '../../../projects/ui/src/lib/snackbar/snackbar.service';
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Header } from '../header/header';
import { History } from './history/history';

type ProfileType = {
  username: string;
  avatarUrl: string;
  bio: string;
  nickName: string;
  createdAt: Date;
  favoriteAnimes: string[];
};

type Tab = 'profile' | 'history';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ProfileAvatar, FaIconComponent, ReactiveFormsModule, Header, History],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  @ViewChild('profileAvatar') protected profileAvatar!: ProfileAvatar;

  protected faEdit = faEdit;
  protected faUserShield = faUserShield;
  protected faMailForward = faMailForward;
  protected faSave = faSave;
  protected faClockRotateLeft = faClockRotateLeft;

  protected disabledInput = true;
  protected hiddenEditButton = false;

  protected baseUrl = 'http://localhost:3001/';

  public profile = signal<ProfileType | null>(null);
  protected activeTab = signal<Tab>('profile');

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
      3000,
      'warning'
    )
  }

  saveEdits() {
    this.hiddenEditButton = false
    this.snackBar.open(
      'Success saved',
      3000
    )
  }

  onSubmit() {
    const res = this.editUserGroup.value
  }

  setTab(tab: Tab) {
    this.activeTab.set(tab);
  }
}

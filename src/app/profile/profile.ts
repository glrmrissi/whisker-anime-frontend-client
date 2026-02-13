import { Component } from '@angular/core';
import { ProfileAvatar } from "./profile-avatar/profile-avatar";
import { A11yModule } from "@angular/cdk/a11y";
import { faEdit, faMailForward, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-profile',
  imports: [ProfileAvatar, A11yModule, FaIconComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  protected faEdit = faEdit;
  protected faUserShield = faUserShield 
  protected faMailForward = faMailForward

  profileName = 'John Doe';
  profileBio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  favoriteAnimes = ['Naruto', 'One Piece', 'Attack on Titan', 'My Hero Academia'];
}

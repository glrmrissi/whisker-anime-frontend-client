import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  faCamera,
  faCheck,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
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
  protected faCheck = faCheck;
  protected faXmark = faXmark;
  protected faMagnifyingGlassPlus = faMagnifyingGlassPlus;
  protected faMagnifyingGlassMinus = faMagnifyingGlassMinus;

  imageUrlInput = input<string | undefined>(undefined);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() avatarUpdated = new EventEmitter<void>();

  readonly CROP_SIZE = 280;

  showEditor = signal(false);
  previewUrl = signal<string | null>(null);
  zoom = signal(1);
  offsetX = signal(0);
  offsetY = signal(0);
  isUploading = signal(false);

  private coverScale = signal(1);
  private naturalW = signal(0);
  private naturalH = signal(0);

  editorImageTransform = computed(() => {
    const s = this.coverScale() * this.zoom();
    const x = this.CROP_SIZE / 2 + this.offsetX() - (this.naturalW() * s) / 2;
    const y = this.CROP_SIZE / 2 + this.offsetY() - (this.naturalH() * s) / 2;
    return `translate(${x}px, ${y}px) scale(${s})`;
  });

  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragStartOffsetX = 0;
  private dragStartOffsetY = 0;
  private selectedFile: File | null = null;

  private snackBar = inject(SnackBarService);

  constructor(private profileAvatarService: ProfileAvatarService) { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const size = this.CROP_SIZE;
          this.naturalW.set(img.naturalWidth);
          this.naturalH.set(img.naturalHeight);
          this.coverScale.set(size / Math.min(img.naturalWidth, img.naturalHeight));
          this.zoom.set(1);
          this.offsetX.set(0);
          this.offsetY.set(0);
          this.previewUrl.set(url);
          this.showEditor.set(true);
        };
        img.src = url;
      };
      reader.readAsDataURL(this.selectedFile);
    }
    input.value = '';
  }

  onEditorMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragStartOffsetX = this.offsetX();
    this.dragStartOffsetY = this.offsetY();
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    this.offsetX.set(this.dragStartOffsetX + (event.clientX - this.dragStartX));
    this.offsetY.set(this.dragStartOffsetY + (event.clientY - this.dragStartY));
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }

  onEditorTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    this.isDragging = true;
    this.dragStartX = event.touches[0].clientX;
    this.dragStartY = event.touches[0].clientY;
    this.dragStartOffsetX = this.offsetX();
    this.dragStartOffsetY = this.offsetY();
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.isDragging || event.touches.length !== 1) return;
    this.offsetX.set(this.dragStartOffsetX + (event.touches[0].clientX - this.dragStartX));
    this.offsetY.set(this.dragStartOffsetY + (event.touches[0].clientY - this.dragStartY));
  }

  @HostListener('document:touchend')
  onTouchEnd() {
    this.isDragging = false;
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.08 : 0.08;
    this.zoom.set(Math.min(4, Math.max(0.5, this.zoom() + delta)));
  }

  adjustZoom(delta: number) {
    this.zoom.set(Math.min(4, Math.max(0.5, this.zoom() + delta)));
  }

  cancelEditor() {
    this.showEditor.set(false);
    this.previewUrl.set(null);
    this.selectedFile = null;
  }

  async confirmEditor() {
    if (!this.previewUrl() || !this.selectedFile || this.isUploading()) return;
    this.isUploading.set(true);

    const size = this.CROP_SIZE;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    const img = new Image();
    img.onload = async () => {
      const s = this.coverScale() * this.zoom();
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      const x = size / 2 + this.offsetX() - w / 2;
      const y = size / 2 + this.offsetY() - h / 2;
      ctx.drawImage(img, x, y, w, h);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          this.isUploading.set(false);
          return;
        }
        const file = new File([blob], this.selectedFile!.name, { type: 'image/png' });
        await this.profileAvatarService.sendAvatarToServer(file);
        this.avatarUpdated.emit();
        this.snackBar.open('Avatar updated!', 3000, 'success');
        this.showEditor.set(false);
        this.previewUrl.set(null);
        this.isUploading.set(false);
      }, 'image/png');
    };
    img.src = this.previewUrl()!;
  }
}

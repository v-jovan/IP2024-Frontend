import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from 'src/app/services/Upload/upload.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'image-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss'
})
export class ImageUploaderComponent implements OnChanges {
  @Input() width: number = 150;
  @Input() height: number = 150;
  @Input() showOverlay: boolean = true;
  @Input() image: string | undefined;
  @Output() imageUploaded = new EventEmitter<string | null>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  showRemoveButton = false;

  constructor(
    private uploadService: UploadService,
    private messageService: MessageService
  ) {}

  ngOnChanges(): void {
    if (this.image) {
      this.imageUrl = environment.apiUrl + this.image;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.imageUploaded.emit(this.imageUrl as string);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async uploadImage(): Promise<string | null> {
    if (!this.selectedFile) {
      return null;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    try {
      const response = await this.uploadService.uploadImage(formData);
      return response;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Greška',
        detail:
          'Došlo je do greške prilikom postavljanja slike. Molimo pokušajte ponovo.'
      });
      return null;
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.imageUploaded.emit(null);
    this.imageUrl = null;
    this.selectedFile = null;
    this.showRemoveButton = false;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  clearImage(): void {
    this.removeImage(new Event('click'));
  }

  onAvatarClick(): void {
    if (this.showOverlay) {
      this.triggerFileInput();
    }
  }
}

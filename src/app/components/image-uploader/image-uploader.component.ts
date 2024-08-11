import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from 'src/app/services/Upload/upload.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'image-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss'
})
export class ImageUploaderComponent {
  @Input() width: number = 150;
  @Input() height: number = 150;
  @Input() showOverlay: boolean = true;
  @Output() imageUploaded = new EventEmitter<string | null>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  showRemoveButton = false;

  constructor(
    private uploadService: UploadService,
    private messageService: MessageService
  ) {}

  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imageUrl = reader.result;
  //       this.imageUploaded.emit(this.imageUrl as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

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

  // async uploadImage(): Promise<String | null> {
  //   if (this.selectedFile) {
  //     const formData = new FormData();
  //     formData.append('file', this.selectedFile);

  //     try {
  //       const response = await this.uploadService.uploadImage(formData);
  //       return response;
  //     } catch (error) {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Greška',
  //         detail:
  //           'Došlo je do greške prilikom postavljanja slike. Molimo pokušajte ponovo.'
  //       });
  //     }
  //   }
  //   return null;
  // }

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

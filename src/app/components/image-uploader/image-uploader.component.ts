import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UploadService } from 'src/app/services/Upload/upload.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'image-uploader',
  standalone: true,
  imports: [],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss'
})
export class ImageUploaderComponent {
  @Input() width: number = 150;
  @Input() height: number = 150;
  @Output() imageUploaded = new EventEmitter<string | null>();

  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  showRemoveButton = false;

  constructor(
    private uploadService: UploadService,
    private messageService: MessageService
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadImage(): Promise<String | null> {
    if (this.selectedFile) {
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
      }
    }
    return null;
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.imageUploaded.emit(null);
    this.imageUrl = null;
    this.selectedFile = null;
    this.showRemoveButton = false;
  }
}

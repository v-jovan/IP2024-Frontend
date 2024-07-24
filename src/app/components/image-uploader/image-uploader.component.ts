import axios from 'axios';
import { Component, Input } from '@angular/core';
import { UploadService } from 'src/app/services/Upload/upload.service';

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
  imageUrl: string | ArrayBuffer | null = null;
  uploadResponse: string | null = null;
  selectedFile: File | null = null;

  constructor(private uploadService: UploadService) {}

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
    console.log('File selected:', file);
    console.log('Image URL:', this.imageUrl);
  }

  async uploadImage(): Promise<void> {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('userId', '1'); // Pretpostavljeni ID korisnika

      try {
        // const response = await axios.post(
        //   'http://localhost:8080/api/upload',
        //   formData,
        //   {
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //       // Authorization:
        //       //   'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiXSwic3ViIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNzIxNjkyMTk4LCJleHAiOjE3MjE2OTU3OTh9.nwSPIMUoG5r7zQScfJGryH1nD9x5pfH_se_BiOZOny0'
        //     }
        //   }
        // );
        // this.uploadResponse = response.data;
        const response = await this.uploadService.uploadImage(formData);
        // this.uploadResponse = response.message;
        console.log('Upload successful:', response);
      } catch (error) {
        console.error('Error uploading image', error);
      }
    }
  }
}

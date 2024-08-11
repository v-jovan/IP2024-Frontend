import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ImageUploaderComponent } from '@components/image-uploader/image-uploader.component';
import { UploadService } from 'src/app/services/Upload/upload.service';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    DividerModule,
    ButtonModule,
    ImageUploaderComponent,
    InputTextModule,
    DropdownModule,
    InputTextareaModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  imageUrl: string | null = 'assets/profile.jpg';
  selectedFile: File | null = null;

  constructor(
    private uploadService: UploadService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  onImageUploaded(imageUrl: string | null): void {
    console.log('Image uploaded:', imageUrl);
  }
}

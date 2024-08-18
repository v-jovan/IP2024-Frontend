import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ImageUploaderComponent } from '@components/image-uploader/image-uploader.component';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { City } from 'src/app/interfaces/misc/city';
import { CityService } from 'src/app/services/City/city.service';
import { LoaderService } from 'src/app/services/Loader/loader.service';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { UserService } from 'src/app/services/User/user.service';
import { UserInfoResponse } from 'src/app/interfaces/responses/user-info-response';
import { BottomToolbarComponent } from '@components/bottom-toolbar/bottom-toolbar.component';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    DividerModule,
    ButtonModule,
    ImageUploaderComponent,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    BottomToolbarComponent,
    FloatLabelModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  cities: City[] = [];
  userData: UserInfoResponse | undefined;
  imageUrl: string | null | undefined;
  selectedFile: File | null = null;

  @ViewChild(ImageUploaderComponent) imageUploader!: ImageUploaderComponent;

  userDataForm: FormGroup = this.fb.group({
    username: [{ value: '', disabled: true }],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    avatarUrl: [''],
    biography: ['', Validators.maxLength(500)],
    cityId: [null, Validators.required]
  });

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private cityService: CityService,
    private loaderService: LoaderService,
    private errorInterceptor: ErrorInterceptorService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.loaderService.show();
      this.cities = await this.cityService.getCities();
      this.userData = await this.userService.getUserInfo();
      if (this.userData) {
        this.userDataForm.patchValue(this.userData);
      }
    } catch (error) {
      this.errorInterceptor.handleError(error as AxiosError);
    } finally {
      this.loaderService.hide();
    }
  }

  async onImageUploaded(): Promise<void> {
    const imageUrl = await this.imageUploader.uploadImage();
    if (imageUrl) {
      this.userDataForm.patchValue({ avatarUrl: imageUrl });
    }
  }

  clearImage(): void {
    this.imageUploader.clearImage();
    this.userDataForm.patchValue({ avatarUrl: null });
  }

  async saveChanges(): Promise<void> {
    if (!this.userDataForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Greška',
        detail: 'Forma nije validna. Molimo provjerite unos.'
      });
      return;
    }
    this.loaderService.show();
    try {
      // This part is for creating/selecting a city
      const updateUserData = this.userDataForm.value;
      const city = this.cities.find(
        (city) => city.id === this.userDataForm.value.cityId
      );

      if (!city) {
        const newCity: City = await this.cityService.createCity({
          name: this.userDataForm.value.cityId
        });
        updateUserData.cityId = newCity?.id;
      }

      this.userData = await this.userService.updateUserInfo(
        this.userDataForm.value
      );
      if (this.userData) {
        this.userDataForm.patchValue(this.userData);
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Uspjeh',
        detail: 'Podaci su uspješno ažurirani'
      });
      window.location.reload();
    } catch (error) {
      this.errorInterceptor.handleError(error as AxiosError);
    } finally {
      this.loaderService.hide();
    }
  }

  discardChanges(): void {
    window.location.href = '/dashboard';
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { BottomToolbarComponent } from '../../../components/bottom-toolbar/bottom-toolbar.component';
import { FitnessProgramService } from 'src/app/services/FitnessProgram/fitness-program.service';
import { FitnessProgramRequest } from 'src/app/interfaces/requests/fitness-program-request';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { AttributeService } from 'src/app/services/Attribute/attribute.service';
import { CategoryService } from 'src/app/services/Category/category.service';
import { LoaderService } from 'src/app/services/Loader/loader.service';
import { Category } from 'src/app/interfaces/misc/category';
import {
  Attribute,
  Attribute as CategoryAttribute
} from 'src/app/interfaces/misc/attribute';
import { FieldsetModule } from 'primeng/fieldset';
import { Location as CategoryLocation } from 'src/app/interfaces/misc/location';
import { AttributeValue } from 'src/app/interfaces/misc/attribute-value';
import { LocationService } from 'src/app/services/Location/location.service';
import { UserService } from 'src/app/services/User/user.service';
import { UserInfo } from 'src/app/interfaces/misc/user-info';
import { FormUtilsService } from 'src/app/services/FormUtils/form-utils.service';
import { ActivatedRoute } from '@angular/router';
import { GalleriaModule } from 'primeng/galleria';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-edit-program',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    FileUploadModule,
    FloatLabelModule,
    InputTextareaModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
    BottomToolbarComponent,
    ButtonModule,
    HttpClientModule,
    SliderModule,
    TooltipModule,
    GalleriaModule,
    FieldsetModule
  ],
  templateUrl: './edit-program.component.html',
  styleUrl: './edit-program.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EditProgramComponent implements OnInit {
  programId!: string;
  categories: Category[] = [];
  locations: CategoryLocation[] = [];
  selectedCategoryAttributes: CategoryAttribute[] = [];
  userInfo: UserInfo | undefined;

  canAddAttribute: boolean = false;
  filteredAttributesLength: number = 0;
  selectedAttributeValues: { [key: number]: AttributeValue[] } = {};

  programForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    difficultyLevel: [0, Validators.required],
    youtubeUrl: [null],
    duration: [null, [Validators.required, Validators.min(10)]],
    price: [null, [Validators.required, Validators.min(0)]],
    locationId: [null, Validators.required],
    categoryId: [null, Validators.required],
    onlineCheckbox: [false],
    specificAttributes: this.fb.array([])
  });

  uploadedFiles: File[] = [];
  programImages: string[] = [];
  originalImages: string[] = [];
  envUrl = environment.apiUrl;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  displayCustom!: boolean;
  activeIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private loaderService: LoaderService,
    private categoryService: CategoryService,
    private locationService: LocationService,
    private attributeService: AttributeService,
    private userService: UserService,
    private formUtils: FormUtilsService,
    private fitnessProgramService: FitnessProgramService,
    private errorInterceptorService: ErrorInterceptorService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.loaderService.show();
    this.programId = this.route.snapshot.paramMap.get('id')!;
    try {
      this.categories = await this.categoryService.getCategories();
      this.locations = await this.locationService.getLocations();
      this.userInfo = await this.userService.getUserInfo();

      const programData = await this.fitnessProgramService.getProgramById(
        this.programId
      );
      this.populateForm(programData);
    } catch (error) {
      this.errorInterceptorService.handleError(error);
    } finally {
      this.loaderService.hide();
    }
  }

  populateForm(programData: any) {
    this.programForm.patchValue({
      name: programData.name,
      description: programData.description,
      difficultyLevel: this.getDifficultyLevelIndex(
        programData.difficultyLevel
      ),
      youtubeUrl: programData.youtubeUrl,
      duration: programData.duration,
      price: programData.price,
      locationId: programData.locationId,
      categoryId: programData.categoryId,
      onlineCheckbox: programData.locationId === null
    });
    this.originalImages = [...programData.images];
    this.programImages = [...programData.images];

    if (programData.locationId === null) {
      this.programForm.get('locationId')?.disable();
    }

    this.populateSpecificAttributes(programData.specificAttributes);
  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  removeImage(imageUrl: string): void {
    this.programImages = this.programImages.filter(
      (image) => image !== imageUrl
    );
    this.displayCustom = false;
  }

  async populateSpecificAttributes(attributes: Attribute[]) {
    this.specificAttributes.clear();

    if (this.category) {
      this.selectedCategoryAttributes =
        await this.attributeService.getAttributesByCategory(this.category);
    }

    for (const attribute of attributes) {
      const specificAttributeGroup = this.fb.group({
        attributeName: [attribute.id, Validators.required],
        attributeValue: [attribute.selectedValue?.id, Validators.required]
      });

      const index = this.specificAttributes.length;
      this.selectedAttributeValues[index] = attribute.values;

      this.specificAttributes.push(specificAttributeGroup);
    }

    this.canAddAttribute = this.canAddMoreAttributes;
  }

  getDifficultyLevelIndex(level: string): number {
    return Object.values(this.difficultyLevelMap).indexOf(level);
  }

  get checkboxChecked() {
    return this.programForm.get('onlineCheckbox')?.value;
  }

  get specificAttributes() {
    return this.programForm.get('specificAttributes') as FormArray;
  }

  get category() {
    return this.programForm.get('categoryId')?.value;
  }

  get canAddMoreAttributes(): boolean {
    return this.getAvailableAttributes(-1).length > 0;
  }

  get formatedInfo(): string | undefined {
    if (this.userInfo?.firstName && this.userInfo?.lastName) {
      return `${this.userInfo?.firstName} ${this.userInfo?.lastName}`;
    } else if (this.userInfo?.firstName) {
      return `${this.userInfo?.firstName}`;
    } else {
      return this.userInfo?.email;
    }
  }

  private async fetchAttributesByCategory(categoryId: number) {
    try {
      this.selectedCategoryAttributes =
        await this.attributeService.getAttributesByCategory(categoryId);
    } catch (error) {
      this.errorInterceptorService.handleError(error);
    }
  }

  async onCategoryChange(event: DropdownChangeEvent) {
    const categoryId = event.value;
    this.specificAttributes.clear();
    await this.fetchAttributesByCategory(categoryId);
    this.addAttribute();
  }

  onAttributeChange(event: DropdownChangeEvent, index: number) {
    const selectedAttribute = this.selectedCategoryAttributes.find(
      (attribute) => attribute.id === event.value
    );

    if (selectedAttribute) {
      const currentFormGroup = this.specificAttributes.at(index);
      currentFormGroup.get('attributeValue')?.enable();
      currentFormGroup.patchValue({ attributeValue: '' });
      this.selectedAttributeValues[index] = [...selectedAttribute.values];
    }
  }

  onValueChange() {
    this.canAddAttribute = this.canAddMoreAttributes;
  }

  addAttribute() {
    this.canAddAttribute = false;
    const attributeGroup = this.fb.group({
      attributeName: [''],
      attributeValue: [{ value: '', disabled: true }]
    });
    this.specificAttributes.push(attributeGroup);
  }

  onCheckboxChange(event: CheckboxChangeEvent) {
    const locationControl = this.programForm.get('locationId');
    const youtubeUrlControl = this.programForm.get('youtubeUrl');

    if (event.checked) {
      locationControl?.disable();
      locationControl?.clearValidators();
      youtubeUrlControl?.setValidators([
        Validators.required,
        Validators.pattern('https?://.+')
      ]);
    } else {
      locationControl?.enable();
      youtubeUrlControl?.clearValidators();
      locationControl?.setValidators([Validators.required]);
    }
  }

  getAvailableAttributes(index: number) {
    const usedAttributes = this.specificAttributes.controls
      .filter((_, i) => i !== index)
      .map((group) => group.get('attributeName')?.value);

    const filteredAttributes = this.selectedCategoryAttributes.filter(
      (attr) => !usedAttributes.includes(attr.id)
    );

    this.filteredAttributesLength = filteredAttributes.length;

    return filteredAttributes;
  }

  uploadImage(event: FileUploadHandlerEvent): void {
    this.uploadedFiles = event.files;
  }

  choose(
    _: MouseEvent,
    chooseCallback: () => void,
    deleteCallback: () => void,
    uploadCallback: () => void
  ) {
    deleteCallback();
    chooseCallback();
    uploadCallback();
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isTouchedAndInvalid(this.programForm, controlName);
  }

  difficultyLevelMap: { [key: number]: string } = {
    0: 'BEGINNER',
    1: 'INTERMEDIATE',
    2: 'ADVANCED'
  };

  async saveChanges() {
    if (this.programForm.valid) {
      const formValues = this.programForm.value;

      const programData: FitnessProgramRequest = {
        ...formValues,
        difficultyLevel: this.difficultyLevelMap[formValues.difficultyLevel],
        specificAttributes: this.specificAttributes.value
      };

      try {
        if (this.programId) {
          const removedImages = this.getRemovedImages();

          await this.fitnessProgramService.updateProgram(
            this.programId,
            programData,
            this.uploadedFiles,
            removedImages
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Uspjeh',
            detail: 'Program uspješno ažuriran!'
          });
        } else {
          await this.fitnessProgramService.createProgram(
            programData,
            this.uploadedFiles
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Uspjeh',
            detail: 'Program kreiran uspješno!'
          });
        }
      } catch (error) {
        this.errorInterceptorService.handleError(error);
      }
    } else {
      this.programForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Upozorenje',
        detail: 'Molimo popunite sva polja i dodajte slike.'
      });
    }
  }

  getRemovedImages(): string[] {
    const originalImages = new Set(this.originalImages);
    const currentImages = new Set(this.programImages);

    return [...originalImages].filter((image) => !currentImages.has(image));
  }

  discardChanges() {}
}

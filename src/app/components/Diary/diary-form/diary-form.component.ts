import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Activity } from 'src/app/interfaces/misc/activity';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormUtilsService } from 'src/app/services/FormUtils/form-utils.service';
import { CommonModule, DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ACTIVITY_TYPES } from '@components/util/activity-types';

@Component({
  selector: 'app-diary-form',
  standalone: true,
  imports: [
    DropdownModule,
    ButtonModule,
    FloatLabelModule,
    ReactiveFormsModule,
    InputNumberModule,
    CommonModule,
    InputTextModule
  ],
  providers: [DatePipe],
  templateUrl: './diary-form.component.html',
  styleUrl: './diary-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DiaryFormComponent implements OnChanges {
  @Input({ required: true }) activity!: Activity | null;
  @Output() addNewActivity: EventEmitter<Activity> =
    new EventEmitter<Activity>();

  readonly dateFormat = 'dd.MM.yyyy';

  activityTypes = ACTIVITY_TYPES;

  intensityOptions = [
    { label: 'Nizak', value: 'Low' },
    { label: 'Srednji', value: 'Medium' },
    { label: 'Visok', value: 'High' }
  ];

  activityForm: FormGroup = this.fb.group({
    activityType: ['', Validators.required],
    duration: ['', [Validators.required, Validators.min(1)]],
    intensity: ['', Validators.required],
    result: ['', Validators.required],
    logDate: [
      this.datePipe.transform(new Date(), this.dateFormat),
      Validators.required
    ]
  });

  constructor(
    private fb: FormBuilder,
    private formUtils: FormUtilsService,
    private datePipe: DatePipe
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activity'] && changes['activity'].currentValue) {
      this.patchActivity();
    } else {
      this.activityForm.reset({
        logDate: this.datePipe.transform(new Date(), this.dateFormat)
      });
    }
  }

  patchActivity() {
    const formattedDate = this.datePipe.transform(
      this.activity?.logDate,
      this.dateFormat
    );
    this.activityForm.patchValue({
      ...this.activity,
      logDate: formattedDate
    });
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isTouchedAndInvalid(this.activityForm, controlName);
  }

  addActivity() {
    this.addNewActivity.emit({
      ...this.activityForm.value,
      logDate: new Date()
    });
    this.activityForm.reset({
      logDate: this.datePipe.transform(new Date(), this.dateFormat)
    });
  }
}

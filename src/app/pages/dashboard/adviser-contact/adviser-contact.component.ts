import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormsModule,
  Validators,
  FormGroup
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ErrorInterceptorService } from '../../../interceptors/error.interceptor';
import { UserService } from '../../../services/User/user.service';
import { Adviser } from 'src/app/interfaces/misc/adviser';
import { TokenStoreService } from '../../../store/TokenStore/token-store.service';
import { FormUtilsService } from '../../../services/FormUtils/form-utils.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessagingService } from '../../../services/Messaging/messaging.service';
import { Message } from '../../../interfaces/misc/message';

@Component({
  selector: 'app-adviser-contact',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    InputTextareaModule,
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  templateUrl: './adviser-contact.component.html',
  styleUrl: './adviser-contact.component.scss'
})
export class AdviserContactComponent implements OnInit {
  advisers: Adviser[] = [];
  email: string = '';

  contactForm: FormGroup = this.fb.group({
    recipientId: [0, Validators.required],
    senderId: [0, Validators.required],
    subject: ['', Validators.required],
    content: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private tokenStoreService: TokenStoreService,
    private errorInterceptor: ErrorInterceptorService,
    private formUtils: FormUtilsService,
    private router: Router,
    private messagingService: MessagingService
  ) {}

  async ngOnInit() {
    await this.fetchAdvisers();
    await this.getSenderId();
    this.email = this.tokenStoreService.getUserEmail() || '';
  }

  get noAdvisers() {
    return this.advisers.length === 0;
  }

  async fetchAdvisers() {
    try {
      this.advisers = await this.userService.getAdvisers();
    } catch (error) {
      this.errorInterceptor.handleError(error);
    }
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isTouchedAndInvalid(this.contactForm, controlName);
  }

  async send() {
    try {
      const message: Message = this.contactForm.value;
      await this.messagingService.sendMessage(message);
      this.messageService.add({
        severity: 'success',
        summary: 'Uspješno',
        detail: 'Poruka je uspješno poslana!'
      });
      this.contactForm.reset();
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorInterceptor.handleError(error);
    }
  }

  async getSenderId() {
    try {
      const userId: number = await this.userService.getUserId();
      this.contactForm.patchValue({
        senderId: userId
      });
    } catch (error) {
      this.errorInterceptor.handleError(error);
    }
  }
}

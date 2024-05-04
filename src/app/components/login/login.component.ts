import { Component, ViewEncapsulation } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DividerModule,
    TabViewModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  activeIndex: number = 0;
  visible: boolean = false;
  username: string = '';
  password!: string;

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  goToRegister() {
    this.activeIndex = 1;
  }

  goToLogin() {
    this.activeIndex = 0;
  }
}

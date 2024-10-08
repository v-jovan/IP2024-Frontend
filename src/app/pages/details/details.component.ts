import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';
import { ConvertMinutesPipe } from '@pipes/convert-minutes.pipe';
import { CurrencyPipe, Location } from '@angular/common';
import { FitnessProgramService } from 'src/app/services/FitnessProgram/fitness-program.service';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { CommentsComponent } from '@components/comments/comments.component';
import { CartStoreService } from 'src/app/store/CartStore/cart-store.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/Loader/loader.service';
import { UserService } from 'src/app/services/User/user.service';
import { UserProgramResponse } from 'src/app/interfaces/responses/user-program-response';
import { ProgramStatus } from 'src/app/enums/program-status';
import { DialogModule } from 'primeng/dialog';
import { LoginService } from 'src/app/services/LoginForm/login.service';
import { OrderService } from 'src/app/services/Order/order.service';
import { DifficultyPipe } from '../../pipes/difficulty.pipe';
import { ErrorComponent } from '../../components/error/error.component';
import { UrlPipe } from '../../pipes/url.pipe';

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  imports: [
    ButtonModule,
    GalleriaModule,
    DividerModule,
    ScrollPanelModule,
    TagModule,
    ConvertMinutesPipe,
    CurrencyPipe,
    CommentsComponent,
    DialogModule,
    DifficultyPipe,
    ErrorComponent,
    UrlPipe
  ],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {
  programId!: string;
  images: string[] = [];
  isInCart: boolean = false;
  isProgramPurchased: boolean = false;
  cartSubscription!: Subscription;
  myId: number = 0;
  fetchError: boolean = false;
  isLoading: boolean = false;

  instructorDialogVisibility: boolean = false;
  instructorBiography: string = '';

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
  program!: FitnessProgram;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private fitnessProgramService: FitnessProgramService,
    private orderService: OrderService,
    private tokenStoreService: TokenStoreService,
    private cartStoreService: CartStoreService,
    private userService: UserService,
    private loaderService: LoaderService,
    private loginService: LoginService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.loaderService.show();
      this.isLoading = true;
      this.programId = params.get('id') as string;
      await this.loadProgramDetails();
      this.checkIfInCart();
      await this.checkIfProgramPurchased();
      if (this.isLoggedIn) {
        this.myId = await this.userService.getUserId();
      }
      this.isLoading = false;
    });

    this.cartSubscription = this.cartStoreService
      .getCartItems()
      .subscribe(() => {
        this.checkIfInCart();
      });
    this.loaderService.hide();
  }

  checkIfInCart(): void {
    this.isInCart = this.cartStoreService.isInCart(parseInt(this.programId));
  }

  async getBiography() {
    try {
      const instructor = await this.userService.getUserInfoById(
        this.program.instructorId as number
      );
      this.instructorBiography = instructor.biography;
    } catch (error) {}
  }

  async checkIfProgramPurchased() {
    if (this.tokenStoreService.isLoggedIn()) {
      try {
        const purchasedProgramsResponse =
          await this.orderService.getPurchasedPrograms({
            page: 0,
            size: 100
          });
        const purchasedPrograms = purchasedProgramsResponse.content;

        this.isProgramPurchased = purchasedPrograms.some(
          (program: UserProgramResponse) =>
            program.id === parseInt(this.programId) &&
            program.status === ProgramStatus.ACTIVE
        );
      } catch (error) {}
    }
  }

  async loadProgramDetails() {
    this.images = [] as string[];
    try {
      this.program = await this.fitnessProgramService.getProgramById(
        this.programId
      );
      this.program.images.forEach((image) => {
        this.images.push(image);
      });
    } catch (error) {
      this.fetchError = true;
    }
  }

  get isLoggedIn(): boolean {
    return this.tokenStoreService.isLoggedIn();
  }

  addToCart(): void {
    if (!this.isLoggedIn) {
      this.loginService.requestLogin();
    } else {
      const cartItem = {
        id: this.program.id,
        name: this.program.name,
        price: this.program.price,
        imgURL: this.program?.images[0]
      };

      const success = this.cartStoreService.addToCart(cartItem);
      if (success) {
        this.isInCart = true;
      }
    }
  }

  goBack() {
    this.location.back();
  }

  async showInstructorDialog() {
    if (this.program.instructorId) {
      await this.getBiography();
      this.instructorDialogVisibility = true;
    }
  }
}

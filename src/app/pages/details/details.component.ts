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
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { environment } from 'src/environments/environment.development';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { CommentsComponent } from '@components/comments/comments.component';
import { CartStoreService } from 'src/app/store/CartStore/cart-store.service';
import { Subscription } from 'rxjs';

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
    CommentsComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {
  programId!: string;
  images: string[] = [];
  apiUrl: string = environment.apiUrl;
  isInCart: boolean = false;
  cartSubscription!: Subscription;

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
    private errorInterceptorService: ErrorInterceptorService,
    private tokenStoreService: TokenStoreService,
    private cartStoreService: CartStoreService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.programId = params.get('id') as string;
      this.loadProgramDetails();
      this.checkIfInCart();
    });

    this.cartSubscription = this.cartStoreService
      .getCartItems()
      .subscribe(() => {
        this.checkIfInCart(); // Proveri svaki put kada se korpa promeni
      });
  }

  checkIfInCart(): void {
    this.isInCart = this.cartStoreService.isInCart(parseInt(this.programId));
  }

  async loadProgramDetails() {
    this.images = [] as string[];
    try {
      this.program = await this.fitnessProgramService.getProgramById(
        this.programId
      );
      this.program.images.forEach((image) => {
        this.images.push(`${this.apiUrl}${image}`);
      });
    } catch (error) {
      this.errorInterceptorService.handleError(error as AxiosError);
    }
  }

  get isLoggedIn(): boolean {
    return this.tokenStoreService.isLoggedIn();
  }

  addToCart(): void {
    const cartItem = {
      id: this.program.id,
      name: this.program.name,
      price: this.program.price,
      imgURL: this.images[0]
    };

    const success = this.cartStoreService.addToCart(cartItem);
    if (success) {
      this.isInCart = true;
    }
  }

  goBack() {
    this.location.back();
  }
}

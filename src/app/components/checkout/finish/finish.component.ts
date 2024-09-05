import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';
import { CartStoreService } from 'src/app/store/CartStore/cart-store.service';
import { CartItem } from 'src/app/interfaces/misc/cart-item';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { FitnessProgramService } from 'src/app/services/FitnessProgram/fitness-program.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { YoutubePipe } from "../../../pipes/youtube.pipe";

@Component({
  selector: 'finish',
  standalone: true,
  imports: [TableModule, CurrencyPipe, ButtonModule, DialogModule, YoutubePipe],
  templateUrl: './finish.component.html',
  styleUrl: './finish.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FinishComponent implements OnInit {
  cartItems: CartItem[] = [];
  programs: FitnessProgram[] = [];
  videoDialogVisible: boolean = false;
  videoUrl: string | null = null;

  constructor(
    private cartStoreService: CartStoreService,
    private fitnessProgramService: FitnessProgramService,
  ) {
  }

  ngOnInit(): void {
    this.cartStoreService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.fetchFitnessPrograms();
    });
  }

  async fetchFitnessPrograms() {
    const programPromises = this.cartItems.map(async (item) => {
      const program = await this.fitnessProgramService.getProgramById(
        item.id.toString()
      );
      return program;
    });

    this.programs = await Promise.all(programPromises);
  }

  showVideoDialog(youtubeUrl: string) {
    this.videoUrl = youtubeUrl.replace('watch?v=', 'embed/');
    this.videoDialogVisible = true;
  }
  clearVideoUrl() {
    this.videoUrl = null;
  }

  getSum() {
    return this.cartItems.reduce((acc, product) => acc + product.price, 0);
  }

  ngOnDestroy() {
    this.cartStoreService.clearCart();
  }
}

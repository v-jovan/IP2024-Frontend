import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'finish',
  standalone: true,
  imports: [TableModule, CurrencyPipe],
  templateUrl: './finish.component.html',
  styleUrl: './finish.component.scss'
})
export class FinishComponent implements OnInit {
  products!: any[];
  ngOnInit(): void {
    this.products = [
      {
        name: 'Product 1',
        price: 100
      },
      {
        name: 'Product 2',
        price: 200
      }
    ];
  }

  getSum() {
    return this.products.reduce((acc, product) => acc + product.price, 0);
  }
}

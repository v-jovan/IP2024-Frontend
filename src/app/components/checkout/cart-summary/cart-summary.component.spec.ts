import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { CartSummaryComponent } from './cart-summary.component';

describe('CartSummaryComponent', () => {
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent],
      providers: [CurrencyPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct cart items', () => {
    component.cartItems = [
      { name: 'Dynamic Product 1', price: 30 },
      { name: 'Dynamic Product 2', price: 50 },
      { name: 'Dynamic Product 3', price: 20 }
    ];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cartItems = compiled.querySelectorAll('.cart__item');
    expect(cartItems.length).toBe(component.cartItems.length);

    component.cartItems.forEach((item, index) => {
      expect(cartItems[index].textContent).toContain(item.name);
      expect(cartItems[index].textContent).toContain(item.price.toString());
    });
  });

  it('should display the correct total', () => {
    component.cartItems = [
      { name: 'Dynamic Product 1', price: 30 },
      { name: 'Dynamic Product 2', price: 50 },
      { name: 'Dynamic Product 3', price: 20 }
    ];
    fixture.detectChanges();

    const total = component.cartItems.reduce(
      (sum, item) => sum + item.price,
      0
    );
    const compiled = fixture.nativeElement as HTMLElement;
    const totalElement = compiled.querySelector('.cart__total span:last-child');
    expect(totalElement?.textContent).toContain(total.toString());
  });

  it('getTotal should return the correct total', () => {
    component.cartItems = [
      { name: 'Dynamic Product 1', price: 30 },
      { name: 'Dynamic Product 2', price: 50 },
      { name: 'Dynamic Product 3', price: 20 }
    ];
    fixture.detectChanges();

    const expectedTotal = component.cartItems.reduce(
      (sum, item) => sum + item.price,
      0
    );
    expect(component.getTotal()).toBe(expectedTotal);
  });
});

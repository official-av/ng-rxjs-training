import {ChangeDetectionStrategy, Component} from '@angular/core';

import {EMPTY} from 'rxjs';
import {ProductService} from './product.service';
import {catchError} from 'rxjs/operators';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;

  products$ = this.productService.products$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );
  // products$: Observable<Product[]> = of([]);
  // products: Product[] = [];
  // sub: Subscription;

  constructor(private productService: ProductService) {
  }

  // ngOnInit(): void {
  //   // this.sub = this.productService.getProducts()
  //   //   .subscribe(
  //   //     products => this.products = products,
  //   //     error => this.errorMessage = error
  //   //   );
  //   // this.products$ = this.productService.getProducts()
  //   //   .pipe(
  //   //     catchError(err => {
  //   //       this.errorMessage = err;
  //   //       return EMPTY;
  //   //     })
  //   //   );
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}

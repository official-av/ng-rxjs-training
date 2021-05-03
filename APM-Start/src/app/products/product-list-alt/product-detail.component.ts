import {ChangeDetectionStrategy, Component} from '@angular/core';

import {ProductService} from '../product.service';
import {catchError, filter, map} from 'rxjs/operators';
import {combineLatest, EMPTY, Subject} from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private errMessageSubject = new Subject<number>();
  errorMessage$ = this.errMessageSubject.asObservable();
  product$ = this.productService.selectedProduct$.pipe(
    catchError(err => {
      this.errMessageSubject.next(err);
      return EMPTY;
    })
  );
  productSuppliers$ = this.productService.selectedProductsSupplier$.pipe(
    catchError(err => {
      this.errMessageSubject.next(err);
      return EMPTY;
    })
  );
  pageTitle$ = this.product$.pipe(
    map(p => p ? `Product Details for: ${p.productName}` : null)
  );
  vm$ = combineLatest([this.product$, this.productSuppliers$, this.pageTitle$]).pipe(
    filter(([product]) => Boolean(product)),
    map(([product, productSuppliers, pageTitle]) => ({product, productSuppliers, pageTitle}))
  );

  constructor(private productService: ProductService) {
  }

}

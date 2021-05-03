import {ChangeDetectionStrategy, Component} from '@angular/core';

import {ProductService} from '../product.service';
import {catchError} from 'rxjs/operators';
import {EMPTY, Subject} from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  private errMessageSubject = new Subject<number>();
  errorMessage$ = this.errMessageSubject.asObservable();
  product$ = this.productService.selectedProduct$.pipe(
    catchError(err => {
      this.errMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(private productService: ProductService) {
  }

}

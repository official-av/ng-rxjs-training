import {ChangeDetectionStrategy, Component} from '@angular/core';

import {BehaviorSubject, combineLatest, EMPTY, Subject} from 'rxjs';
import {ProductService} from './product.service';
import {catchError, map} from 'rxjs/operators';
import {ProductCategoryService} from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  private errMessageSubject = new Subject<number>();
  errorMessage$ = this.errMessageSubject.asObservable();
  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError(err => {
      this.errMessageSubject.next(err);
      return EMPTY;
    })
  );
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([this.productService.productsWithAdd$, this.categorySelectedAction$])
    .pipe(
      map(([products, selectedCategoryID]) =>
        products.filter(product => selectedCategoryID ? product.categoryId === selectedCategoryID : true)),
      catchError(err => {
        this.errMessageSubject.next(err);
        return EMPTY;
      })
    );
  // products$: Observable<Product[]> = of([]);
  // products: Product[] = [];
  // sub: Subscription;

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) {
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
    this.productService.addProductSubject.next(this.productService.fakeProduct());
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {combineLatest, merge, Observable, Subject, throwError} from 'rxjs';
import {catchError, map, scan, shareReplay, tap} from 'rxjs/operators';

import {Product} from './product';
import {SupplierService} from '../suppliers/supplier.service';
import {ProductCategoryService} from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;
  products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      // map(products => products.map(product => ({...product, price: product.price * 1.5} as Product))),
      tap(data => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
    );
  productsWithCategory$ = combineLatest([this.products$, this.categoryService.productCategories$])
    .pipe(
      map(([products, categories]) => products.map(product => ({
          ...product,
          price: product.price * 1.5,
          category: categories.find(cat => product.categoryId === cat.id).name
        } as Product))
      ),
      shareReplay(1)
    );


  selectedProductIdSubject = new Subject<number>();
  selectProductIdAction$ = this.selectedProductIdSubject.asObservable();

  selectedProduct$ = combineLatest([this.productsWithCategory$, this.selectProductIdAction$]).pipe(
    map(([products, selectedProductId]) => products.find(product => product.id === selectedProductId) as Product),
    tap(product => console.log('Selected Product', product)),
    shareReplay(1)
  );

  addProductSubject = new Subject<Product>();
  addProduct$ = this.addProductSubject.asObservable();
  productsWithAdd$ = merge(this.productsWithCategory$, this.addProduct$).pipe(
    scan((acc: Product[], value: Product) => [...acc, value])
  );

  constructor(private http: HttpClient,
              private supplierService: SupplierService,
              private categoryService: ProductCategoryService) {
  }

  /*getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(data => console.log('Products: ', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }*/

  public fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Brand } from '../shared/models/brand';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { ProductType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl: string = "https://localhost:5001/api";

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();
    if (shopParams.brandId !== 0) params = params.append('brandId', shopParams.brandId.toString());
    if (shopParams.typeId !== 0) params = params.append('typeId', shopParams.typeId.toString());
    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());
    if (shopParams.search)
      params = params.append('search', shopParams.search);

    console.log(params);

    return this.http.get<Pagination>(`${this.baseUrl}/products`, { observe: 'response', params }) //this returns httpresponse<Pagination>
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getProduct(id: number){
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  getBrands() {
    return this.http.get<Brand[]>(`${this.baseUrl}/products/brands`);
  }

  getTypes() {
    return this.http.get<ProductType[]>(`${this.baseUrl}/products/types`);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { Product } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$: Observable<IBasketTotals> = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get<IBasket>(`${this.baseUrl}/basket`, { params: params })
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          //console.log(this.getCurrentBasketValue());
          this.calculateTotals();
        })
      )
  }

  setBasket(basket: IBasket) {
    return this.http.post(`${this.baseUrl}/basket`, basket)
      .subscribe((response: IBasket) => {
        this.basketSource.next(response);
        //console.log(response);
        this.calculateTotals();
      }, error => {
        console.log(error);
      })
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: Product, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(e => e.id === item.id);
    if (foundItemIndex !== -1)
      basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    //debugger;
    let basket = this.getCurrentBasketValue();
    const index = basket.items.findIndex(e => e.id === item.id);

    if (basket.items[index].quantity > 1) {
      basket.items[index].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }
  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(e => e.id === item.id)) {
      basket.items = basket.items.filter(e => e.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    let params = new HttpParams();
    params = params.set('id', basket.id);
    return this.http.delete(`${this.baseUrl}/basket/delete`, { params: params })
      .subscribe(() => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
      }, error=>{
        console.log(error);
      });
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    /*if(items.filter(e=>e.id === itemToAdd.id).length > 0){
      items.filter(e=>e.id === itemToAdd.id)[0].quantity+=quantity;
    }else{
      items.push(itemToAdd);
    }
    return items;*/

    const index = items.findIndex(e => e.id === itemToAdd.id);
    if (index === -1) {
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subtotal = basket.items
      .reduce((accumulated, item) =>
        accumulated + (item.price * item.quantity), 0);
    const total = shipping + subtotal;
    this.basketTotalSource.next({ total: total, subtotal: subtotal, shipping: shipping });
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: Product, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity: quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }
}


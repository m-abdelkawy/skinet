import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit {
  baseUrl: string = environment.apiUrl;
  validationErrors: string[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get500Error(){
    return this.http.get(`${this.baseUrl}/buggy/servererror`).subscribe(res=>{
      console.log(res);
    }, error =>{
      console.log(error);
    });
  }

  get400Error(){
    return this.http.get(`${this.baseUrl}/buggy/badrequest`).subscribe(res=>{
      console.log(res);
    }, error =>{
      console.log(error);
    });
  }

  get400ValidationError(){
    return this.http.get(`${this.baseUrl}/products/fortytwo`).subscribe(res=>{
      console.log(res);
    }, error =>{
      console.log(error);
      this.validationErrors = error.errors;
    });
  }

  get404Error(){
    return this.http.get(`${this.baseUrl}/products/42`).subscribe(res=>{
      console.log(res);
    }, error =>{
      console.log(error);
    });
  }
}

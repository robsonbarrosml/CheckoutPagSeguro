import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  ngxXml2jsonService: NgxXml2jsonService;

  constructor(private http: HttpClient) {
  }

  // Requisição POST para geração do código de checkout
  public getAuthCode(item): Observable<any> {
  const headers = new HttpHeaders().set('Content-Type', 'application/xml; charset=utf-8');
  return this.http.post(`/api/v2/checkout?email=rbsbarros10@gmail.com`
  + `&token=9A72F77566F24C309A8A1690776C889C`, item, { headers, responseType: 'text'});
  }

  // Requisição GET para redirecionar à tela de pagamento
  public setPayment(code): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/xml; charset=utf-8');
    return this.http.get(`/pay/v2/checkout/payment.html?code=` + code, {headers:
      {'Content-Type': 'application/xml', 'Access-Control-Allow-Origin': '*' } });
    }
  }
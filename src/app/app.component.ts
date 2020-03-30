import { Component } from '@angular/core';
import { Item } from './models/item.model';
import { PaymentService } from 'src/app/services/payment.service';
import { parseString } from 'xml2js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  totalValue: number;
  selectedItem: Item;
  items: Item[];
  // Variável para simular o que deve ser enviado no Payload
  itemPayload: any;
  urlPayment: any;

  constructor(private paymentService: PaymentService) {
    this.items = [
      { id: '0001', description: 'TV LG 48 Poledas 4K', quantity: '1', weight: '25000', amount: '1800.00', shippingCost: '40.00' },
      { id: '0002', description: 'Home Theater Samsung 1000w', quantity: '1', weight: '12000', amount: '1500.00', shippingCost: '30.00' },
      { id: '0003', description: 'Microondas 30L Eletrolux', quantity: '1', weight: '10000', amount: '600.00', shippingCost: '30.00' },
      { id: '0004', description: 'MacBook Pro I7 16GB SSD 500GB', quantity: '1', weight: '2000', amount: '9000.00', shippingCost: '20.00' }
    ];
    this.totalValue = + this.items[0].amount;
    this.setPayload(this.selectedItem = this.items[0]);
  }

  setPayload(selectedItem: Item) {
    this.itemPayload =  '<?xml version="1.0"?>' +
                        '<checkout>' +
                          '<sender>' +
                            '<name>Jose Comprador</name>' +
                            '<email>comprador@teste.com.br</email>' +
                            '<phone>' +
                              '<areaCode>99</areaCode>' +
                              '<number>999999999</number>' +
                            '</phone>' +
                            '<documents>' +
                              '<document>' +
                                '<type>CPF</type>' +
                                '<value>11475714734</value>' +
                              '</document>' +
                            '</documents>' +
                          '</sender>' +
                          '<currency>BRL</currency>' +
                          '<items>' +
                            '<item>' +
                              '<id>' + this.selectedItem.id + '</id>' +
                              '<description>' + this.selectedItem.description + '</description>' +
                              '<amount>' + this.selectedItem.amount + '</amount>' +
                              '<quantity>' + this.selectedItem.quantity + '</quantity>' +
                              '<weight>' + this.selectedItem.weight + '</weight>' +
                              '<shippingCost>' + this.selectedItem.shippingCost + '</shippingCost>' +
                            '</item>' +
                          '</items>' +
                          '<redirectURL>http://g1.globo.com/</redirectURL>' +
                          '<extraAmount>4.00</extraAmount>' +
                          '<reference>teste9999</reference>' +
                          '<shipping>' +
                            '<address>' +
                              '<street>Av. PagSeguro</street>' +
                              '<number>9999</number>' +
                              '<complement>99o andar</complement>' +
                              '<district>Jardim Internet</district>' +
                              '<city>Cidade Exemplo</city>' +
                              '<state>SP</state>' +
                              '<country>BRA</country>' +
                              '<postalCode>99999999</postalCode>' +
                            '</address>' +
                            '<type>1</type>' +
                            '<cost>1.00</cost>' +
                            '<addressRequired>true</addressRequired>' +
                          '</shipping>' +
                          '<timeout>25</timeout>' +
                          '<maxAge>999999999</maxAge>' +
                          '<maxUses>999</maxUses>' +
                          '<receiver>' +
                            '<email>rbsbarros10@gmail.com</email>' +
                          '</receiver>' +
                          '<enableRecovery>false</enableRecovery>' +
                        '</checkout>';
  }

  // Exibe na tabela o item selecionado no comboBox e o seta no Payload
  chosenItem(event: string): void {
    this.selectedItem = JSON.parse(event);
    this.totalValue = + this.selectedItem.amount;
    this.setPayload(this.selectedItem);
  }

  // Calcula o valor unitário multiplicado pela quantidade de items informados e seta a quantidade no Payload
  calculateValue(valor: string) {
    this.totalValue = + valor * + this.selectedItem.amount;
    console.log('totalValue: ' + this.totalValue + ', selectedItem.amount: ' + this.selectedItem.amount);
    this.selectedItem.quantity = valor;
    this.setPayload(this.selectedItem);
  }

  // Cria o código de checkout e redireciona para a página do PagSeguro
  setPayment() {
    var code = '';
    this.paymentService.getAuthCode(this.itemPayload).subscribe(val => {
      parseString(val, function (err, result) {
        code = result.checkout.code[0];
      });
      this.urlPayment = 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=' + code;
      this.goToUrl(this.urlPayment);
    });
  }

  goToUrl(url): void {
    document.location.href = url;
  }
}



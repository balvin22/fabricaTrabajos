import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { TipoTransaccion } from '@shared/models/tipo-transaccion';
import { TransaccionModel } from '@shared/models/transaccion-model';
@Injectable({
  providedIn: 'root'
})
export class TipoTransaccionService {
  private http= inject(HttpClient);
  url:string=`TipoTransacciones`
  constructor() { }
  getAll(){
    return this.http.get<TipoTransaccion[]>(this.url)
  }
  
}

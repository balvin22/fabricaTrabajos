import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { CreateTransaccionDTO } from '@shared/dto/create-transaccion-dto';
import { TransaccionModel } from '@shared/models/transaccion-model';
const{API_URL} = environment
@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  private http= inject(HttpClient);
url:string=`${API_URL}/Transacciones`
  constructor() { }
getAll(){
  return this.http.get<TransaccionModel[]>(this.url)
}

create(data:CreateTransaccionDTO){
  return this.http.post<TransaccionModel>(this.url,data)

}
delete(data:CreateTransaccionDTO){
  return this.http.delete<TransaccionModel>(this.url,{{id}})

}


}

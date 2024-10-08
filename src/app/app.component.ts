import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CreateTransaccionDTO } from '@shared/dto/create-transaccion-dto';
import { TipoTransaccion } from '@shared/models/tipo-transaccion';
import { TransaccionModel } from '@shared/models/transaccion-model';
import { TipoTransaccionService } from '@shared/services/tipo-transaccion.service';
import { TransaccionService } from '@shared/services/transaccion.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private transaccionservices = inject(TransaccionService);
  private tipoTransaccionservice = inject(TipoTransaccionService);
  formtransaccion: FormGroup | null = null;
  transacciones: TransaccionModel[] = []
  tipoTransacciones: TipoTransaccion[] = []

  indexTransaccion: number | null = null;
  ngOnInit(): void {
    this.getData();
  }
  getData() {
    const dataSub = forkJoin([
      this.transaccionservices.getAll(),
      this.tipoTransaccionservice.getAll(),


    ]).subscribe({
      next: ([transacciones, tipoTransaccionesa]) => {
        this.transacciones = [...transacciones];
        this.tipoTransacciones = [...tipoTransaccionesa];
      },
      complete() {
        dataSub.unsubscribe();
      }
    })
  }

  crear: boolean = false;
  crearTransaccion() {
    this.formtransaccion = this.formBuilder.group({
      monto: new FormControl(null, [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      transactiontype_id: new FormControl(null, [Validators.required])
    });
  }
  cancelarTransasccion() {
    this.formtransaccion = null;
  }
  GuardarTransasccion() {

    if (!this.formtransaccion || this.formtransaccion.invalid) {
      alert('porfavor completa toodos los espacios');
      return;
    }
    const { value } = this.formtransaccion;
    const nuevaTransaccion: CreateTransaccionDTO = value as CreateTransaccionDTO;
    const saveSub = this.transaccionservices.create(nuevaTransaccion).subscribe({
      next: (transaccion) => {
        this.transacciones = [...this.transacciones, transaccion];
      },
      complete: () => {
        saveSub.unsubscribe();

      }
    })

    // if (this.indexTransaccion!==null){
    //   let transacciones =[...this.transacciones];
    //   transacciones[this.indexTransaccion]= nuevaTransaccion;
    //   this.transacciones = [...transacciones]
    //   this.formtransaccion= null;
    //   this.indexTransaccion = null;
    // }
    // this.transacciones = [...this.transacciones,nuevaTransaccion];
    // this.formtransaccion= null;
  }
  eliminarTransaccion(index: number) {
    // let transacciones = [...this.transacciones];
    // transacciones.splice(index, 1)
    // this.transacciones = [...transacciones];

  }
  actualizarTransaccion(transaccion: TransaccionModel, index: number) {

    this.indexTransaccion = index;
    this.formtransaccion = this.formBuilder.group({
      monto: new FormControl(transaccion.monto, [Validators.required]),
      motivo: new FormControl(transaccion.motivo, [Validators.required])


    });
  }
}


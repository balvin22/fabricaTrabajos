import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTransaccionDTO } from '@shared/dto/create-transaccion-dto';
import { UpdateTransaccionDTO } from '@shared/dto/update-transaccion-dto';
import { TipoTransaccion } from '@shared/models/tipo-transaccion';
import { TransaccionModel } from '@shared/models/transaccion-model';
import { TipoTransaccionService } from '@shared/services/tipo-transaccion.service';
import { TransaccionService } from '@shared/services/transaccion.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-transacciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transacciones.component.html',
  styleUrl: './transacciones.component.css'
})
export class TransaccionesComponent implements OnInit {

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
      motivo: new FormControl(null, [Validators.required]),
      transactiontype_id: new FormControl(null, [Validators.required])
    });
  }
  cancelarTransasccion() {
    this.formtransaccion = null;
  }
  GuardarTransasccion() {

    if (!this.formtransaccion || this.formtransaccion.invalid) {
      alert('porfavor completa todos los espacios');
      return;
    }
    const { value } = this.formtransaccion;
    console.log(this.formtransaccion.get('id'));
    if (this.formtransaccion.get('id')) {
      const nuevaTransaccion: UpdateTransaccionDTO = value as UpdateTransaccionDTO;
      const UpdatesaveSub = this.transaccionservices.update(nuevaTransaccion).subscribe({
        next: (transaccion) => {
          let transacciones = [...this.transacciones];
          let transacciones_index = transacciones.findIndex((transaccion) => transaccion.id === nuevaTransaccion.id);
          transacciones[transacciones_index] = transaccion;
          this.transacciones = transacciones;
          this.cancelarTransasccion();
        },
        complete() {
          UpdatesaveSub.unsubscribe();
        }
      })
      return;

    }
    const nuevaTransaccion: CreateTransaccionDTO = value as CreateTransaccionDTO;
    const saveSub = this.transaccionservices.create(nuevaTransaccion).subscribe({
      next: (transaccion) => {
        this.transacciones = [...this.transacciones, transaccion];
      },
      complete: () => {
        saveSub.unsubscribe();

      }
    })

  }
  eliminarTransaccion(id: number) {
    const deleteSub = this.transaccionservices.delete(id).subscribe({
      next: (value) => {
        let transacciones = [...this.transacciones]
        let transacciones_index = transacciones.findIndex((transaccion) => transaccion.id === id);
        transacciones.splice(transacciones_index, 1);
        this.transacciones = transacciones;

      },
      complete: () => {
        deleteSub.unsubscribe();
      }
    })


  }
  // actualizarTransaccion(transaccion: TransaccionModel, id: number) {

  //   this.indexTransaccion = id;
  //   this.formtransaccion = this.formBuilder.group({
  //     monto: new FormControl(transaccion.monto, [Validators.required]),
  //     motivo: new FormControl(transaccion.motivo, [Validators.required])


  //   });
  // }
  actualizarTransaccion(transaccion: TransaccionModel) {
    this.formtransaccion = this.formBuilder.group({
      id: new FormControl(transaccion.id),
      monto: new FormControl(transaccion.monto, [Validators.required]),
      motivo: new FormControl(transaccion.motivo, [Validators.required]),
      fecha: new FormControl(transaccion.fecha, [Validators.required]),
      transactiontype_id: new FormControl(transaccion.transactiontype_id, [Validators.required])
    })



  }


}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public input_a: any;
  public results: any;
  public input_b: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController,
    private storage: Storage,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() { }

  displayToast(message) {
    this.toastCtrl
      .create({
        header: message,
        duration: 1000,
        position: 'top',
        color: 'danger',
      })
      .then((toast) => {
        toast.present();
      });
  }

  async getData(input) {
    let data: Observable<any>;
    this.input_b = input;
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });

    if (this.input_a === null && this.input_b === null) {
      this.displayToast('Data tidak boleh ada yang kosong');
    } else {
      await loading.present();
      data = this.http.get(
        'http://localhost:8080/wp-pegawai/api/login/' +
        this.input_a +
        '/' +
        this.input_b
      );
      data
        .pipe(
          finalize(() => {
            loading.dismiss();
          })
        )
        .subscribe((result) => {
          this.results = result;
          if (this.results.status === 'Ok') {
            // this.router.navigate(['tabs/tab1', {data: this.input_b}]);
            this.input_a = null;
            this.router.navigate(['/tabs/tab1/' + this.input_b]);
            this.input_b = null;
          } else {
            this.displayToast('Data gagal dimasukkan');
          }
        });
    }
  }
}

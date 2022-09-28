import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

import { Router } from '@angular/router';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  nip: number;
  absen: any;
  results: any;
  alasan: string;
  waktuMulai: Date;
  waktuBeres: Date;
  differenceDays: number;
  images: any;
  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,

    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.route.params.subscribe((param: any) => {
      this.nip = param.nip;
      console.log(this.nip);
      this.getAwalMasuk(this.nip);
    });
  }

  loadImageFromDevice(event) {
    this.images = event.target.files[0];
  }

  async getAwalMasuk(nip) {
    this.http
      .get('http://192.168.43.124/wp-pegawai/index.php/api/getawalmasuk/' + nip)
      .subscribe((result) => {
        this.results = result;
        console.log(this.results[0].waktu_masuk);
        const awalmasuk = new Date(this.results[0].waktu_masuk);
        const currentTime = new Date();
        const differenceDay =
          (currentTime.getTime() - awalmasuk.getTime()) / (1000 * 3600 * 24);
        this.differenceDays = differenceDay;
        console.log(awalmasuk);
        console.log(this.differenceDays.toFixed(0));
        console.log(this.absen);
      });
  }
  async presentToast(text, colour) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top',
      color: colour,
    });
    toast.present();
  }

  // Convert the base64 to blob data
  // and create  formData with it
  // eslint-disable-next-line @typescript-eslint/member-ordering

  // Upload the formData to our API
  // eslint-disable-next-line @typescript-eslint/member-ordering
  async uploadData() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    const formdata = new FormData();
    formdata.append('file', this.images);
    // Use your own API!
    const url =
      'http://192.168.43.124/wp-pegawai/index.php/api/upload/' +
      this.nip +
      '/' +
      this.absen +
      '/' +
      this.alasan +
      '/' +
      this.waktuBeres;
    if (
      this.nip === undefined ||
      this.absen === undefined ||
      this.alasan === undefined ||
      this.waktuMulai === undefined ||
      this.waktuBeres === undefined
    ) {
      this.presentToast('Data tidak boleh ada yang kosong!', 'danger');
    } else {
      await loading.present();
      this.http
        .post(url, formdata)
        .pipe(
          finalize(() => {
            loading.dismiss();
          })
        )
        .subscribe((event) => {
          this.results = event;
          if (this.results.message === 'success') {
            this.presentToast('File upload complete.', 'primary');
            console.log(this.nip);
            this.router.navigate(['/tabs/tab1/' + this.nip]);
          } else {
            this.presentToast(this.results.error, 'danger');
            console.log(event);
          }
        });
    }
  }
}

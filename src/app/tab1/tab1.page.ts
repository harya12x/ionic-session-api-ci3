import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { loadingController } from '@ionic/core';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  public nama: string;
  nip: any;
  a = new Date();
  test: string;
  test2: string;
  izin: number;
  sakit: number;
  cuti: number;
  keterangan: string;
  card = false;
  totalketidakhadiran: number;
  greetings: number = this.a.getHours();
  hari: number = this.a.getDate();
  totalbulan = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  bulan: number = this.totalbulan[this.a.getMonth()];
  tahun: number = this.a.getFullYear();
  public hello: string;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {
    this.route.params.subscribe((param: any) => {
      this.nip = param.nip;
      console.log(this.nip);
      this.getname(this.nip);
      this.countcuti(this.nip);
      this.cekabsen(this.nip);
      console.log(this.hari, this.bulan, this.tahun, this.greetings, this.nip);
    });
    console.log(this.a.getHours());
    this.test = 'Anda Belum Melakukan Presensi';
    this.test2 = 'Presensi Belum Dibuka';
    if (this.greetings >= 5 && this.greetings <= 10) {
      this.hello = 'Selamat Pagi';
    } else if (this.greetings > 10 && this.greetings <= 15) {
      this.hello = 'Selamat Siang';
    } else if (this.greetings > 15 && this.greetings <= 18) {
      this.hello = 'Selamat Sore';
      if (this.greetings >= 16) {
        this.test = 'Anda Dapat Melakukan Presensi Sore';
        this.card = true;
        this.test2 = 'Batas Waktu Melakukan Presensi : 5:00';
      }
    } else {
      this.hello = 'Selamat Malam';
      if (this.greetings < 5) {
        this.test = 'Anda Dapat Melakukan Presensi Sore';
        this.card = true;
        this.test2 = 'Batas Waktu Melakukan Presensi : 5:00';
      }
    }
  }

  getname(nip) {
    let data: Observable<any>;
    // eslint-disable-next-line prefer-const
    data = this.http.get(
      'http://192.168.43.124/wp-pegawai/index.php/api/getname/' + nip
    );
    data.subscribe((result) => {
      this.nama = result[0].nama;
    });
  }

  countcuti(nip) {
    let data: Observable<any>;
    // eslint-disable-next-line prefer-const
    data = this.http.get(
      'http://192.168.43.124/wp-pegawai/index.php/api/getcountcuti/' + nip
    );
    data.subscribe((result) => {
      this.sakit = Object.keys(result.a).length;
      this.izin = Object.keys(result.b).length;
      this.cuti = Object.keys(result.c).length;
      this.totalketidakhadiran = this.sakit + this.izin + this.cuti;
    });
  }

  cekabsen(nip) {
    let data: Observable<any>;
    // eslint-disable-next-line prefer-const
    data = this.http.get(
      'http://192.168.43.124/wp-pegawai/index.php/api/cekpresensi/' +
        nip +
        '/' +
        this.tahun +
        '/' +
        this.bulan +
        '/' +
        this.hari
    );
    data.subscribe((result) => {
      if (
        this.greetings >= 7 &&
        this.greetings < 9 &&
        Object.keys(result).length === 0
      ) {
        this.test = 'Anda Dapat Melakukan Presensi Pagi';
        this.card = true;
        this.test2 = 'Batas Waktu Melakukan Presensi : 9:00';
      } else if (this.greetings >= 16 && Object.keys(result).length === 0) {
        this.test = 'Anda Dapat Melakukan Presensi Sore';
        this.card = true;
        this.test2 = 'Batas Waktu Melakukan Presensi : 5:00';
        if (this.greetings < 5) {
          this.test = 'Anda Dapat Melakukan Presensi Sore';
          this.card = true;
          this.test2 = 'Batas Waktu Melakukan Presensi : 5:00';
        }
      } else if (Object.keys(result).length > 0) {
        this.test = 'Anda Sudah Melakukan Presensi';
        this.test2 = '';
      }

      console.log(result);
      console.log(Object.keys(result).length);
    });
  }

  async inputpresensi() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loading.present();
    let data: Observable<any>;
    if (this.greetings >= 7 && this.greetings < 9) {
      this.keterangan = 'masuk';
    } else {
      this.keterangan = 'pulang';
    }

    // eslint-disable-next-line prefer-const
    data = this.http.get(
      'http://192.168.43.124/wp-pegawai/index.php/api/inputpresensi/' +
        this.nip +
        '/' +
        this.keterangan
    );
    data
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe((result) => {
        if (result.status === 'Ok') {
          this.card = false;
          console.log(Object.keys(result).length);
        }
      });
  }

  sendData() {
    this.router.navigate(['/tabs/tab3/' + this.nip]);
  }

  async onClick() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loading.present();
    this.router.navigate(['/login']);
    this.nip = null;

    loading.dismiss();
    console.log(this.nip);
  }

  detailData(nip) {
    this.router.navigate(['/tabs/tab2/' + nip]);
  }
}

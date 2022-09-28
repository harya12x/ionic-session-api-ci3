import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  nip: any;
  sakit: any;
  izin: any;
  jenisabsen: any;
  cuti: any;
  ambilizinmulai: number;
  jumlahharisakit: number;
  jumlahhariizin: number;
  jumlahharicuti: number;
  sakitb: number;
  cutib: number;
  izinb: number;
  ambilizinselesai: number;
  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.params.subscribe((param: any) => {
      this.nip = param.nip;
      console.log(this.nip);
      this.getdetailsakit(this.nip);
      this.getdetailcuti(this.nip);
      this.getdetailizin(this.nip);
    });
    console.log(this.jenisabsen);
  }

  getdetailcuti(nip) {
    const cuti = 'cuti';
    let datacuti: Observable<any>;
    datacuti = this.http.get(
      'http://192.168.43.124/wp-pegawai/index.php/api/getdetailcuti/' +
        nip +
        '/' +
        cuti
    );
    datacuti.subscribe((result) => {
      this.cuti = result;

      console.log(this.cuti);

      this.cutib = Object.keys(result).length;
      for (let a = 0; a < this.cutib; a++) {
        this.ambilizinmulai = new Date(this.cuti[a].waktu_pengajuan).getDate();
        this.ambilizinselesai = new Date(
          this.cuti[a].selesai_pengajuan
        ).getDate();
        console.log(this.ambilizinmulai, this.ambilizinselesai);
        this.jumlahharicuti = this.ambilizinselesai - this.ambilizinmulai;
        console.log(this.jumlahharicuti);
        this.cuti[a].selesai_pengajuan = this.jumlahharicuti;
      }
    });
  }

  getdetailizin(nip) {
    let dataizin: Observable<any>;
    const izin = 'izin';
    dataizin = this.http.get(
      'http://192.168.43.124/wp-pegawai/index.php/api/getdetailcuti/' +
        nip +
        '/' +
        izin
    );
    dataizin.subscribe((result) => {
      this.izin = result;

      console.log(this.izin);

      this.izinb = Object.keys(result).length;
      for (let a = 0; a < this.izinb; a++) {
        this.ambilizinmulai = new Date(this.izin[a].waktu_pengajuan).getDate();
        this.ambilizinselesai = new Date(
          this.izin[a].selesai_pengajuan
        ).getDate();
        console.log(this.ambilizinmulai, this.ambilizinselesai);
        this.jumlahhariizin = this.ambilizinselesai - this.ambilizinmulai;
        console.log(this.jumlahhariizin);
        this.izin[a].selesai_pengajuan = this.jumlahhariizin;
      }
    });
  }

  getdetailsakit(nip) {
    let datasakit: Observable<any>;

    const sakit = 'sakit';

    // eslint-disable-next-line prefer-const
    datasakit = this.http.get(
      'http://192.168.43.124/wp-pegawai/index.php/api/getdetailcuti/' +
        nip +
        '/' +
        sakit
    );
    datasakit.subscribe((result) => {
      this.sakit = result;

      console.log(this.sakit);

      this.sakitb = Object.keys(result).length;
      for (let a = 0; a < this.sakitb; a++) {
        this.ambilizinmulai = new Date(this.sakit[a].waktu_pengajuan).getDate();
        this.ambilizinselesai = new Date(
          this.sakit[a].selesai_pengajuan
        ).getDate();
        console.log(this.ambilizinmulai, this.ambilizinselesai);
        this.jumlahharisakit = this.ambilizinselesai - this.ambilizinmulai;
        console.log(this.jumlahharisakit);
        this.sakit[a].selesai_pengajuan = this.jumlahharisakit;
      }
    });
  }
}

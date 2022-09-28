import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { NavController, Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [Storage]
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private platform: Platform,
    public navCtrl: NavController,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) {



    this.initializeApp();
  }


  async initializeApp() {
    await this.storage.create();


    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.storage.get('isLoggedIn').then((val) => {
      if (val == null || val == undefined || val == '') {
        this.navCtrl.navigateRoot('/login');
      } else {
        this.navCtrl.navigateRoot('/tabs/tab1');
      }
    });
  }
}

import { NgModule } from '@angular/core'; 
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Route } from '@angular/router';
import { FirebaseUIModule } from 'firebaseui-angular';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';

import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';

const routes: Route[] = [
  { path: '**', component: AppComponent }
];

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  tosUrl: 'https://policies.google.com/terms',
  privacyPolicyUrl: 'https://policies.google.com/privacy',
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
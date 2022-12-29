import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SheetModule } from './sheet/sheet.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { CharacterListComponent } from './character-list/character-list.component';
import { CharacterLiComponent } from './character-list/character-li/character-li.component';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { LoginButtonComponent } from './login-button/login-button.component';

/**
 * The main application module.
 */
@NgModule({
  declarations: [AppComponent, CharacterListComponent, CharacterLiComponent, LoginButtonComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SheetModule,
    BrowserAnimationsModule,
    MatDialogModule,
    AuthModule.forRoot({ ...environment.auth0 }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

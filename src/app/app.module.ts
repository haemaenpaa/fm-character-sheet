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

/**
 * The main application module.
 */
@NgModule({
  declarations: [AppComponent, CharacterListComponent, CharacterLiComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SheetModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

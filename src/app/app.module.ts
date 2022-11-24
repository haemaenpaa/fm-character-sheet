import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SheetModule } from './sheet/sheet.module';

/**
 * The main application module.
 */
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, SheetModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

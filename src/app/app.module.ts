import { NgxPhoneInputModule } from '../../projects/ngx-simple-phone-input/src/lib/ngx-phone-input.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxPhoneInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

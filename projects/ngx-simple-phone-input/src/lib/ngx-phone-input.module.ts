import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { ImageFallbackDirective } from './image-loader.directive';
import { NgxPhoneInputComponent } from './ngx-phone-input.component';



@NgModule({
  declarations: [
    NgxPhoneInputComponent,
    ImageFallbackDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    NgxPhoneInputComponent,
    ImageFallbackDirective
  ]
})
export class NgxPhoneInputModule { }

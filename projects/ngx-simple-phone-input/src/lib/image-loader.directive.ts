import { Directive, ElementRef, HostListener, Input, Renderer2 } from "@angular/core";

@Directive({
  selector:"img[imageFallBack]"
})
export class ImageFallbackDirective {
  @Input() flag: String = '';

  constructor(private _el: ElementRef, private _renderer: Renderer2) {}
  @HostListener('error')
  private errorHandler() {
    const flagElement = this._renderer.createElement('span');
    const flagText = this._renderer.createText(`${this.flag}`);
    this._renderer.appendChild(flagElement, flagText);
    this._renderer.addClass(flagElement, 'flag-emoji');
    this._el.nativeElement.replaceWith(flagElement);
  }

}

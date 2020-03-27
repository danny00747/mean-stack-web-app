import {Directive, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appAddClass]'
})
export class AddClassDirective {

  constructor(private renderer: Renderer2, private elRef: ElementRef) {
  }

  @HostListener('click')
  async onClick() {
    console.log(this.elRef.nativeElement.id);

    await new Promise(r => setTimeout(r, 1000));
    this.renderer.setAttribute(this.elRef.nativeElement, 'disabled', 'true');

    await new Promise(r => setTimeout(r, 7000));
    this.renderer.removeAttribute(this.elRef.nativeElement, 'disabled');

  }


}

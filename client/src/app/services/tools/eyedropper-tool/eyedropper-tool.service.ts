import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
    providedIn: 'root',
})
export class EyedropperToolService extends AbstractToolService {
    pixelColor: string;
    canvas: HTMLCanvasElement;
    context2D: CanvasRenderingContext2D;
    svgCopy: SVGElement;

    constructor(public drawStack: DrawStackService, public svgReference: ElementRef<SVGElement>, public renderer: Renderer2) {
        super();
    }

    updateSVGCopy(): void {

    }

    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent): void {}
    onMouseUp(event: MouseEvent): void {}
    onMouseEnter(event: MouseEvent): void {}
    onMouseLeave(event: MouseEvent): void {}
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}
}

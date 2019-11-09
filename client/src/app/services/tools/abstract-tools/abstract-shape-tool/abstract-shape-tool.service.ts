import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { HTMLAttribute } from 'src/constants/tool-constants';
import { SVG_NS } from '../../../../../constants/constants';
import { AbstractToolService } from '../abstract-tool.service';
import { Coords2D } from 'src/classes/Coords2D';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractShapeToolService extends AbstractToolService {
    currentMouseX = 0;
    currentMouseY = 0;
    currentMouseCoords: Coords2D = {x: 0, y: 0};
    initialMouseX = 0;
    initialMouseY = 0;
    initialMouseCoords: Coords2D = {x: 0, y: 0};
    previewRectangle: SVGRectElement;
    isPreviewing = false;
    isIn = true;

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    constructor() {
        super();
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
        this.previewRectangle = this.renderer.createElement('rect', SVG_NS);
    }

    abstract onMouseMove(event: MouseEvent): void;
    abstract onMouseDown(event: MouseEvent): void;
    abstract onMouseUp(event: MouseEvent): void;
    abstract onMouseEnter(event: MouseEvent): void;
    abstract onMouseLeave(event: MouseEvent): void;
    abstract onKeyDown(event: KeyboardEvent): void;
    abstract onKeyUp(event: KeyboardEvent): void;
    abstract cleanUp(): void;
    abstract createSVG(): void;

    get previewRectangleX(): number {
        return this.previewRectangle.x.baseVal.value;
    }

    get previewRectangleY(): number {
        return this.previewRectangle.y.baseVal.value;
    }

    get previewRectangleWidth(): number {
        return this.previewRectangle.width.baseVal.value;
    }

    get previewRectangleHeight(): number {
        return this.previewRectangle.height.baseVal.value;
    }

    updatePreviewRectangle(): void {
        let deltaX = this.currentMouseX - this.initialMouseX;
        let deltaY = this.currentMouseY - this.initialMouseY;

        // adjust x
        if (deltaX < 0) {
            deltaX *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'x', (this.initialMouseX - deltaX).toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.width, deltaX.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'x', this.initialMouseX.toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.width, deltaX.toString());
        }

        // adjust y
        if (deltaY < 0) {
            deltaY *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'y', (this.initialMouseY - deltaY).toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.height, deltaY.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'y', this.initialMouseY.toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.height, deltaY.toString());
        }

        this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.fill, 'white');
        this.renderer.setAttribute(this.previewRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.stroke, 'black');
        this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.stroke_dasharray, '5 5');
    }
}

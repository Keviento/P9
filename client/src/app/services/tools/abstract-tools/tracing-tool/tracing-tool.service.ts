import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { MOUSE, SVG_NS } from 'src/constants/constants';
import { HTML_ATTRIBUTE, TOOL_NAME } from 'src/constants/tool-constants';
import { AttributesManagerService } from '../../attributes-manager/attributes-manager.service';
import { AbstractToolService } from '../abstract-tool.service';

@Injectable({
    providedIn: 'root',
})
export abstract class TracingToolService extends AbstractToolService {
    isDrawing = false;
    protected currentPath = '';
    protected currentWidth = 0;
    protected currentColorAndOpacity = '';
    protected currentOpacity = '';
    protected currentColor = '';
    protected svgPath: SVGPathElement;
    protected svgWrap: SVGGElement;
    protected svgPreviewCircle: SVGCircleElement;

    protected attributesManagerService: AttributesManagerService;
    protected elementRef: ElementRef<SVGElement>;
    protected renderer: Renderer2;
    protected drawStack: DrawStackService;

    constructor() {
        super();
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
        this.svgPath = this.renderer.createElement('path', SVG_NS);
        this.svgWrap = this.renderer.createElement('g', SVG_NS);
        this.svgPreviewCircle = this.renderer.createElement('circle', SVG_NS);
    }

    getIsDrawing = (): boolean => this.isDrawing;
    getCurrentPath = (): string => this.currentPath;

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.thickness.subscribe((thickness) => {
            this.currentWidth = thickness;
        });
    }

    protected getXPos = (clientX: number) => clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
    protected getYPos = (clientY: number) => clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

    onMouseDown(e: MouseEvent): void {
        this.setColorAndOpacity();
        if (e.button === MOUSE.LeftButton) {
            this.isDrawing = true;
            this.createSVGWrapper();
            const x = this.getXPos(e.clientX);
            const y = this.getYPos(e.clientY);
            this.currentPath = `M${x} ${y}`;
            this.svgPreviewCircle = this.createSVGCircle(x, y);
            this.renderer.appendChild(this.svgWrap, this.svgPreviewCircle);
            this.createSVGPath();
        }
    }

    protected setColorAndOpacity(): void {
        this.currentColor = this.currentColorAndOpacity.slice(0, 6);
        this.currentOpacity = (parseInt(this.currentColorAndOpacity.slice(-2), 16) / 255).toFixed(1).toString();
    }

    onMouseMove(e: MouseEvent): void {
        if (e.button === MOUSE.LeftButton && this.getIsDrawing()) {
            const x = this.getXPos(e.clientX);
            const y = this.getYPos(e.clientY);
            this.currentPath += ` L${x} ${y}`;
            this.updateSVGPath();
        }
    }

    onMouseUp(e: MouseEvent): void {
        if (e.button === MOUSE.LeftButton && this.getIsDrawing()) {
            this.isDrawing = false;
            this.currentPath = '';
            this.drawStack.push(this.svgWrap);
        }
    }

    onMouseLeave(e: MouseEvent): void {
        this.onMouseUp(e);
    }

    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}

    protected createSVGWrapper(): void {
        const wrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.Stroke, '#' + this.currentColor);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.Opacity, this.currentOpacity);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.Fill, '#' + this.currentColor);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.Title, TOOL_NAME.Pen);
        this.svgWrap = wrap;
        this.renderer.appendChild(this.elementRef.nativeElement, wrap);
    }

    protected createSVGCircle(x: number, y: number): SVGCircleElement {
        const circle: SVGCircleElement = this.renderer.createElement('circle', SVG_NS);
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.Stroke, 'none');
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.Cx, x.toString());
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.Cy, y.toString());
        this.renderer.setAttribute(circle, 'r', (this.currentWidth / 2).toString());
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.Fill, '#' + this.currentColor);
        return circle;
    }

    protected createSVGPath(): void {
        this.svgPath = this.renderer.createElement('path', SVG_NS);
        this.renderer.setAttribute(this.svgPath, HTML_ATTRIBUTE.Fill, 'none');
        this.renderer.setAttribute(this.svgPath, HTML_ATTRIBUTE.StrokeWidth, this.currentWidth.toString());
        this.renderer.setAttribute(this.svgPath, HTML_ATTRIBUTE.StrokeLinejoin, 'round');
        this.renderer.setAttribute(this.svgPath, HTML_ATTRIBUTE.StrokeLinecap, 'round');
        this.renderer.appendChild(this.svgWrap, this.svgPath);
    }

    protected updatePreviewCircle(x: number, y: number): void {
        this.renderer.setAttribute(this.svgPreviewCircle, HTML_ATTRIBUTE.Cx, x.toString());
        this.renderer.setAttribute(this.svgPreviewCircle, HTML_ATTRIBUTE.Cy, y.toString());
    }

    protected updateSVGPath(): void {
        this.renderer.setAttribute(this.svgPath, 'd', this.currentPath);
    }

    cleanUp(): void {
        if (this.isDrawing) {
            this.renderer.removeChild(this.elementRef.nativeElement, this.svgWrap);
            this.svgWrap = this.renderer.createElement('g', SVG_NS);
            this.currentPath = '';
            this.isDrawing = false;
        }
    }
}

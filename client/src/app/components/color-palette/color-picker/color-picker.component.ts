import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material';

import { ColorToolService } from '../../../services/tools/color-tool/color-tool.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    obscurity = 0;

    @ViewChild('canvas_picker', { static: true }) canvasPicker: ElementRef<HTMLCanvasElement>;

    constructor(private colorToolService: ColorToolService, private renderer: Renderer2) {}

    ngOnInit(): void {
        const img = new Image();
        img.src = '../../../assets/color-wheel.png';

        this.canvas = this.canvasPicker.nativeElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        img.onload = () => {
            this.context.drawImage(img, 0, 0);
        };
    }

    onSliderChange(event: MatSliderChange): void {
        if (event.value === null) {
            return;
        }
        this.obscurity = event.value;
        this.renderer.setStyle(
            this.canvasPicker.nativeElement,
            'filter',
            'brightness(' + (1 - this.obscurity) * 100 + '%)',
        );
    }

    onCanvasClick(event: MouseEvent): void {
        const x = event.offsetX;
        const y = event.offsetY;

        const pixel = this.context.getImageData(x, y, 1, 1).data;

        if (this.obscurity !== 1 && pixel[0] + pixel[1] + pixel[2] + pixel[3] === 0) {
            return;
        }

        const newHex = this.colorToolService.translateRGBToHex(
            pixel[0] - pixel[0] * this.obscurity,
            pixel[1] - pixel[1] * this.obscurity,
            pixel[2] - pixel[2] * this.obscurity,
        );

        const opacity = this.colorToolService.getPreviewColorOpacityHex();
        this.colorToolService.changePreviewColor(newHex + opacity);
    }
}

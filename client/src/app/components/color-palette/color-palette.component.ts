import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { Color } from '../../../classes/Color';
import { ColorType } from '../../services/constants';

interface ColorStyle {
    backgroundColor: string;
    border?: string;
}
@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements OnInit {
    myForm: FormGroup;
    formBuilder: FormBuilder;

    selectedColor: ColorType = ColorType.primaryColor;
    primaryColor: Color = new Color();
    secondaryColor: Color = new Color();

    constructor(formBuilder: FormBuilder, private colorToolService: ColorToolService) {
        this.formBuilder = formBuilder;
        this.initializeForm();
    }

    ngOnInit(): void {
        this.primaryColor = this.colorToolService.primaryColor;
        this.secondaryColor = this.colorToolService.secondaryColor;
        this.setHexValues();
    }

    initializeForm(): void {
        this.myForm = this.formBuilder.group({
            hex: ['000000', [Validators.pattern('^([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)')]],
            R: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            G: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            B: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
        });
    }

    changeColor(colorHex: string): void {
        const newColor = new Color(colorHex);
        this.setColor(newColor);
        this.setColorNumericValues();
        this.colorToolService.addColorToQueue(newColor);
        this.colorToolService.changeColorOnFocus(newColor);
    }

    setColor(color: Color): void {
        if (this.selectedColor === ColorType.primaryColor) {
            this.colorToolService.changeColor(color, ColorType.primaryColor);
            this.primaryColor = color;
        } else if (this.selectedColor === ColorType.secondaryColor) {
            this.colorToolService.changeColor(color, ColorType.secondaryColor);
            this.secondaryColor = color;
        }
    }

    setColorNumericValues(): void {
        this.setHexValues();
        this.setRGBValues();
    }

    setHexValues(): void {
        if (this.selectedColor === ColorType.primaryColor) {
            this.myForm.controls.hex.setValue(this.primaryColor.hex);
        } else if (this.selectedColor === ColorType.secondaryColor) {
            this.myForm.controls.hex.setValue(this.secondaryColor.hex);
        }
    }

    setRGBValues(): void {
        if (this.selectedColor === ColorType.primaryColor) {
            this.myForm.controls.R.setValue(parseInt(this.primaryColor.hex.slice(0, 2), 16));
            this.myForm.controls.G.setValue(parseInt(this.primaryColor.hex.slice(2, 4), 16));
            this.myForm.controls.B.setValue(parseInt(this.primaryColor.hex.slice(4, 6), 16));
        } else if (this.selectedColor === ColorType.secondaryColor) {
            this.myForm.controls.R.setValue(parseInt(this.secondaryColor.hex.slice(0, 2), 16));
            this.myForm.controls.G.setValue(parseInt(this.secondaryColor.hex.slice(2, 4), 16));
            this.myForm.controls.B.setValue(parseInt(this.secondaryColor.hex.slice(4, 6), 16));
        }
    }

    switchColors(): void {
        let temporaryColor: Color = new Color();
        temporaryColor = this.primaryColor;

        this.primaryColor = this.secondaryColor;
        this.colorToolService.changeColor(this.secondaryColor, ColorType.primaryColor);

        this.secondaryColor = temporaryColor;
        this.colorToolService.changeColor(temporaryColor, ColorType.secondaryColor);

        this.setColorNumericValues();
    }

    onUserHexInput(): void {
        this.changeColor(this.myForm.value.hex);
    }

    onUserColorRGBInput(): void {
        const newColorinHex = this.translateRGBToHex();
        this.changeColor(newColorinHex);
    }

    translateRGBToHex(): string {
        let r = Number(this.myForm.value.R).toString(16);
        let g = Number(this.myForm.value.G).toString(16);
        let b = Number(this.myForm.value.B).toString(16);
        if (r.length === 1) {
            r = '0' + r;
        }
        if (g.length === 1) {
            g = '0' + g;
        }
        if (b.length === 1) {
            b = '0' + b;
        }
        return r + g + b;
    }

    onClickColorQueueButton(color: Color): void {
        this.changeColor(color.hex);
    }
}

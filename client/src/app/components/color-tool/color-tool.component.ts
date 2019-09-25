import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { Color } from '../../../classes/Color';
import { /*COLORS,*/ ColorType } from '../../services/constants';

@Component({
    selector: 'app-color-tool',
    templateUrl: './color-tool.component.html',
    styleUrls: ['./color-tool.component.scss'],
})
export class ColorToolComponent implements OnInit {
    myForm: FormGroup;
    formBuilder: FormBuilder;

    selectedColor: ColorType = ColorType.primaryColor;
    primaryColor: Color = new Color();
    secondaryColor: Color = new Color();

    lastTenColorsQueue: Color[] = [];

    constructor(formBuilder: FormBuilder, private colorToolService: ColorToolService) {
        this.formBuilder = formBuilder;
        this.initializeForm();
    }

    ngOnInit(): void {
        this.primaryColor = this.colorToolService.primaryColor;
        this.secondaryColor = this.colorToolService.secondaryColor;
    }

    initializeForm() {
        this.myForm = this.formBuilder.group({
            hex: ['000000', [Validators.pattern('^[0-9A-Fa-f]{6}$')]],
            R: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            G: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            B: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
        });
    }

    changeColor(colorHex: string): void {
        const newColor = new Color(colorHex);
        this.setColor(newColor);
        // this.addColorToColorList(color);
        this.setColorNumericValues();
    }

    setColor(color: Color): void {
        if (this.selectedColor === ColorType.primaryColor) {
            this.primaryColor = color;
            this.colorToolService.changeColor(color, ColorType.primaryColor);
        } else if (this.selectedColor === ColorType.secondaryColor) {
            this.secondaryColor = color;
            this.colorToolService.changeColor(color, ColorType.secondaryColor);
        }
    }

    // switchColors() {
    //     let temporaryColor: Color = new Color();
    //     temporaryColor = this.primaryColor;
    //     this.primaryColor = this.secondaryColor;
    //     this.secondaryColor = temporaryColor;
    //     this.setHexValues();
    // }

    // addColorToColorList(color: Color) {
    //     if (this.lastTenColorsQueue.length < 10) {
    //         this.lastTenColorsQueue.push(color);
    //     } else {
    //         this.lastTenColorsQueue.shift();
    //         this.lastTenColorsQueue.push(color);
    //     }
    // }


        // GOOD
    onClickColorWheel() {
        this.displayColorWheel = !this.displayColorWheel;
    }

        // GOOD
    setHexValues() {
        this.setHex();
        this.setRGBFromHex();
    }

        // GOOD
    onUserHexInput(): void {
        if (this.selectedColor === ColorType.primaryColor) {
            this.changeColor(this.myForm.value.hex);
        } else if (this.selectedColor === ColorType.secondaryColor) {
            this.changeColor(this.myForm.value.hex);
        }
        this.setRGBFromHex();
    }

    //     // GOOD
    // onUserColorRGBInput() {
    //     const newHex = this.rgbToHex();
    //     if (this.primaryColorOn) {
    //         this.primaryColor = { hex: newHex };
    //         this.onChangeColor(this.primaryColor);
    //     } else {
    //         this.secondaryColor = { hex: newHex };
    //         this.onChangeColor(this.secondaryColor);
    //     }
    //     this.setHex();
    // }

        // GOOD
    setHex() {
        if (this.selectedColor === ColorType.primaryColor) {
            this.myForm.controls.hex.setValue(this.primaryColor.hex);
        } else if (this.selectedColor === ColorType.secondaryColor) {
            this.myForm.controls.hex.setValue(this.secondaryColor.hex);
        }
    }

        // GOOD
    setRGBFromHex() {
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

    // getColorIcon(color: Color): ColorButtonStyle {
    //     return { backgroundColor: '#' + color.hex };
    // }

    onClickPrimaryColorStyle() {
        console.log("Color ", this.selectedColor);
        if (this.selectedColor === ColorType.primaryColor) {
            return {
                backgroundColor: '#' + this.primaryColor.hex,
                border: 'solid 1px black',
            };
        }

        return {
            backgroundColor: '#' + this.primaryColor.hex,
        };
    }

    onClickSecondaryColorStyle() {
        if (this.selectedColor === ColorType.secondaryColor) {
            return {
                backgroundColor: '#' + this.secondaryColor.hex,
                border: 'solid 1px black',
            };
        }

        return {
            backgroundColor: '#' + this.secondaryColor.hex,
        };
    }

    //     return {
    //         backgroundColor: '#' + this.secondaryColor.hex,
    //         opacity: this.lastSecondaryOpacity,
    //         border: 'solid 0px',
    //     };
    // }

    onClickPrimaryColor() {
        this.selectedColor = ColorType.primaryColor;
        this.setHexValues();
    }

    onClickSecondaryColor() {
        this.selectedColor = ColorType.secondaryColor;
        this.setHexValues();
    }

// }

// interface ColorIconStyle {
//     backgroundColor: string;
//     opacity: number;
//     border: string;
// }

// interface ColorButtonStyle {
//     backgroundColor: string;
// }
}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSliderChange } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { LineToolService } from 'src/app/services/tools/line-tool/line-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { Thickness, ToolName, LineStrokeType } from 'src/constants/tool-constants';

@Component({
  selector: 'app-line-attributes',
  templateUrl: './line-attributes.component.html',
  styleUrls: ['./line-attributes.component.scss'],
  providers: [AttributesManagerService],
})
export class LineAttributesComponent implements OnInit, AfterViewInit {
    toolName = ToolName.Line;
    lineAttributesForm: FormGroup;
    lineToolService: LineToolService;

    lineStrokeType: LineStrokeType;
    LineStrokeTypeChoices = [LineStrokeType.Continuous, LineStrokeType.Dotted_line, LineStrokeType.Dotted_circle];

    circleJointSelected = false;

    readonly Thickness = Thickness;

    constructor(
        public formBuilder: FormBuilder,
        public attributeManagerService: AttributesManagerService,
        public toolSelectorService: ToolSelectorService,
        public shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onThicknessChange();
    }

    ngAfterViewInit(): void {
        this.lineToolService = this.toolSelectorService.getLineTool();
        this.lineToolService.initializeAttributesManagerService(this.attributeManagerService);
    }

    initializeForm(): void {
        this.lineAttributesForm = this.formBuilder.group({
            thickness: [
                Thickness.Default,
                [Validators.required, Validators.min(Thickness.Min), Validators.max(Thickness.Max)],
            ],
            lineStrokeType: [LineStrokeType.Continuous],
            lineJointType: [1],
            circleJointDiameter: [
                Thickness.Default,
                [Validators.min(Thickness.Min), Validators.max(Thickness.Max)],
            ],
        });
    }

    onLineStrokeTypeChange(lineStrokeType: LineStrokeType): void {
        this.attributeManagerService.changeLineStrokeType(lineStrokeType);
    }

    onLineJointTypeChange(lineJointType: number): void {
        this.attributeManagerService.changeLineJointType(lineJointType);
        this.circleJointSelected = (lineJointType === 3);
    }

    onCircleJointSliderChange(event: MatSliderChange): void {
        if (event.value !== null && event.value <= Thickness.Max && event.value >= Thickness.Min) {
            this.lineAttributesForm.controls.circleJointDiameter.setValue(event.value);
            this.onCircleJointDiameterChange();
        }
    }

    onCircleJointDiameterChange(): void {
        const jointThickness = this.lineAttributesForm.value.circleJointDiameter;
        if (this.lineAttributesForm.valid) {
            this.attributeManagerService.changeCircleJointDiameter(jointThickness);
        }
    }

    onSliderChange(event: MatSliderChange): void {
        if (event.value !== null && event.value <= Thickness.Max && event.value >= Thickness.Min) {
            this.lineAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onThicknessChange(): void {
        const thickness: number = this.lineAttributesForm.value.thickness;
        if (this.lineAttributesForm.valid) {
            this.attributeManagerService.changeThickness(thickness);
        }
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }

    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }

}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { DEFAULT_THICKNESS, MAX_THICKNESS, MIN_THICKNESS } from '../../../../services/constants';
import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';
import { RectangleToolService } from '../../../../services/tools/rectangle-tool/rectangle-tool.service';
import { ToolSelectorService } from '../../../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-rectangle-attributes',
    templateUrl: './rectangle-attributes.component.html',
    styleUrls: ['./rectangle-attributes.component.scss'],
})
export class RectangleAttributesComponent implements OnInit, AfterViewInit {
    toolName = 'Carré';
    rectangleAttributesForm: FormGroup;
    rectangleToolService: RectangleToolService;

    readonly MIN_THICKNESS: number = MIN_THICKNESS;
    readonly MAX_THICKNESS: number = MAX_THICKNESS;

    constructor(
        private formBuilder: FormBuilder,
        private attributesManagerService: AttributesManagerService,
        private toolSelectorService: ToolSelectorService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onThicknessChange();
    }

    ngAfterViewInit(): void {
        this.rectangleToolService = this.toolSelectorService.getRectangleTool();
        this.rectangleToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.rectangleAttributesForm = this.formBuilder.group({
            thickness: [
                DEFAULT_THICKNESS,
                [Validators.required, Validators.min(MIN_THICKNESS), Validators.max(MAX_THICKNESS)],
            ],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        this.rectangleAttributesForm.controls.thickness.setValue(event.value);
        this.onThicknessChange();
    }
    onThicknessChange(): void {
        const thickness = this.rectangleAttributesForm.value.thickness;
        if (thickness >= MIN_THICKNESS && thickness <= MAX_THICKNESS) {
            this.attributesManagerService.changeThickness(thickness);
        }
    }
}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { SprayCanToolService } from 'src/app/services/tools/spray-can-tool/spray-can-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { PREDICATE } from 'src/constants/constants';
import {
    SPRAY_DIAMETER,
    SPRAY_INTERVAL,
    SPRAY_PARTICLE_THICKNESS,
    THICKNESS,
    TOOL_NAME,
} from 'src/constants/tool-constants';

@Component({
    selector: 'app-spray-can-attributes',
    templateUrl: './spray-can-attributes.component.html',
    styleUrls: ['./spray-can-attributes.component.scss'],
})
export class SprayCanAttributesComponent implements OnInit, AfterViewInit {
    toolName = TOOL_NAME.SprayCan;
    sprayCanAttributesForm: FormGroup;
    sprayCanToolService: SprayCanToolService;
    attributesManagerService: AttributesManagerService = new AttributesManagerService();
    readonly THICKNESS = SPRAY_PARTICLE_THICKNESS;
    readonly DIAMETER = SPRAY_DIAMETER;
    readonly INTERVAL = SPRAY_INTERVAL;

    constructor(
        private formBuilder: FormBuilder,
        private toolSelectorService: ToolSelectorService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
        this.onThicknessChange();
        this.onDiameterChange();
    }

    ngAfterViewInit(): void {
        this.sprayCanToolService = this.toolSelectorService.getSprayCanTool();
        this.sprayCanToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.sprayCanAttributesForm = this.formBuilder.group({
            thickness: [
                SPRAY_PARTICLE_THICKNESS.Default,
                [
                    Validators.required,
                    Validators.min(SPRAY_PARTICLE_THICKNESS.Min),
                    Validators.max(SPRAY_PARTICLE_THICKNESS.Max),
                ],
            ],
            diameter: [
                SPRAY_DIAMETER.Default,
                [Validators.required, Validators.min(SPRAY_DIAMETER.Min), Validators.max(SPRAY_DIAMETER.Max)],
            ],
            interval: [
                SPRAY_INTERVAL.Default,
                [Validators.required, Validators.min(SPRAY_INTERVAL.Min), Validators.max(SPRAY_INTERVAL.Max)],
            ],
        });
    }

    onThicknessSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, THICKNESS)) {
            this.sprayCanAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onDiameterSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, SPRAY_DIAMETER)) {
            this.sprayCanAttributesForm.controls.diameter.setValue(event.value);
            this.onDiameterChange();
        }
    }

    onIntervalSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, SPRAY_INTERVAL)) {
            this.sprayCanAttributesForm.controls.interval.setValue(event.value);
            this.onIntervalChange();
        }
    }

    onThicknessChange(): void {
        const thickness: number = this.sprayCanAttributesForm.value.thickness;
        if (this.sprayCanAttributesForm.controls.thickness.valid) {
            this.attributesManagerService.thickness.next(thickness);
        }
    }

    onDiameterChange(): void {
        const diameter: number = this.sprayCanAttributesForm.value.diameter;
        if (this.sprayCanAttributesForm.controls.diameter.valid) {
            this.attributesManagerService.sprayDiameter.next(diameter);
        }
    }

    onIntervalChange(): void {
        const interval: number = this.sprayCanAttributesForm.value.interval;
        if (this.sprayCanAttributesForm.controls.interval.valid) {
            this.attributesManagerService.sprayInterval.next(interval);
        }
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { EllipsisToolService } from 'src/app/services/tools/ellipsis-tool/ellipsis-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { Thickness, ToolName } from 'src/constants/tool-constants';

@Component({
    selector: 'app-ellipsis-attributes',
    templateUrl: './ellipsis-attributes.component.html',
    styleUrls: ['./ellipsis-attributes.component.scss'],
})
export class EllipsisAttributesComponent implements OnInit, AfterViewInit {
    toolName = ToolName.Ellipsis;
    ellipsisAttributesForm: FormGroup;
    ellipsisToolService: EllipsisToolService;
    readonly thickness = Thickness;

    constructor(
        private formBuilder: FormBuilder,
        private attributesManagerService: AttributesManagerService,
        private toolSelectorService: ToolSelectorService,
        private colorToolService: ColorToolService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
        this.onThicknessChange();
    }

    ngAfterViewInit(): void {
        this.ellipsisToolService = this.toolSelectorService.getEllipsisTool();
        this.ellipsisToolService.initializeAttributesManagerService(this.attributesManagerService);
        this.ellipsisToolService.initializeColorToolService(this.colorToolService);
    }

    initializeForm(): void {
        this.ellipsisAttributesForm = this.formBuilder.group({
            thickness: [
                Thickness.Default,
                [Validators.required, Validators.min(Thickness.Min), Validators.max(Thickness.Max)],
            ],
            traceType: ['Contour'],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        if (event.value !== null && event.value <= Thickness.Max && event.value >= Thickness.Min) {
            this.ellipsisAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onThicknessChange(): void {
        const thickness: number = this.ellipsisAttributesForm.value.thickness;
        if (thickness >= Thickness.Min && thickness <= Thickness.Max) {
            this.attributesManagerService.changeThickness(thickness);
        }
    }

    onTraceTypeChange(): void {
        const tracetype: string = this.ellipsisAttributesForm.value.traceType;
        this.attributesManagerService.changeTraceType(tracetype);
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}

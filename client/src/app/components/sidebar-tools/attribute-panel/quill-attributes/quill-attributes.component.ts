import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { QuillToolService } from 'src/app/services/tools/quill-tool/quill-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { PREDICATE } from 'src/constants/constants';
import { ROTATION_ANGLE, THICKNESS, TOOL_NAME } from 'src/constants/tool-constants';

@Component({
    selector: 'app-quill-attributes',
    templateUrl: './quill-attributes.component.html',
    styleUrls: ['./quill-attributes.component.scss'],
})
export class QuillAttributesComponent implements OnInit {
    toolName = TOOL_NAME.Quill;
    quillAttributesForm: FormGroup;
    quillToolService: QuillToolService;

    readonly THICKNESS = THICKNESS;
    readonly QUILL_ANGLE_ORIENTATION = ROTATION_ANGLE;

    constructor(
        private formBuilder: FormBuilder,
        private attributesManagerService: AttributesManagerService,
        private toolSelectorService: ToolSelectorService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
        this.onThicknessChange();
        this.onAngleChange();
        this.quillToolService = this.toolSelectorService.getQuillTool();
        this.quillToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.quillAttributesForm = this.formBuilder.group({
            thickness: [
                THICKNESS.Default,
                [Validators.required, Validators.min(THICKNESS.Min), Validators.max(THICKNESS.Max)],
            ],
            angle: [
                ROTATION_ANGLE.Default,
                [Validators.required, Validators.min(ROTATION_ANGLE.Min), Validators.max(ROTATION_ANGLE.Max)],
            ],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, THICKNESS)) {
            this.quillAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onThicknessChange(): void {
        const thickness: number = this.quillAttributesForm.value.thickness;
        if (this.quillAttributesForm.controls.thickness.valid) {
            this.attributesManagerService.thickness.next(thickness);
        }
    }

    onAngleChange(): void {
        const quillAngle: number = this.quillAttributesForm.value.angle;
        if (this.quillAttributesForm.controls.angle.valid) {
            this.attributesManagerService.angle.next(quillAngle);
        }
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}

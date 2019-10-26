import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenAttributesComponent } from './pen-attributes.component';
import { FormBuilder } from '@angular/forms';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';

describe('PenAttributesComponent', () => {
    let component: PenAttributesComponent;
    let fixture: ComponentFixture<PenAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PenAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                {
                    provide: MatDialog,
                    useValue: {},
                },
            ],
        })
            .overrideComponent(PenAttributesComponent, {
                set: {
                    providers: [
                        {
                            provide: AttributesManagerService,
                            useValue: {},
                        },
                        {
                            provide: ShortcutManagerService,
                            useValue: {},
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(PenAttributesComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

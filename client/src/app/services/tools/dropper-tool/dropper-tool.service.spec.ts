import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { createKeyBoardEvent, createMouseEvent } from 'src/classes/test-helpers.spec';
import { Keys } from 'src/constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ColorToolService } from '../color-tool/color-tool.service';
import { DropperToolService } from '../dropper-tool/dropper-tool.service';

describe('DropperToolService', () => {
    let injector: TestBed;
    let service: DropperToolService;
    let positiveMouseEvent: MouseEvent;
    let negativeMouseEvent: MouseEvent;
    let onAltKeyDown: KeyboardEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DropperToolService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: (elem: string) => {
                            if (elem === 'canvas') {
                                const mockCanvas = {
                                    getContext: (dimention: string) => {
                                        const mockContext = {
                                            getImageData: (x: number, y: number, sw: number, sh: number) => {
                                                const mockImageData = {};
                                                return (mockImageData as unknown) as ImageData;
                                            },
                                        };
                                        return (mockContext as unknown) as CanvasRenderingContext2D;
                                    },
                                };
                                return (mockCanvas as unknown) as HTMLCanvasElement;
                            } else {
                                const mockImg = {};
                                return mockImg as HTMLImageElement;
                            }
                        },
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                        setProperty: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => {
                                const boundleft = 0;
                                const boundtop = 0;
                                const boundRect = {
                                    left: boundleft,
                                    top: boundtop,
                                };
                                return boundRect;
                            },
                        },
                    },
                },
                {
                    provide: CanvasRenderingContext2D,
                    useValue: {
                        getImageData: () => null,
                        drawImage: () => null,
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(DropperToolService);
        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        positiveMouseEvent = createMouseEvent(10, 10, 0);
        negativeMouseEvent = createMouseEvent(-10, -10, 0);

        onAltKeyDown = createKeyBoardEvent(Keys.Alt);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return true is the coordinates of the mouse are positive', () => {
        expect(service.verifyPosition(positiveMouseEvent)).toBeTruthy();
    });

    it('should return false is the coordinates of the mouse are negative', () => {
        expect(service.verifyPosition(negativeMouseEvent)).toBeFalsy();
    });

    it('should initialize the attribute colorTool to be the colorToolService', () => {
        service.initializeColorToolService(new ColorToolService());

        expect(service.colorTool).toEqual(new ColorToolService());
    });

    it('should call updateSVGCopy after color is picked', () => {
        const spyOnUpdateSVGCopy: jasmine.Spy = spyOn(service, 'updateSVGCopy').and.returnValue();

        service.pickColor();

        expect(spyOnUpdateSVGCopy).toHaveBeenCalled();
    });

    it('should change the position of the current cooridination of the mouse to be positive if the event is positive', () => {
        service.currentMouseX = -5;

        service.onMouseMove(positiveMouseEvent);

        expect(service.currentMouseX).toBeGreaterThan(0);
    });

    it('should change the position of the current cooridination of the mouse to be negative if the event is negative', () => {
        service.currentMouseX = 5;

        service.onMouseMove(negativeMouseEvent);

        expect(service.currentMouseX).toBeLessThan(0);
    });

    it('should call getColor', () => {
        const spyOnGetColor: jasmine.Spy = spyOn(service, 'getColor').and.returnValue('test');

        service.onMouseDown(positiveMouseEvent);

        expect(spyOnGetColor).toHaveBeenCalled();
    });

    it('should call getColor and changePrimaryColor if left button of mouse is clicked', () => {
        const spyOnGetColor: jasmine.Spy = spyOn(service, 'getColor').and.returnValue('ffffffff');

        service.initializeColorToolService(new ColorToolService());

        const spyOnChangePrimaryColor: jasmine.Spy = spyOn(service.colorTool, 'changePrimaryColor')
            .withArgs('ffffffff')
            .and.returnValue();
        service.isIn = true;

        service.onMouseUp(positiveMouseEvent);

        expect(spyOnChangePrimaryColor).toHaveBeenCalled();
        expect(spyOnGetColor).toHaveBeenCalled();
    });

    it('should call getColor and changeSecondaryColor if right button of mouse is clicked', () => {
        const spyOnGetColor: jasmine.Spy = spyOn(service, 'getColor').and.returnValue('ffffffff');

        service.initializeColorToolService(new ColorToolService());

        const spyOnChangeSecondaryColor: jasmine.Spy = spyOn(service.colorTool, 'changeSecondaryColor')
            .withArgs('ffffffff')
            .and.returnValue();
        service.isIn = true;

        service.onMouseUp(createMouseEvent(10, 10, 2));

        expect(spyOnChangeSecondaryColor).toHaveBeenCalled();
        expect(spyOnGetColor).toHaveBeenCalled();
    });

    it('should change attribute "isIn" to true onMouseEnter', () => {
        service.isIn = false;

        service.onMouseEnter(positiveMouseEvent);

        expect(service.isIn).toEqual(true);
    });

    it('should change attribute "isIn" to false onMouseLeave', () => {
        service.isIn = true;

        service.onMouseLeave(positiveMouseEvent);

        expect(service.isIn).toEqual(false);
    });

    it('should return undefined if onKeyDown is not implemented', () => {
        expect(service.onKeyDown(onAltKeyDown)).toBeUndefined();
    });

    it('should return undefined if onKeyUp is not implemented', () => {
        expect(service.onKeyUp(onAltKeyDown)).toBeUndefined();
    });

    it('should return undefined if cleanUp is not implemented', () => {
        expect(service.cleanUp()).toBeUndefined();
    });

    it('should call pickColor and translateRGBToHex when function getColor is called', () => {
        const spyOnPickColor: jasmine.Spy = spyOn(service, 'pickColor').and.returnValue(new Uint8ClampedArray());
        service.initializeColorToolService(new ColorToolService());
        const spyOnTranslateRGBToHex: jasmine.Spy = spyOn(service.colorTool, 'translateRGBToHex')
            .withArgs(undefined, undefined, undefined)
            .and.returnValue('test');

        service.getColor(positiveMouseEvent);

        expect(spyOnPickColor).toHaveBeenCalled();
        expect(spyOnTranslateRGBToHex).toHaveBeenCalled();
    });
});

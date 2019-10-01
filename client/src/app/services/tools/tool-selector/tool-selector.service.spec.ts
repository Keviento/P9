import { getTestBed, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

import { ToolName } from 'src/constants/tool-constants';
import { ToolSelectorService } from './tool-selector.service';
import { ColorApplicatorToolService } from '../color-applicator-tool/color-applicator-tool.service';

fdescribe('ToolSelectorService', () => {
    let injector: TestBed;
    let service: ToolSelectorService;

    let spyOnChangeCurrentToolName: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ToolSelectorService,
                {
                    provide: MatDialog,
                    useValue: {},
                },
                ColorApplicatorToolService,
                {
                    initializeColorToolService: () => {},
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(ToolSelectorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when changeTool with newDrawing tool then displayNewDrawingModal is called', () => {
        const spyOnDisplayNewDrawingModal = spyOn(service, 'displayNewDrawingModal').and.returnValue();
        service.changeTool(ToolName.NewDrawing);

        expect(spyOnDisplayNewDrawingModal).toHaveBeenCalled();
    });

    it('when changeTool with pencil changeCurrentToolName should be call with pencil', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool(ToolName.Pencil);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Pencil);
    });

    it('when changeTool with retangle changeCurrentToolName should be call with rectangle', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool(ToolName.Rectangle);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Rectangle);
    });

    it('when changeTool with brush changeCurrentToolName should be call with brush', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool(ToolName.Brush);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Brush);
    });

    it('when changeTool with colorApplicator changeCurrentToolName should be call with colorApplicator', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool(ToolName.ColorApplicator);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.ColorApplicator);
    });

    it('when changeTool with tool not implemented yet changeCurrentToolName should be call with his name', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool(ToolName.Polygon);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Polygon);
    });

    it('when changeTool with non existing tool changeCurrentToolName should be call with Selection', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool('non-existing-tool');

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Selection);
    });

    it('when changeCurrentToolName with pencil then toolName is pencil', () => {
        const expectedResult: BehaviorSubject<ToolName> = new BehaviorSubject(ToolName.Pencil);
        service.changeCurrentToolName(ToolName.Pencil);
        // tslint:disable-next-line: no-string-literal
        expect(service['toolName']).toEqual(expectedResult);
    });

    it('should return pencil tool', () => {
        expect(service.getPencilTool()).toEqual(service[`pencilTool`]);
    });

    it('should return rectangle tool', () => {
        expect(service.getRectangleTool()).toEqual(service[`rectangleTool`]);
    });

    it('should return brush tool', () => {
        expect(service.getBrushTool()).toEqual(service[`brushTool`]);
    });

    it('should return color applicator tool', () => {
        expect(service.getColorApplicatorTool()).toEqual(service[`colorApplicatorTool`]);
    });
});

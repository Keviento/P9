import { Component, OnInit } from '@angular/core';

import { FILES_BUTTON_INFO, TOOLS_BUTTON_INFO } from '../../services/constants';
import { ToolsService } from '../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-sidebar-tools',
    templateUrl: './sidebar-tools.component.html',
    styleUrls: ['./sidebar-tools.component.scss'],
})
export class SidebarToolsComponent implements OnInit {
    toolsService: ToolsService;

    readonly TOOLS_BUTTON_INFO = TOOLS_BUTTON_INFO;
    readonly FILES_BUTTON_INFO = FILES_BUTTON_INFO;

    constructor(toolsService: ToolsService) {
        this.toolsService = toolsService;
    }

    ngOnInit(): void {
        this.toolsService.changeTool('Sélection');
    }

    onChangeTool(tooltipName: string): void {
        console.log(tooltipName);
        this.toolsService.changeTool(tooltipName);
    }

    onSecondaryClick(): void {
        console.log('onSecondaryClick');
    }

    onPrimaryClick(): void {
        console.log('onPrimaryClick');
    }
}

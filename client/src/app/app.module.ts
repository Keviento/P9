import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./components/app/app.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// *********** Material Angular ******************
import { MatInputModule, MatButtonToggleModule, MatButtonModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
//************************************************

// *************** Services **********************
import { ToolsService } from "./services/panel-tools/tools.service";
import { DrawingInfoService } from "./services/drawing-info/drawing-info.service";
//************************************************

import { AttributePanelComponent } from "./components/app/sidebar-tools/attribute-panel/attribute-panel.component";
import { WorkZoneComponent } from "./components/app/work-zone/work-zone.component";
import { SidebarToolsComponent } from "./components/app/sidebar-tools/sidebar-tools.component";
import { DrawingModalWindowComponent } from "./components/app/drawing-modal-window/drawing-modal-window.component";

@NgModule({
	declarations: [
		AppComponent,
		AttributePanelComponent,
		WorkZoneComponent,
		SidebarToolsComponent,
		DrawingModalWindowComponent,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatButtonToggleModule,
		MatButtonModule,
		BrowserAnimationsModule,
		BrowserModule,
		HttpClientModule,
	],
	providers: [ToolsService, DrawingInfoService],
	bootstrap: [AppComponent],
})
export class AppModule {}

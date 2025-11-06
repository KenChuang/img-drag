import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { AComponent } from './a/a.component';
import { BComponent } from './b/b.component';
import { NewCComponent } from './new-c/new-c.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageViewerComponent,
    AComponent,
    BComponent,
    NewCComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlanetsListComponent } from './planets-list/planets-list.component';
import { PlanetDetailsComponent } from './planet-details/planet-details.component';
import {HttpClientModule} from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SearchPlanetComponent } from './planets-list/search-planet/search-planet.component';

@NgModule({
  declarations: [
    AppComponent,
    PlanetsListComponent,
    PlanetDetailsComponent,
    SearchPlanetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

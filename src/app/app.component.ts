import { Component } from '@angular/core';
import {PlanetsService} from './planets.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [PlanetsService]
})
export class AppComponent {
  title = 'software-rt';
}

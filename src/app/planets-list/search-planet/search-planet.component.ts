import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {PlanetsService} from '../../planets.service';

@Component({
  selector: 'app-search-planet',
  templateUrl: './search-planet.component.html',
  styleUrls: ['./search-planet.component.scss']
})
export class SearchPlanetComponent implements OnInit {
  @ViewChild('input') input: ElementRef;
  @Output() onSearchPlanet = new EventEmitter<string>();


  constructor(
      private router: Router,
      private planetsService: PlanetsService
  ) {
  }

  ngOnInit(): void {
  }

  handleSearch() {
  this.onSearchPlanet.emit(this.input.nativeElement.value);
  }
}

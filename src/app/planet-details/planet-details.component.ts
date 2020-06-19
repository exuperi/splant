import { Component, OnInit } from '@angular/core';
import {IPlanet} from '../planet.model';
import {PlanetsService} from '../planets.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-planet-details',
  templateUrl: './planet-details.component.html',
  styleUrls: ['./planet-details.component.scss']
})
export class PlanetDetailsComponent implements OnInit {
  planet: IPlanet;
  id: number;
  isFetching: boolean;

  constructor(
      private planetsService: PlanetsService,
      private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.isFetching = true;
    this.route.params
        .subscribe((params: Params) => {
          this.id = +params['id'];
        })
    if( this.planetsService.getPlanets().length ) {
      this.planet = this.planetsService.getPlanet(this.id);
      if( this.planet ) this.isFetching = false;
    } else {
        this.planetsService.fetchPlanet(this.id)
            .subscribe(planet => {
              this.planet = planet;
              if( this.planet ) this.isFetching = false;
            })
    }
  }

}

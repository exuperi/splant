import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPlanet } from "./planet.model";

import { map } from "rxjs/operators";

interface IFetchPlanetsResponse {
  next: string;
  count: number;
  results: IPlanet[];
}

@Injectable()
export class PlanetsService {
  private httpConfig = {
    baseUrl:
      "http://ip172-18-0-3-brmf4dboudsg00esjfsg-8080.direct.labs.play-with-docker.com/api/planets",
  };

  private planetsList: IPlanet[] = [];
  private nextPage: number;
  private pageLength: number;

  constructor(private httpClient: HttpClient) {}

  fetchPlanets(pageIndex: number, searchQuery?: string) {
    return this.httpClient
      .get(
        `${this.httpConfig.baseUrl}${
          searchQuery ? "/?search=" + searchQuery : ""
        }${searchQuery ? "&" : "?"}page=${pageIndex}`,
        { responseType: "json" }
      )
      .pipe(
        map((response: IFetchPlanetsResponse) => {
          const data = response.results;
          const planetsArray: IPlanet[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              planetsArray.push({
                id: +key + 1 + this.planetsList.length,
                name: data[key].name,
                rotation_period: +data[key].rotation_period,
                orbital_period: +data[key].orbital_period,
                diameter: +data[key].diameter,
                climate: data[key].climate,
                gravity: data[key].gravity,
                terrain: data[key].terrain,
                surface_water: +data[key].surface_water,
                population: +data[key].population,
                page: pageIndex,
              });
            }
          }
          if (response.next)
            this.nextPage = +response.next.substring(
              response.next.search("page=") + 5
            );
          else this.nextPage = null;
          this.pageLength = response.count;
          this.planetsList.push(...planetsArray);
        })
      );
  }

  fetchPlanet(id: number) {
    return this.httpClient
      .get<IPlanet>(`${this.httpConfig.baseUrl}/${id}/`, {
        responseType: "json",
      })
      .pipe(
        map((data) => {
          const planet: IPlanet = {
            id,
            name: data.name,
            rotation_period: +data.rotation_period,
            orbital_period: +data.orbital_period,
            diameter: +data.diameter,
            climate: data.climate,
            gravity: data.gravity,
            terrain: data.terrain,
            surface_water: +data.surface_water,
            population: +data.population,
          };
          return planet;
        })
      );
	}

	reset() {
		this.planetsList.length = 0;
		this.nextPage = 1;
	}

  getPlanet(id: number) {
    return this.planetsList.find((planet) => {
      return planet.id === id;
    });
  }

  getNextPage() {
    return this.nextPage;
  }

  getPageLength() {
    return this.pageLength;
	}

	getPlanets() {
		return this.planetsList.slice();
	}
}

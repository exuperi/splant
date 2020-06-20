import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { PlanetsService } from "../planets.service";
import { IPlanet } from "../planet.model";
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';

@Component({
  selector: "app-planets-list",
  templateUrl: "./planets-list.component.html",
  styleUrls: ["./planets-list.component.scss"],
})
export class PlanetsListComponent implements OnInit {
  isFetching: boolean;
  planetsLoaded: IPlanet[] = [];
  loadTillPage: number;
  searchQuery: string;
  nextPage: number;
  pageEvent: PageEvent;
  pageIndex: number;
  pageSize: number;
  pageLength: number;

  constructor(
    private planetsService: PlanetsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.route.snapshot.queryParams["page"]) {
      this.router.navigate([], {
        queryParams: { page: 0, page_size: 10 },
      });
    }
    this.route.queryParams.subscribe((params: Params) => {
      this.pageIndex = +params["page"];
      this.pageSize = +params["page_size"];
      this.searchQuery = params['search'];
      this.pageLength = this.planetsService.getPageLength();
      this.loadTillPage = this.generateLoadPage();
      this.nextPage = this.planetsService.getNextPage();

      if (this.planetsService.getPlanets().length) {
        this.planetsLoaded = this.planetsService.getPlanets();
      } else {
        this.planetsService.reset();
        this.pageLength = this.planetsService.getPageLength() ? this.planetsService.getPageLength() : 60;
        this.nextPage = this.planetsService.getNextPage() ? this.planetsService.getNextPage() : this.planetsService.getPlanets().length / 10 + 1;
        this.loadTillPage = this.generateLoadPage();
        const checkIfPageIndexExist = setInterval(() => {
          if (
            this.pageIndex >= 0 &&
            this.pageSize >= 0 &&
            this.pageLength >= 0
          ) {
            clearInterval(checkIfPageIndexExist);
            this.getPlanetsData();
          }
        }, 50);
      }
    });
  }

  getPlanetsData(searchQuery?: string) {
    this.isFetching = true;
    this.planetsService
      .fetchPlanets(this.nextPage, searchQuery)
      .subscribe(() => {
        this.planetsLoaded = this.planetsService.getPlanets();
        this.nextPage = this.planetsService.getNextPage();
        this.pageLength = this.planetsService.getPageLength();
        console.log(this.loadTillPage);
        this.isFetching = false;
        if (this.nextPage && this.nextPage <= this.loadTillPage)
          this.getPlanetsData(this.searchQuery);
      });
  }

  handlePageSizeChange(size: number) {
    this.pageSize = size;
    this.loadTillPage = this.generateLoadPage();
    if (this.nextPage) {
      this.getPlanetsData();
    }
    this.router.navigate([], {
      queryParams: {
        page_size: size <= this.pageLength ? size : this.pageLength,
      },
      queryParamsHandling: "merge",
    });
  }

  handlePageChange(pageIndex: number) {
    this.router.navigate([], {
      queryParams: {
        page: pageIndex,
      },
      queryParamsHandling: "merge",
    });
    this.pageIndex = pageIndex;
    this.loadTillPage = this.generateLoadPage();
    if (
      Math.max(this.pageIndex, this.loadTillPage) * this.pageSize <
      this.planetsService.getPlanets().length
    ) {
      this.planetsLoaded = this.planetsService.getPlanets();
    } else if (this.nextPage) {
      this.getPlanetsData(this.searchQuery);
    }
  }

  handlePaginatorEvent(event: PageEvent) {
    if (event.previousPageIndex === event.pageIndex)
      this.handlePageSizeChange(event.pageSize);
    else this.handlePageChange(event.pageIndex);
    return event;
  }

  generateLoadPage() {
    return Math.ceil(((this.pageIndex + 1) * this.pageSize) / 10) <=
      Math.ceil(this.pageLength / 10)
      ? Math.ceil(((this.pageIndex + 1) * this.pageSize) / 10)
      : Math.ceil(this.pageLength / 10);
  }

  searchPlanets(searchQuery: string) {
    this.planetsService.reset();
    this.pageIndex = 0;
    this.searchQuery = searchQuery;
    this.nextPage = this.planetsService.getNextPage();
    this.loadTillPage = this.generateLoadPage();
    this.router.navigate([], {
      queryParams: {
        search: searchQuery
      },
      queryParamsHandling: 'merge'
    })
    this.getPlanetsData(searchQuery);
  }
}

import { Component, OnInit } from '@angular/core';
import {PlanetsService} from '../planets.service';
import {IPlanet} from '../planet.model';
import {PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-planets-list',
  templateUrl: './planets-list.component.html',
  styleUrls: ['./planets-list.component.scss']
})
export class PlanetsListComponent implements OnInit {
  isFetching: boolean;
  planetsLoaded: IPlanet[] = [];
  pageEvent: PageEvent;
  pageIndex: number;
  toLoadPageIndex: number;
  pageSize: number;
  length: number;
  currentlyLoadPage: number;
  searchQuery: string;


  constructor(
      private planetsService: PlanetsService,
      private route: ActivatedRoute,
      private router: Router
  ) {
    this.length = 60;
  }

  ngOnInit(): void {
    if (!this.route.snapshot.queryParams['page']) {
      this.router.navigate([], {queryParams: {page: 0, page_size: 10}, queryParamsHandling: 'merge'});
    }
    this.route.queryParams
        .subscribe(( params: Params ) => {
          this.pageIndex = +params['page'];
          this.pageSize = +params['page_size'];
          this.toLoadPageIndex = this.generateLoadPage()
          this.currentlyLoadPage = this.planetsService.getNextPage();
        });
    if ( this.planetsService.getPlanets().length ) {
      this.planetsLoaded = this.planetsService.getPlanets();
    } else {
      const checkIfPageIndexExist = setInterval(() => {
        if ( this.pageIndex >= 0) {
          clearInterval(checkIfPageIndexExist);
          this.currentlyLoadPage = this.planetsService.getPlanets().length / 10 + 1;
          for (this.currentlyLoadPage; this.currentlyLoadPage <= this.toLoadPageIndex; this.currentlyLoadPage++ ) {
                this.getPlanetsData();
          }
        }
      }, 50);
    }

  }

  getPlanetsData(searchQuery?: string) {
    this.isFetching = true;
    this.planetsService.fetchPlanets(this.currentlyLoadPage, searchQuery)
        .subscribe(data => {
          this.planetsLoaded = this.planetsService.getPlanets();
          this.currentlyLoadPage = this.planetsService.getNextPage();
          this.length = this.planetsService.getPageLength();
          this.isFetching = false;
        });
  }

  handlePageSizeChange(size: number) {
    this.pageSize = size;
    this.toLoadPageIndex = this.generateLoadPage();
    console.log(this.currentlyLoadPage, this.toLoadPageIndex)
    if (this.currentlyLoadPage) {
      for (this.currentlyLoadPage; this.currentlyLoadPage <= this.toLoadPageIndex; this.currentlyLoadPage++) {
        this.getPlanetsData(this.searchQuery);
      }
    }
      // size <= this.length ? this.pageSize = size : this.pageSize = this.length;
    this.router.navigate([], {queryParams: {page_size: size <= this.length ? size : this.length}, queryParamsHandling: 'merge'})
  }

  handlePageChange(pageIndex: number) {
    this.router.navigate([], { queryParams: {
        page: pageIndex ,
      }, queryParamsHandling: 'merge'});
    this.pageIndex = pageIndex;
    this.toLoadPageIndex = this.generateLoadPage();
    console.log(this.pageIndex, this.toLoadPageIndex, this.pageSize, this.planetsService.getPlanets().length)
    if ( Math.max(this.pageIndex, this.toLoadPageIndex) * this.pageSize < this.planetsService.getPlanets().length ) {
      this.planetsLoaded = this.planetsService.getPlanets();
    } else {
      // for (this.currentlyLoadPage; this.currentlyLoadPage <= this.toLoadPageIndex; this.currentlyLoadPage++) {
      //   this.getPlanetsData(this.searchQuery);
      // }
      this.getPlanetsData(this.searchQuery)
    }
  }

  handlePaginatorEvent(event: PageEvent) {
    if ( event.previousPageIndex === event.pageIndex ) this.handlePageSizeChange(event.pageSize)
    else this.handlePageChange(event.pageIndex)
    return event;
  }

  generateLoadPage() {
    return Math.ceil((this.pageIndex + 1) * this.pageSize / 10) <= Math.ceil(this.length / 10) ?
           Math.ceil((this.pageIndex + 1) * this.pageSize / 10) : Math.ceil(this.length / 10);
  }

  searchPlanets(searchQuery: string) {
    this.planetsService.resetPlanets();
    this.pageIndex = 0;
    this.searchQuery = searchQuery;
    this.currentlyLoadPage = this.planetsService.getNextPage();
    console.log(this.length)
    this.getPlanetsData(searchQuery);
  }

}

import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  Input,
} from "@angular/core";
import { Router } from "@angular/router";
import { PlanetsService } from "../../planets.service";

@Component({
  selector: "app-search-planet",
  templateUrl: "./search-planet.component.html",
  styleUrls: ["./search-planet.component.scss"],
})
export class SearchPlanetComponent implements OnInit {
  @ViewChild("input") input: ElementRef;
  @Output() onSearchPlanet = new EventEmitter<string>();
  @Input() inputValue: string;

  constructor(private router: Router, private planetsService: PlanetsService) {}

  ngOnInit(): void {
    const waitTillLoad = setInterval(() => {
      if (this.input.nativeElement) {
        clearInterval(waitTillLoad);
        this.input.nativeElement.value = this.inputValue || '';
      }
    }, 50);
  }

  handleSearch() {
    this.onSearchPlanet.emit(this.input.nativeElement.value);
  }
}

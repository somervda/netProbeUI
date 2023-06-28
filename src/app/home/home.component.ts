import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { HostService } from '../services/host.service';
import { interval } from 'rxjs/internal/observable/interval';
import { startWith, Subscription, switchMap } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  hostStatus: any;
  hostService$$: undefined | Subscription;
  constructor(private hostService: HostService) {}

  ngOnInit(): void {
    this.getHostStatus();
    // Set up polling for sensors, check each 15 seconds
    this.hostService$$ = interval(15000)
      .pipe(
        startWith(0),
        switchMap(() => this.hostService.getHostStatus())
      )
      .subscribe((response) => {
        this.hostStatus = response;
      });
  }

  getHostStatus(): void {
    this.hostService.getHostStatus().subscribe((response) => {
      this.hostStatus = response;
    });
  }

  iconClick() {
    this.hostStatus = [];
    this.getHostStatus();
  }
}

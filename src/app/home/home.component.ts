import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { HostService } from '../services/host.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  hostStatus: any;
  constructor(private hostService: HostService) {}

  ngOnInit(): void {
    this.getHostStatus();
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

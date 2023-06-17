import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { HostService, HostModel } from '../services/host.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css'],
})
export class HostComponent implements OnInit {
  host$$: Subscription | undefined;

  hostForm: FormGroup;
  // testForm: FormGroup;
  host: HostModel | undefined;
  id = 0;

  constructor(
    private hostService: HostService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.hostForm = this.fb.group({
      address: [this.host?.address, [Validators.required]],
      description: [this.host?.description, [Validators.required]],
      pingIntervalMinutes: [this.host?.ping?.intervalMinutes, []],
      pingActive: [this.host?.ping.active, []],
      bingIntervalMinutes: [this.host?.bing.intervalMinutes, []],
      bingActive: [this.host?.bing.active, []],
      webIntervalMinutes: [this.host?.web.intervalMinutes, []],
      webActive: [this.host?.web.active, []],
      webURL: [this.host?.web.url, [Validators.required]],
      webMatch: [this.host?.web.match, [Validators.required]],
      webHttps: [this.host?.web.https, []],
    });
  }

  ngOnInit(): void {
    let _id = this.route.snapshot.paramMap.get('id');
    this.id = _id !== null ? parseInt(_id) : 0;
    console.log('id:', this.id);
    this.hostService.getHost(this.id).subscribe((host) => {
      this.host = JSON.parse(JSON.stringify(host));
      console.log('host:', this.host, this.host?.ping.active);
      if (this.host) {
        this.hostForm.patchValue(this.host);
        // Patch value only updates from top level of object
        this.hostForm.controls['pingActive'].setValue(this.host?.ping.active);
        this.hostForm.controls['bingActive'].setValue(this.host?.bing.active);
        this.hostForm.controls['webActive'].setValue(this.host?.web.active);
        this.hostForm.controls['pingIntervalMinutes'].setValue(
          this.host?.ping.intervalMinutes
        );
        this.hostForm.controls['bingIntervalMinutes'].setValue(
          this.host?.bing.intervalMinutes
        );
        this.hostForm.controls['webIntervalMinutes'].setValue(
          this.host?.web.intervalMinutes
        );
        this.hostForm.controls['webURL'].setValue(this.host?.web.url);
        this.hostForm.controls['webMatch'].setValue(this.host?.web.match);
        this.hostForm.controls['webHttps'].setValue(this.host?.web.https);
      }
    });
  }

  update(): void {
    // console.log('update', this.cacheForm);
    // if (this.hostForm.invalid == false) {
    console.log('pingActive', this.hostForm.controls['pingIntervalMinutes']);
    if (this.host)
      this.hostService.addHost(this.host).subscribe((host) => {
        console.log('addHost$:', host);
      });
  }

  intervalComparisonFunction = function (
    option: string,
    value: boolean
  ): boolean {
    if (value == null) {
      return option == 'None';
    } else {
      return option == value.toString();
    }
  };
}

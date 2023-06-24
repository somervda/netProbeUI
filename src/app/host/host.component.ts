import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  action = '';

  constructor(
    private hostService: HostService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
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
      webURL: [this.host?.web.url, []],
      webMatch: [this.host?.web.match, []],
      webHttps: [this.host?.web.https, []],
    });
  }

  ngOnInit(): void {
    let _id = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = _id !== null ? parseInt(_id) : 0;
    let _action = this.activatedRoute.snapshot.paramMap.get('action');
    this.action = _action !== null ? _action : '';

    console.log('id:', this.id, this.action);
    if (this.action == 'add') {
      this.hostForm.controls['pingActive'].setValue(false);
      this.hostForm.controls['bingActive'].setValue(false);
      this.hostForm.controls['webActive'].setValue(false);
      this.hostForm.controls['pingIntervalMinutes'].setValue(5);
      this.hostForm.controls['bingIntervalMinutes'].setValue(5);
      this.hostForm.controls['webIntervalMinutes'].setValue(5);
      this.hostForm.controls['webURL'].setValue('');
      this.hostForm.controls['webMatch'].setValue('');
      this.hostForm.controls['webHttps'].setValue(false);
      this.hostForm.controls['address'].setValue('');
      this.hostForm.controls['description'].setValue('');
    } else {
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
  }

  loadHost() {
    this.host = {
      id: this.id,
      address: this.hostForm.controls['address'].value,
      description: this.hostForm.controls['description'].value,
      ping: {
        active: this.hostForm.controls['pingActive'].value,
        intervalMinutes: parseInt(
          this.hostForm.controls['pingIntervalMinutes'].value
        ),
      },
      bing: {
        active: this.hostForm.controls['bingActive'].value,
        intervalMinutes: parseInt(
          this.hostForm.controls['bingIntervalMinutes'].value
        ),
      },
      web: {
        active: this.hostForm.controls['webActive'].value,
        intervalMinutes: parseInt(
          this.hostForm.controls['webIntervalMinutes'].value
        ),
        url: this.hostForm.controls['webURL'].value,
        match: this.hostForm.controls['webMatch'].value,
        https: this.hostForm.controls['webHttps'].value,
      },
    };
  }

  doAction(action: string): void {
    if (this.hostForm.valid) {
      if (action == 'delete') {
        if (confirm('Are you sure to delete? ')) {
          if (this.host) {
            this.hostService.deleteHost(this.host['id']).subscribe((host) => {
              console.log('delHost$:', host);
              this.router.navigate(['/']);
            });
          }
        }
      } else {
        switch (this.action) {
          case 'add':
            this.loadHost();
            console.log('add:', this.host);
            if (this.host) {
              console.log('adding');
              this.hostService.addHost(this.host).subscribe((host) => {
                console.log('addHost$:', host);
                this.router.navigate(['/']);
              });
            }
            break;
          case 'update':
            this.loadHost();
            if (this.host)
              this.hostService.updateHost(this.host).subscribe((host) => {
                console.log('updateHost$:', host);
                this.router.navigate(['/']);
              });
            break;
        }
      }
    }
  }

  iconClick() {
    this.router.navigate(['/']);
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

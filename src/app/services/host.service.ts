import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

export interface HostModel {
  id: number;
  address: string;
  description: string;
  ping: {
    intervalMinutes: number;
    active: boolean;
  };
  bing: {
    intervalMinutes: number;
    active: boolean;
  };
  web: {
    intervalMinutes: number;
    https: boolean;
    active: boolean;
    match: string;
    url: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class HostService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getHostStatus() {
    let hostStatus$ = this.http.get<string>(
      'http://' + this.configService.getConfig().netProbeHost + '/hostStatus'
    );
    return hostStatus$;
  }

  getHost(id: number) {
    let host$ = this.http.get<HostModel>(
      'http://' +
        this.configService.getConfig().netProbeHost +
        '/host/' +
        id.toString()
    );

    return host$;
  }

  addHost(host: HostModel) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    });
    let options = {
      headers: httpHeaders,
    };
    let hostId$ = this.http.post(
      'http://' + this.configService.getConfig().netProbeHost + '/host/add',
      host,
      options
    );
    return hostId$;
  }

  updateHost(host: HostModel) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    });
    let options = {
      headers: httpHeaders,
    };
    let hostId$ = this.http.post(
      'http://' + this.configService.getConfig().netProbeHost + '/host/update',
      host,
      options
    );
    return hostId$;
  }

  deleteHost(id: number) {
    let host$ = this.http.delete(
      'http://' +
        this.configService.getConfig().netProbeHost +
        '/host/' +
        id.toString()
    );
    return host$;
  }
}

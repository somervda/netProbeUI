import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
  constructor(private http: HttpClient) {}

  getHostStatus() {
    let value = this.http.get<string>(
      'http://' + environment.netProbeHost + '/hostStatus'
    );
    return value;
  }

  getHost(id: number) {
    let host = this.http.get<HostModel>(
      'http://' + environment.netProbeHost + '/host/' + id.toString()
    );

    return host;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
    let value = this.http.get<string>(
      'http://' + environment.netProbeHost + '/host/' + id.toString()
    );
    return value;
  }
}

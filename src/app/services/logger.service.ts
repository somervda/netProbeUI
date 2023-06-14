import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(private http: HttpClient) {}

  getHistory(startTime: number, id: number, type: string) {
    let value = this.http.get<string>(
      'http://' +
        environment.netProbeHost +
        '/history/' +
        startTime.toString() +
        '/' +
        id.toString() +
        '/' +
        type
    );
    return value;
  }
}

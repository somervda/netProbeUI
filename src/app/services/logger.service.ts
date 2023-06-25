import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getHistory(startTime: number, id: number, type: string) {
    let value = this.http.get<string>(
      'http://' +
        this.configService.getConfig().netProbeHost +
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

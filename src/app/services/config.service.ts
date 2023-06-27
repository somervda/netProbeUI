import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AppConfig {
  netProbeHost: string;
  EPOCH_OFFSET: number;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: AppConfig = { netProbeHost: '' , EPOCH_OFFSET: 946684800};
  loaded = false;
  constructor(private http: HttpClient) {}
  loadConfig(): Promise<void> {
    return this.http
      .get<AppConfig>('/assets/config.json')
      .toPromise()
      .then((data) => {
        if (data) {
          this.config = data;
        }

        this.loaded = true;
      });
  }

  getConfig(): AppConfig {
    return this.config;
  }
}

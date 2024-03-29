import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import { environment } from 'src/environments/environment';
import { ChartType } from 'angular-google-charts';
import { MatRadioChange } from '@angular/material/radio';
import { HostService } from '../services/host.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  id = 0;
  type = '';
  chartHours = 4;
  chartMax = 0;

  // Google Charts
  showChart = false;
  chartResize = true;
  chartType = ChartType.LineChart;
  chartColumns: string[] = [];
  vAxisTitle = '';
  // See https://developers.google.com/chart/interactive/docs/gallery/combochart
  chartOptions: any;
  chartData: any[] = [];
  history = [];

  chartSelection = '1';
  title = '';
  description = '';
  hostAddress = '';

  constructor(
    private route: ActivatedRoute,
    private logger: LoggerService,
    private host: HostService,
    private router: Router,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    console.log('History ngOnInit');
    let _id = this.route.snapshot.paramMap.get('id');
    this.id = _id !== null ? parseInt(_id) : 0;
    let _type = this.route.snapshot.paramMap.get('type');
    this.type = _type !== null ? _type : '';

    this.doCharting(this.chartHours, this.id, this.type);
  }

  historyChange($event: MatRadioChange) {
    this.chartHours = parseInt($event.value);
    this.doCharting(this.chartHours, this.id, this.type);
  }

  rangeChange($event: MatRadioChange) {
    this.chartMax = parseInt($event.value);
    this.doCharting(this.chartHours, this.id, this.type);
  }

  doCharting(ageHours: number, id: number, type: string): void {
    // this.showChart = false;
    let startTime =
      Math.round(Date.now() / 1000) -
      this.configService.getConfig().EPOCH_OFFSET;
    startTime -= ageHours * 60 * 60;
    switch (type) {
      case 'ping':
        this.vAxisTitle = 'rtl ms';
        break;
      case 'bing':
        this.vAxisTitle = 'bps';
        break;
      case 'web':
        this.vAxisTitle = 'ms';
        break;
    }

    this.logger.getHistory(startTime, id, type).subscribe((response) => {
      // console.log(response);
      let pointSize = 0;
      this.chartData = [];
      let now = new Date(Date.now());
      console.log(now);
      this.history = Object.values(JSON.parse(JSON.stringify(response)));
      if (this.history.length > 0) {
        // Check to see if we are dealing with summarized data
        if (this.history[0]['p50']) {
          // Summarized
          this.history.forEach((element) => {
            this.chartData.push([
              new Date(
                (element['ts'] + this.configService.getConfig().EPOCH_OFFSET) *
                  1000
              ),
              element['p10'],
              element['p50'],
              element['p90'],
            ]);
          });
          this.chartColumns = ['Time', 'P10', 'P50', 'P90'];
          this.chartType = ChartType.AreaChart;
          Object.defineProperty(this.chartOptions, 'pointSize', {
            value: 0,
          });
          this.chartOptions = {
            legend: { position: 'bottom' },
            chartArea: { width: '80%', height: '70%' },
            formatters: {},
            vAxis: {
              viewWindow: { min: 0 },
              title: this.vAxisTitle,
              format: 'short',
            },
            hAxis: { viewWindow: { max: now } },
            pointSize: 2,
          };
        } else {
          // Not summarized
          this.history.forEach((element) => {
            this.chartData.push([
              new Date(
                (element['ts'] + this.configService.getConfig().EPOCH_OFFSET) *
                  1000
              ),
              element['v'],
            ]);
          });
          if (this.type == 'bing') {
            this.chartColumns = ['Time', 'bps'];
          } else {
            this.chartColumns = ['Time', 'ms'];
          }
          this.chartType = ChartType.ScatterChart;
          this.chartOptions = {
            legend: { position: 'bottom' },
            chartArea: { width: '80%', height: '70%' },
            formatters: {},
            vAxis: {
              viewWindow: { min: 0 },
              title: this.vAxisTitle,
              format: 'short',
            },
            hAxis: { viewWindow: { max: now } },
            pointSize: 7,
          };
        }
        if (this.chartMax == 100) {
          this.chartOptions.vAxis.viewWindow.max = '100000000';
        }
        if (this.chartMax == 10) {
          this.chartOptions.vAxis.viewWindow.max = '10000000';
        }
      }
    });
    // Get host address and show in title
    this.host.getHost(this.id).subscribe((response) => {
      let host = response;
      console.log(host);
      this.title = host.address;
      this.description = host.description;
      this.showChart = true;
    });

    // console.log(this.chartData);
  }

  iconClick() {
    this.router.navigate(['/']);
  }
}

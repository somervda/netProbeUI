import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import { environment } from 'src/environments/environment';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  id = 0;
  type = '';

  // Google Charts
  showChart = false;
  chartResize = true;
  chartType = ChartType.Line;
  chartColumns: string[] = [];
  // See https://developers.google.com/chart/interactive/docs/gallery/combochart
  chartOptions = {};
  chartData: any[] = [];
  history = [];
  chartDays = '1';
  chartSelection = '1';
  chartTitle = '';

  constructor(private route: ActivatedRoute, private logger: LoggerService) {}

  ngOnInit(): void {
    let _id = this.route.snapshot.paramMap.get('id');
    this.id = _id !== null ? parseInt(_id) : 0;
    let _type = this.route.snapshot.paramMap.get('type');
    this.type = _type !== null ? _type : '';
    this.getChart(24,this.id,this.type)

  }

  getChart(ageHours:number,id:number,type:string): void {
    this.showChart=false;
    let startTime = Math.round(Date.now() / 1000) - environment.EPOCH_OFFSET;
    startTime -= ageHours *  60 * 60;
    this.logger.getHistory(startTime,id,type).subscribe((response) => {
      console.log(response);
      this.chartData = [];
      this.history = Object.values(JSON.parse(JSON.stringify(response)));
      this.history.forEach((element) => {
        this.chartData.push([
          new Date((element['ts'] + environment.EPOCH_OFFSET) * 1000),
          element['v']
        ]);
      });
      this.chartColumns = ['Time', 'Value'];
      this.chartTitle = 'Basic Chart';
      this.showChart=true;
      console.log(this.chartData)
    });
  }
}

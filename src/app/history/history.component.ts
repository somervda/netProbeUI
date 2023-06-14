import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  id = 0;
  type = '';
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.id = id !== null ? parseInt(id) : 0;
    let type = this.route.snapshot.paramMap.get('type');
    this.type = type !== null ? type : '';
  }
}

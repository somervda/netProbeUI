import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'valuecell',
  templateUrl: './valuecell.component.html',
  styleUrls: ['./valuecell.component.css'],
})
export class ValuecellComponent implements OnInit {
  @Input() value = 0;
  @Input() UOM = '';
  @Input() success = true;
  @Input() active = true;
  @Input() fixedDigits = 0;
  strValue = '';
  scale = '';
  successClass = 'successful';

  constructor() {}

  ngOnInit(): void {
    if (this.success == true) {
      this.successClass = 'successful';
    } else {
      this.successClass = 'failure';
    }
    // format and display the cell
    let displayValue = this.value;
    this.scale = '';
    if (this.value > 1000000) {
      displayValue = this.value / 1000000;
      this.scale = 'M';
    } else if (this.value > 1000) {
      displayValue = this.value / 1000;
      this.scale = 'K';
    }
    this.strValue = displayValue.toFixed(this.fixedDigits);
  }
}

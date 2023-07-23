import { Component } from '@angular/core';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  template: `
    <div style="display: block">
      <canvas baseChart
              [datasets]="lineChartData"
              [labels]="lineChartLabels"
              [options]="lineChartOptions"
              [legend]="lineChartLegend"
              [chartType]="lineChartType"
              (chartHover)="chartHovered($event)"
              (chartClick)="chartClicked($event)"></canvas>
    </div>
  `,
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent {
  public lineChartData: any[] = [
    { data: [200, 350, 150, 450, 300, 200, 400], label: 'Expenses' }
  ];
  public lineChartLabels: string[] = ['2023-07-01', '2023-07-05', '2023-07-10', '2023-07-15', '2023-07-20', '2023-07-25', '2023-07-30'];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartLegend = true;
  public lineChartType = 'line';

  // Optional: Handle events
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }
}

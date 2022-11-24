import { Component, Input, OnInit } from '@angular/core';
import { Roll } from 'src/app/model/diceroll';

@Component({
  selector: 'simple-check',
  templateUrl: './simple-check.component.html',
  styleUrls: ['./simple-check.component.css'],
})
export class SimpleCheckComponent implements OnInit {
  @Input('roll') roll!: Roll;
  constructor() {}

  ngOnInit(): void {}
}

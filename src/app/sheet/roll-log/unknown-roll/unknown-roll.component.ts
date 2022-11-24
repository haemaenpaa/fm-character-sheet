import { Component, Input, OnInit } from '@angular/core';
import { Roll } from 'src/app/model/diceroll';

@Component({
  selector: 'unknown-roll',
  templateUrl: './unknown-roll.component.html',
  styleUrls: ['./unknown-roll.component.css'],
})
export class UnknownRollComponent implements OnInit {
  @Input('roll') roll!: Roll;
  constructor() {}

  ngOnInit(): void {}
}

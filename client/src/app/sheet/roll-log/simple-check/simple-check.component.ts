import { Component, Input, OnInit } from '@angular/core';
import { Roll, SimpleRoll } from 'src/app/model/diceroll';

/**
 * A simple check component. Displays the name of the check, followed by the roll.
 */
@Component({
  selector: 'simple-check',
  templateUrl: './simple-check.component.html',
  styleUrls: ['./simple-check.component.css', '../log-row-shared.css'],
})
export class SimpleCheckComponent implements OnInit {
  @Input('roll') roll!: SimpleRoll;
  constructor() {}

  ngOnInit(): void {}
}

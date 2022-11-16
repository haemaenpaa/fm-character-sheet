import { Component, Input, OnInit } from '@angular/core';
import { Ability } from 'src/app/model/ability';
import { Character } from 'src/app/model/character';
import { Roll, RollComponent } from 'src/app/model/diceroll';
import { DiceRollService } from 'src/app/services/dice-roll.service';

@Component({
  selector: 'ability-grid',
  templateUrl: './ability-grid.component.html',
  styleUrls: ['./ability-grid.component.css'],
})
export class AbilityGridComponent implements OnInit {
  @Input() character!: Character;
  constructor(private rollService: DiceRollService) {}

  ngOnInit(): void {}

  performRoll(ability: Ability) {
    const roll: Roll = new Roll();
    roll.title = ability.identifier;
    roll.character = this.character.name;
    roll.addDie(new RollComponent(20));
    roll.addModifier({ name: ability.identifier, value: ability.modifier });
    this.rollService.sendRoll(roll);
  }
}

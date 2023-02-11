import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { RaceDto } from 'fm-transfer-model';
import { race } from 'rxjs';
import { Race } from '../model/race';
import {
  convertResistanceDto,
  convertResistanceModel,
} from './resistance-mapper';

export function convertRaceDto(dto: RaceDto): Race {
  return {
    name: dto.name,
    subrace: dto.subrace,
    abilities: { ...dto.abilities },
    damageResistances: dto.damageResistances.map(convertResistanceDto),
    statusResistances: dto.statusResistances.map(convertResistanceDto),
    powerfulBuild: !!dto.powerfulBuild,
  };
}

export function convertRaceModel(model: Race): RaceDto {
  return {
    name: model.name,
    subrace: model.subrace,
    abilities: { ...model.abilities },
    damageResistances: model.damageResistances.map(convertResistanceModel),
    statusResistances: model.statusResistances.map(convertResistanceModel),
    powerfulBuild: !!model.powerfulBuild,
  };
}

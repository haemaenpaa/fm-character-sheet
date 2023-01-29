import { RaceDto, ResistanceDto } from "fm-transfer-model";
import { Race, RacialAbility } from "../model/race";
import { RacialResistance } from "../model/resistance";

export function convertRaceDto(dto: RaceDto): Race {
  const resistances = (dto.damageResistances || [])
    .map((d) => convertResistanceDto(d, "damage"))
    .concat(
      (dto.statusResistances || []).map((d) =>
        convertResistanceDto(d, "status")
      )
    );
  return Race.build({
    name: dto.name || "UNKNOWN",
    subRace: dto.subrace,
    powerfulBuild: !!dto.powerfulBuild,
    resistances,
    abilities: convertAbilitiesDto(dto.abilities),
  });
}

export function convertRaceDbModel(race: Race): RaceDto {
  const abilities: { [key: string]: string } = {};
  (race.getDataValue("abilities") as RacialAbility[]).forEach((abl) => {
    abilities[abl.getDataValue("name")] = abl.getDataValue("description");
  });
  const resistances = race.getDataValue("resistances") as RacialResistance[];
  const damageResistances: ResistanceDto[] = resistances
    .filter((r) => r.getDataValue("category") === "damage")
    .map((r) => ({
      type: r.getDataValue("type"),
      value: r.getDataValue("value"),
    }));
  const statusResistances: ResistanceDto[] = resistances
    .filter((r) => r.getDataValue("category") === "damage")
    .map((r) => ({
      type: r.getDataValue("type"),
      value: r.getDataValue("value"),
    }));
  const ret: RaceDto = {
    name: race.getDataValue("name"),
    subrace: race.getDataValue("subrace"),
    abilities,
    damageResistances,
    statusResistances,
  };
  return ret;
}

function convertResistanceDto(
  dto: ResistanceDto,
  category: string
): RacialResistance {
  return RacialResistance.build({
    type: dto.type || "resistance",
    value: dto.value || "UNKNOWN",
    category,
  });
}

function convertAbilitiesDto(dto?: { [key: string]: string }): RacialAbility[] {
  if (!dto) {
    return [];
  }
  return Object.keys(dto).map((name) => {
    return RacialAbility.build({
      name,
      description: dto[name],
    });
  });
}

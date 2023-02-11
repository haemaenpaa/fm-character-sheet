import { RaceDto, ResistanceDto } from "fm-transfer-model";
import { Race, RacialAbility } from "../model/race";
import { RacialResistance } from "../model/resistance";

export function convertRaceDto(dto: RaceDto): Race {
  if (!dto) {
    return undefined;
  }
  const resistances = dto.damageResistances
    .map((d) => convertResistanceDto(d, "damage"))
    .concat(
      dto.statusResistances.map((d) => convertResistanceDto(d, "status"))
    );
  const values = {
    name: dto.name || "UNKNOWN",
    subRace: dto.subrace,
    powerfulBuild: !!dto.powerfulBuild,
  };
  const ret = Race.build(values, {
    include: [Race.Resistances, Race.Abilities],
  });
  //For whatever reason, Race.build does not include these from the values.
  ret.setDataValue("resistances", resistances);
  ret.setDataValue("abilities", convertAbilitiesDto(dto.abilities));
  return ret;
}

export function convertRaceDbModel(race?: Race): RaceDto | undefined {
  if (!race) {
    return undefined;
  }
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
    .filter((r) => r.getDataValue("category") === "status")
    .map((r) => ({
      type: r.getDataValue("type"),
      value: r.getDataValue("value"),
    }));
  const ret: RaceDto = {
    name: race.getDataValue("name"),
    subrace: race.getDataValue("subRace"),
    powerfulBuild: race.getDataValue("powerfulBuild"),
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

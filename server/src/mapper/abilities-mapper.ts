import { CharacterAbilitiesDto } from "fm-transfer-model";

export function convertAbilitiesDto(abilities?: CharacterAbilitiesDto): any {
  return {
    br: abilities?.br || 10,
    dex: abilities?.dex || 10,
    vit: abilities?.vit || 10,
    int: abilities?.int || 10,
    cun: abilities?.cun || 10,
    res: abilities?.res || 10,
    pre: abilities?.pre || 10,
    man: abilities?.man || 10,
    com: abilities?.com || 10,
  };
}

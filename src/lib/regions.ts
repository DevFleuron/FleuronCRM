export const REGIONS_DEPARTEMENTS: Record<string, string[]> = {
  "ile-de-france": ["75", "77", "78", "91", "92", "93", "94", "95"],
  "auvergne-rhone-alpes": [
    "01",
    "03",
    "07",
    "15",
    "26",
    "38",
    "42",
    "43",
    "63",
    "69",
    "73",
    "74",
  ],
  bretagne: ["22", "29", "35", "56"],
  "nouvelle-aquitaine": [
    "16",
    "17",
    "19",
    "23",
    "24",
    "33",
    "40",
    "47",
    "64",
    "79",
    "86",
    "87",
  ],
  occitanie: [
    "09",
    "11",
    "12",
    "30",
    "31",
    "32",
    "34",
    "46",
    "48",
    "65",
    "66",
    "81",
    "82",
  ],
  "grand-est": ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"],
  "hauts-de-france": ["02", "59", "60", "62", "80"],
  normandie: ["14", "27", "50", "61", "76"],
  "pays-de-la-loire": ["44", "49", "53", "72", "85"],
  "provence-alpes-cote-azur": ["04", "05", "06", "13", "83", "84"],
  "bourgogne-franche-comte": ["21", "25", "39", "58", "70", "71", "89", "90"],
  "centre-val-de-loire": ["18", "28", "36", "37", "41", "45"],
  corse: ["2A", "2B"],
};

/**
 * Obtenir les départements d'une région
 */
export function getDepartementsFromRegion(region: string): string[] {
  return REGIONS_DEPARTEMENTS[region.toLowerCase()] || [];
}

export const cutawayKeys = Object.freeze([
  "softCutaway",
  "venetianCutaway",
  "florentineCutaway",
] as const);

export const cutawayMaskKeys = cutawayKeys.map((key) => `${key}Mask` as const);
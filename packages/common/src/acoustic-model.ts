export const cutawayKeys = Object.freeze([
  "noneCutaway",
  "softCutaway",
  "venetianCutaway",
  "florentineCutaway",
] as const);

export const cutawayBurstKeys = cutawayKeys.map((key) => `${key}Burst` as const);
export const cutawayMaskKeys = cutawayKeys.map((key) => `${key}Mask` as const);
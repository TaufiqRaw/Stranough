export interface SelectedItem {
  isElectric: any;
  guitarModel: any;
  constructionMethod: any;
  topContour: any;
  backContour: any;
  bodyCoreWood: any;
  bodyTopWood: any;
  neckWood: any;
  headstock: any;
  isLeftHanded: any;
  stringCount: any;
  bodyColorType: any;
  bodyColor: any;
  peg: any;
  bridge: any;
  knob: any;
  jack: any;
  // acoustic : {
  //   guitarModel: any;
  //   bodyCoreWood: any;
  //   bodyTopWood: any;
  //   neckWood: any;
  //   headstock: any;
  //   bodyColorType: any;
  //   bodyColor: any;
  //   peg: any;
  // }
}

export const bodyTopWoods = Object.freeze([
  { name: "Laminated Rosewood", key: "rosewood" },
  { name: "Laminated Plain Maple", key: "plain-maple" },
  { name: "Laminated Walnut", key: "walnut" },
  { name: "Laminated Flamed Maple", key: "flamed-maple" },
  { name: "Laminated Quilted Maple", key: "quilted-maple" },
  { name: "Laminated Spalted / Burl", key: "maple-burl" },
  { name: "Solid Mahogany", key: "mahogany" },
  // { name: "Solid White Ash", key: "white-ash" },
  { name: "Solid Swamp Ash", key: "swamp-ash" },
  { name: "Solid Alder", key: "alder" },
  { name: "Solid Hard Maple", key: "plain-maple" },
  { name: "Solid Walnut", key: "walnut" },
  { name: "Solid Rosewood", key: "rosewood" },
  // { name: "Solid Flamed Mango", key: "flamed-mango" },
  // { name: "Solid Spalted Tamarind", key: "spalted-tamarind" },
  // { name: "Solid Amboyna Burl", key: "amboyna-burl" },
  { name: "Solid Flamed Maple", key: "flamed-maple" },
  { name: "Solid Quilted Maple", key: "quilted-maple" },
  { name: "Solid Spalted Maple", key: "spalted-maple" },
  { name: "Solid Korina White", key: "korina-white" },
  { name: "Solid Korina Black", key: "korina-black" },
] as const);

export const bodyCoreWoods = Object.freeze([
  { name: "Mahogany", key: "mahogany" },
  { name: "1 Piece Mahogany", key: "mahogany" },
  { name: "Hard Maple", key: "plain-maple" },
  { name: "Walnut", key: "walnut" },
  { name: "Alder", key: "alder" },
  // { name: "White Ash", key: "white-ash" },
  { name: "Swamp Ash", key: "swamp-ash" },
  { name: "Rosewood", key: "rosewood" },
  { name: "Korina White", key: "korina-white" },
  { name: "Korina Black", key: "korina-black" },
] as const);

export const solidColors = Object.freeze({
  "RAL9010": 0xf1ece1,
  "RAL9002": 0xd7d5cb,
  "RAL1013": 0xe3d9c6,
  "RAL9001": 0xe9e0d2,
  "RAL5004": 0x191e28,
  "RAL7022": 0x4c4a44,
  "RAL7005": 0x646B63,
  "RAL7023": 0x686C5E,
  "RAL7035": 0xD7D7D7,
  "RAL7004": 0x969992,
  "RAL5001": 0x1F3438,
  "RAL5007": 0x3E5F8A,
  "RAL5013": 0x1E213D,
  "RAL5014": 0x606E8C,
  "RAL5015": 0x2271B3,
  "RAL5017": 0x063971,
  "RAL5020": 0x1D334A,
  "RAL5022": 0x252850,
  "RAL5024": 0x5D9B9B,
  "RAL6034": 0x7FB5B5,
  "RAL7000": 0x78858B,
  "RAL6000": 0x316650,
  "RAL6001": 0x287233,
  "RAL6003": 0x424632,
  "RAL6004": 0x1F3A3D,
  "RAL6011": 0x587246,
  "RAL6012": 0x343E40,
  "RAL6018": 0x57A639,
  "RAL6019": 0xBDECB6,
  "RAL7002": 0x7E7B52,
  "RAL7033": 0x7D8471,
  "RAL3012": 0xC1876B,
  "RAL3014": 0xD36E70,
  "RAL3015": 0xEA899A,
  "RAL4003": 0xDE4C8A,
  "RAL4009": 0xA18594,
  "RAL4008": 0x924E7D,
  "RAL4007": 0x4A192C,
  "RAL4005": 0x6C4675,
  "RAL4004": 0x641C34,
  "RAL4002": 0x922B3E,
  "RAL3007": 0x412227,
  "RAL2001": 0xC93C20,
  "RAL2002": 0xCB2821,
  "RAL2012": 0xE55137,
  "RAL3001": 0xA52019,
  "RAL3003": 0x9B111E,
  "RAL3005": 0x5E2129,
  "RAL3018": 0xD53032,
  "RAL3027": 0xC51D34,
  "RAL8004": 0x8E402A,
  "RAL2003": 0xFF7514,
  "RAL2010": 0xFF7514,
  "RAL8023": 0xA65E2E,
  "RAL1000": 0xBEBD7F,
  "RAL1003": 0xE5BE01,
  "RAL1011": 0x8A6642,
  "RAL1016": 0xEDFF21,
  "RAL1017": 0xF5D033,
  "RAL1021": 0xF3DA0B,
  "RAL1027": 0x9D9101,
  "RAL1001": 0xC2B078,
  "RAL1012": 0xC7B446,
  "RAL8000": 0x826C34,
  "RAL8001": 0x955F20,
  "RAL8008": 0x6F4F28,
  "RAL8011": 0x5B3A29,
  "RAL8025": 0x755C48,
} as const);

export const bodyColorType = Object.freeze([
  { name: "Solid", key: "solid" },
  // { name: "Relic", key: "relic" },
  // { name: "Top Burst", key: "top-burst" },
  // { name: "Top & Back Burst", key: "top-back-burst" },
  // { name: "Metallic", key: "metallic" },
  // { name: "Sparkle", key: "sparkle" },
  // { name: "Stripes", key: "stripes" },
  // { name: "Swirl", key: "swirl" },
] as const);

export const bodyColorTypeToColorsMap = Object.freeze({
  solid : solidColors,
});

export const bindings = Object.freeze([
  { name: "1 Ply PVC", key: "1-ply-pvc" },
  { name: "3 Ply PVC", key: "3-ply-pvc" },
  { name: "5 Ply PVC", key: "5-ply-pvc" },
  { name: "7 Ply PVC", key: "7-ply-pvc" },
  // { name: "Pearloid", key: "pearloid" },
  // { name: "Synthetic Abalone", key: "synthetic-abalone" },
  // { name: "Wood Purfling", key: "wood-purfling" },
  // { name: "Herringbone Purfling", key: "herringbone-purfling" },
  // { name: "Mother of Pearl", key: "mother-of-pearl" },
  // { name: "Abalone", key: "abalone" },
] as const);

export const neckWoods = Object.freeze([
  { name: "Mahogany", key: "mahogany" },
  { name: "Maple", key: "plain-maple" },
  { name: "Walnut", key: "walnut" },
  { name: "Rosewood", key: "rosewood" },
  // { name: "Quartersawn Maple", key: "quartersawn-maple" },
  // { name: "Roasted Maple", key: "roasted-maple" },
  // { name: "Ebony", key: "ebony" },
  { name: "Flamed Maple", key: "flamed-maple" },
  // { name: "Bird Eyes Maple", key: "bird-eyes-maple" },
  { name: "Quilted Maple", key: "quilted-maple" },
  // {
  //   name: "Multi-piece : Mahogany + Walnut/Rosewood",
  //   key: "multi-piece-:-mahogany-+-walnut/rosewood",
  // },
  // {
  //   name: "Multi-piece : Maple + Mahogany",
  //   key: "multi-piece-:-maple-+-mahogany",
  // },
  // {
  //   name: "Multi-piece : Maple + Walnut/Rosewood",
  //   key: "multi-piece-:-maple-+-walnut/rosewood",
  // },
  // {
  //   name: "Multi-piece : Mahogany + Maple + Walnut/Rosewood",
  //   key: "multi-piece-:-mahogany-+-maple-+-walnut/rosewood",
  // },
  // {
  //   name: "Multipiece : Roasted Flamed Maple (HEADLESS ONLY)",
  //   key: "multipiece-:-roasted-flamed-maple-(headless-only)",
  // },
] as const);
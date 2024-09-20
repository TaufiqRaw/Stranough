import { burstColors, metallicColors, solidColors } from "./colors";
import { backContourKeys, backContourPrice, constructionKeys, constructionLabels, constructionPrice, contourKeys, contourLabels, topContourKeys, topContourPrice } from "./electric-model";
import { pickupConfigurations } from "./pickup";
import * as R from 'remeda';

export type KeyOf<T> = T extends Record<infer K, any> ? K : never;

export type ValueOf<T> = T extends Record<infer K, {
  value ?: infer V
}> ? V : never;

export function asArray<T extends object>(obj: T) : {
  key : T extends Record<infer K, any> ? K : never,
  name : T extends Record<any, {name : infer N}> ? N : never
  price : T extends Record<any, {price : infer P}> ? P : undefined
}[] {
  return R.pipe(
    R.entries(obj),
    R.map(([key, value]) => ({
      key : key as any,
      name : (value as any).name,
      price : (value as any).price ?? 0,
    }))
  )
}

export function getValue<T extends object>(obj: T, key?: keyof T) : ValueOf<T> | undefined {
  if(!key) return undefined
  if (obj[key]){
    return (obj[key] as any).value
  }else {
    return undefined
  }
}

export const binaryOptions = Object.freeze({
  "yes": {
    name : "Yes",
    value : true,
  },
  "no": {
    name : "No",
    value : false,
  },
} as const);

export function getGuitarCategory(type: KeyOf<typeof guitarTypes>) {
  switch (type) {
    case "electric-guitar":
    case "electric-bass":
      return "electric";
    case "acoustic-guitar":
    case "acoustic-bass":
      return "acoustic";
  }
}

export interface SelectedItem {
  guitarType: KeyOf<typeof guitarTypes>;
  orientation : KeyOf<typeof orientation>;
  // case :
  assembleGuitar : boolean;
  acoustic : {
    guitarModel : number;
    stringCount: KeyOf<typeof stringCounts['acoustic-guitar' | 'acoustic-bass']>;
    scaleLength : KeyOf<typeof scaleLengths['acoustic-guitar' | 'acoustic-bass']>;

    // cutaway : boolean;
    // topWood : 
    // sideWood :
    // backWood :
    topBinding: KeyOf<typeof bindings>;
    backBinding: KeyOf<typeof bindings>;
    // backPurfling :
    // rosette :
    // armrest : boolean;

    // bridge :
    // preampCavity : boolean;
    // bodyLogo :
    topBodyColorType: KeyOf<typeof bodyColorType>;
    topBodyColor: KeyOf<typeof bodyColorTypeToColorsMap[KeyOf<Omit<typeof bodyColorType, 'natural'>>]>
    backBodyColorType: KeyOf<typeof bodyColorType>;
    backBodyColor: KeyOf<typeof bodyColorTypeToColorsMap[KeyOf<Omit<typeof bodyColorType, 'natural'>>]>
    burstType : KeyOf<typeof burstTypes>;
    burstColor : KeyOf<typeof burstColors>;
    // bodyFinish :
    
    neckWood : KeyOf<typeof neckWoods>;
    neckProfile : KeyOf<typeof neckProfiles>;
    trussRodType : KeyOf<typeof TrussRodType>;
    trussRodPosition : KeyOf<typeof trussRodPositions['acoustic']>;
    carbonFiberRod : boolean;
    neckBinding : KeyOf<typeof bindings>;
    neckColorType: KeyOf<typeof neckColorType>;
    neckColor: KeyOf<typeof neckColorTypeToColorsMap[KeyOf<Omit<typeof neckColorType, 'natural'>>]>
    // neckFinish :

    fingerboardWood: KeyOf<typeof fingerboardWoods>;
    // inlay:
    sideInlay: KeyOf<typeof sideInlay>;
    fingerboardRadius: KeyOf<typeof fingerboardRadius>;
    useFret: boolean;
    fretCount : KeyOf<typeof fretCount>;
    // fingerboardScalloping:
    fingerboardEdge: KeyOf<typeof fingerboardEdge>;

    headstock: number;
    headstockOverlay : KeyOf<typeof headstockOverlay>;
    // headstockLogo :
    headstockBinding : KeyOf<typeof bindings>;
    // headstockColorType :
    // headstockColor :
    // headstockFinish :
    
    nut: number;
    peg: number;
    pickguardMaterial: KeyOf<typeof pickguardMaterials>;
    //stringBrand : number;
  },
  electric : {
    guitarModel: number;
    //specialElectronicParts :
    stringCount: KeyOf<typeof stringCounts['electric-guitar' | 'electric-bass']>;
    constructionMethod: typeof constructionKeys[number];
    scaleLength : KeyOf<typeof scaleLengths['electric-guitar' | 'electric-bass']>;

    bodyType : KeyOf<typeof electricBodyTypes>;
    topContour: typeof topContourKeys[number];
    backContour: typeof backContourKeys[number];
    bodyCoreWood: KeyOf<typeof bodyCoreWoods>;
    bodyTopWood: KeyOf<typeof bodyTopWoods>;
    topBinding: KeyOf<typeof bindings>;
    backBinding: KeyOf<typeof bindings>;
    bodyLogo : KeyOf<typeof bodyLogo>;
    topBodyColorType: KeyOf<typeof bodyColorType>;
    topBodyColor: KeyOf<typeof bodyColorTypeToColorsMap[KeyOf<Omit<typeof bodyColorType, 'natural'>>]>
    backBodyColorType: KeyOf<typeof bodyColorType>;
    backBodyColor: KeyOf<typeof bodyColorTypeToColorsMap[KeyOf<Omit<typeof bodyColorType, 'natural'>>]>
    burstType : KeyOf<typeof burstTypes>;
    burstColor : KeyOf<typeof burstColors>;
    // bodyFinish :
    neckWood: KeyOf<typeof neckWoods>;
    neckProfile : KeyOf<typeof neckProfiles>;
    trussRodType : KeyOf<typeof TrussRodType>;
    trussRodPosition : KeyOf<typeof trussRodPositions['electric']>;
    neckBinding: KeyOf<typeof bindings>;
    carbonFiberRod : boolean;
    neckColorType: KeyOf<typeof neckColorType>;
    neckColor: KeyOf<typeof neckColorTypeToColorsMap[KeyOf<Omit<typeof neckColorType, 'natural'>>]>
    // neckFinish :

    fingerboardWood: KeyOf<typeof fingerboardWoods>;
    inlay: KeyOf<typeof inlayTypes>;
    sideInlay: KeyOf<typeof sideInlay>;
    fingerboardRadius: KeyOf<typeof fingerboardRadius>;
    useFret: boolean;
    fretCount : KeyOf<typeof fretCount>;
    // fingerboardScalloping:
    fingerboardEdge: KeyOf<typeof fingerboardEdge>;

    headstock: number;
    headstockOverlay : KeyOf<typeof headstockOverlay>;
    headstockLogo : KeyOf<typeof headstockLogo>;
    headstockBinding : KeyOf<typeof bindings>;
    headstockColorType : KeyOf<typeof headstockColorType>;
    headstockColor : KeyOf<typeof headstockColorTypeToColorsMap[KeyOf<Omit<typeof headstockColorType, 'natural'>>]>
    // headstockColor :
    // headstockFinish :

    peg: number;
    nut: number;
    // fretwire: number;
    bridge: number;
    bridge2?: number;
    pickguard: number;
    pickguardMaterial: KeyOf<typeof pickguardMaterials>;
    // switch: number;
    knob: number;
    jack: KeyOf<typeof jackTypes>;
    // batteryBox: boolean;
    // activePreamp: number; //? ask stranough for this
    pickupConfiguration : keyof typeof pickupConfigurations['electric-guitar'],
    //bridgeCover : boolean;
    //electronicCover : boolean;
    //stringBrand : number;
    bridgePickup : number,
    neckPickup : number,
    middlePickup : number,
  },
  
}

export const selectedItemLabels : {[k in SelectedItemKeys] : string}= {
  guitarModel: "Bentuk dasar gitar",
  stringCount: "Jumlah senar",
  constructionMethod: "Metode konstruksi",
  scaleLength : "Panjang skala",
  assembleGuitar : "Rakit gitar",
  guitarType : "Tipe gitar",
  orientation : "Orientasi",

  bodyType : "Tipe body",
  topContour: "Kontur atas",
  backContour: "Kontur bawah",
  bodyCoreWood: "Kayu inti body",
  bodyTopWood: "Kayu atas body",
  topBinding: "Binding atas",
  backBinding: "Binding bawah",
  bodyLogo : "Logo body",
  topBodyColorType: "Tipe warna atas",
  topBodyColor: "Warna atas",
  backBodyColorType: "Tipe warna bawah",
  backBodyColor: "Warna bawah",
  burstType : "Tipe burst",
  burstColor : "Warna burst",
  neckWood: "Kayu leher",
  neckProfile : "Profil leher",
  trussRodType : "Tipe truss rod",
  trussRodPosition : "Posisi truss rod",
  neckBinding: "Binding leher",
  carbonFiberRod : "Truss rod karbon",
  neckColorType: "Tipe warna leher",
  neckColor: "Warna leher",

  fingerboardWood: "Kayu fingerboard",
  sideInlay: "Inlay samping",
  fingerboardRadius: "Radius fingerboard",
  useFret: "Fret",
  fretCount : "Jumlah fret",
  fingerboardEdge: "Tepi fingerboard",
  inlay : "Inlay",

  headstock: "Headstock",
  headstockOverlay : "Overlay headstock",
  headstockLogo : "Logo headstock",
  headstockBinding : "Binding headstock",
  headstockColorType : "Tipe warna headstock",
  headstockColor : "Warna headstock",

  peg: "Peg",
  nut: "Nut",
  pickguard : "Pickguard",
  pickguardMaterial: "Material pickguard",
  knob: "Knob",
  jack: "Jack",
  pickupConfiguration : "Konfigurasi pickup",
  bridgePickup : "Pickup bridge",
  neckPickup : "Pickup neck",
  middlePickup : "Pickup middle",
  bridge : "Bridge",
  bridge2 : "Bridge 2",
}

export const electricItemLabels : {[k in keyof SelectedItem['electric']] : string} = {
  guitarModel: "Bentuk dasar gitar",
  stringCount: "Jumlah senar",
  constructionMethod: "Metode konstruksi",
  scaleLength : "Panjang skala",

  bodyType : "Tipe body",
  topContour: "Kontur atas",
  backContour: "Kontur bawah",
  bodyCoreWood: "Kayu inti body",
  bodyTopWood: "Kayu atas body",
  topBinding: "Binding atas",
  backBinding: "Binding bawah",
  bodyLogo : "Logo body",
  topBodyColorType: "Tipe warna atas",
  topBodyColor: "Warna atas",
  backBodyColorType: "Tipe warna bawah",
  backBodyColor: "Warna bawah",
  burstType : "Tipe burst",
  burstColor : "Warna burst",
  neckWood: "Kayu leher",
  neckProfile : "Profil leher",
  trussRodType : "Tipe truss rod",
  trussRodPosition : "Posisi truss rod",
  neckBinding: "Binding leher",
  carbonFiberRod : "Truss rod karbon",
  neckColorType: "Tipe warna leher",
  neckColor: "Warna leher",

  fingerboardWood: "Kayu fingerboard",
  sideInlay: "Inlay samping",
  fingerboardRadius: "Radius fingerboard",
  useFret: "Fret",
  fretCount : "Jumlah fret",
  fingerboardEdge: "Tepi fingerboard",
  inlay : "Inlay",

  headstock: "Headstock",
  headstockOverlay : "Overlay headstock",
  headstockLogo : "Logo headstock",
  headstockBinding : "Binding headstock",
  headstockColorType : "Tipe warna headstock",
  headstockColor : "Warna headstock",

  peg: "Peg",
  nut: "Nut",
  pickguard : "Pickguard",
  pickguardMaterial: "Material pickguard",
  knob: "Knob",
  jack: "Jack",
  pickupConfiguration : "Konfigurasi pickup",
  bridgePickup : "Pickup bridge",
  neckPickup : "Pickup neck",
  middlePickup : "Pickup middle",
  bridge : "Bridge",
  bridge2 : "Bridge 2",
}


export const mustImplementLabel = ['bridge', 'bridgePickup', 'guitarModel', 'headstock', 'knob', 'middlePickup', 'neckPickup', 'nut', 'peg', 'bridge2', 'pickguard'] as const;

export const selectedElectricItemNames : {[k in keyof Omit<SelectedItem['electric'], typeof mustImplementLabel[number]>] : (key ?: SelectedItem['electric'][k]) => string | undefined} = {
  backBinding : (item)=>item ? bindings[item].name : undefined,
  backContour : (item)=> item ? contourLabels[item] : undefined,
  backBodyColorType : (item)=> item ? bodyColorType[item].name : undefined,
  bodyCoreWood : (item)=> item ? bodyCoreWoods[item].name : undefined,
  bodyLogo : (item)=> item ? bodyLogo[item].name : undefined,
  bodyTopWood : (item)=> item ? bodyTopWoods[item].name : undefined,
  bodyType : (item)=> item ? electricBodyTypes[item].name : undefined,
  burstColor : (item)=> item ? burstColors[item].name : undefined,
  burstType : (item)=> item ? burstTypes[item].name : undefined,
  constructionMethod : (item)=> item ? constructionLabels[item] : undefined,
  fingerboardEdge : (item)=> item ? fingerboardEdge[item].name : undefined,
  fingerboardRadius : (item)=> item ? fingerboardRadius[item].name : undefined,
  fingerboardWood : (item)=> item ? fingerboardWoods[item].name : undefined,
  headstockBinding : (item)=> item ? bindings[item].name : undefined,
  headstockColorType : (item)=> item ? headstockColorType[item].name : undefined,
  headstockColor : (item)=> item,
  headstockLogo : (item)=> item ? headstockLogo[item].name : undefined,
  headstockOverlay : (item)=> item ? headstockOverlay[item].name : undefined,
  neckBinding : (item)=> item ? bindings[item].name : undefined,
  neckColorType : (item)=> item ? bodyColorType[item].name : undefined,
  neckProfile : (item)=> item ? neckProfiles[item].name : undefined,
  neckWood : (item)=> item ? neckWoods[item].name : undefined,
  pickguardMaterial : (item)=> item ? pickguardMaterials[item].name : undefined,
  trussRodPosition : (item)=> item ? trussRodPositions.electric[item].name : undefined,
  trussRodType : (item)=> item ? TrussRodType[item].name : undefined,
  stringCount : (item)=> item ? item.replace(/String/g, "Senar") : undefined,
  carbonFiberRod : (item)=> item ? 'Pakai' : 'Tidak pakai',
  useFret : (item)=> item ? 'Pakai' : 'Tidak pakai',
  pickupConfiguration : (item)=> item,
  fretCount : (item)=> item ? `${item} Fret` : undefined,
  scaleLength : (item)=> item ? `${item}` : undefined,
  backBodyColor : (item)=> item,
  topBodyColor : (item)=> item,
  neckColor : (item)=> item,
  sideInlay : (item)=> item ? sideInlay[item].name : undefined,
  inlay : (item)=> item ? inlayTypes[item].name : undefined,
  jack : (item)=> item ? jackTypes[item].name : undefined,
  topBinding : (item)=> item ? bindings[item].name : undefined,
  topBodyColorType : (item)=> item ? bodyColorType[item].name : undefined,
  topContour : (item)=> item ? contourLabels[item] : undefined,
}

export const jackTypes = Object.freeze({
  "top" : {
    name : "Top",
    price : 30000,
  },
  "top-plated" : {
    name : "Top Plated",
    price : 50000,
  },
  "side" : {
    name : "Side",
    price : 50000,
  },
} as const);

export const inlayTypes = Object.freeze({
  "pvc-dot" : {
    name : "PVC Dot",
  },
  "pearloid-dot" : {
    name : "Pearloid Dot",
  },
  "mother-of-pearl-dot" : {
    name : "Mother of Pearl Dot",
    price : 50000,
  },
  "abalone-dot" : {
    name : "Abalone Dot",
    price : 50000,
  },
  "glow-in-the-dark-dot" : {
    name : "Glow in the Dark Dot",
    price : 100000,
  },
  "pearloid-block" : {
    name : "Pearloid Block",
    price : 200000,
  }
  
} as const);

// true means the key is nullable
// false means the key is sometimes nullable, this for programmer to implement the logic
// undefined means the key is required
export const nullableSelectedItem : {
  common : {[k in keyof SelectedItem['electric' | 'acoustic']] ?: boolean},
  electric : {[k in keyof SelectedItem['electric']] ?: boolean},
  acoustic : {[k in keyof SelectedItem['acoustic']] ?: boolean},
} = {
  common : {
    topBinding : true,
    backBinding : true,
    neckBinding : true,
    headstockBinding : true,
    headstockOverlay : true,
    sideInlay : true,
  },
  electric : {
    bodyTopWood : false,
  },
  acoustic : {
    
  }
}

export type SelectedItemWithoutObj = Omit<SelectedItem, 'electric' | 'acoustic'>
export type SelectedItemKeys = keyof SelectedItemWithoutObj | keyof SelectedItem['electric'] | keyof SelectedItem['acoustic']

export const pickguardMaterials = Object.freeze({
  "1-ply-black-pvc" : {
    name : "1 Ply Black PVC",
    price : {
      small : 115000,
      medium : 165000,
      large : 205000,
    }
  },
  "1-ply-white-pvc" : {
    name : "1 Ply White PVC",
    price : {
      small : 115000,
      medium : 165000,
      large : 205000,
    }
  },
  "1-ply-ivory-pvc" : {
    name : "1 Ply Ivory PVC",
    price : {
      small : 115000,
      medium : 165000,
      large : 205000,
    }
  },
  "3-ply-black-pvc" : {
    name : "3 Ply Black PVC",
    price : {
      small : 125000,
      medium : 205000,
      large : 255000,
    }
  },
  "3-ply-white-pvc" : {
    name : "3 Ply White PVC",
    price : {
      small : 125000,
      medium : 205000,
      large : 255000,
    }
  },
  "1-ply-red-pvc" : {
    name : "1 Ply Red PVC",
    price : {
      small : 115000,
      medium : 165000,
      large : 205000,
    }
  },
  "1-ply-blue-pvc" : {
    name : "1 Ply Blue PVC",
    price : {
      small : 115000,
      medium : 165000,
      large : 205000,
    }
  },
  "1-ply-transparent-acrylic" : {
    name : "1 Ply Transparent Acrylic",
    price : {
      small : 115000,
      medium : 165000,
      large : 205000,
    }
  },
  "3-ply-white-pearloid" : {
    name : "3 Ply White Pearloid",
    price : {
      small : 150000,
      medium : 230000,
      large : 280000,
    }
  },
  "3-ply-tortoise" : {
    name : "3 Ply Tortoise Celluloid",
    price : {
      small : 150000,
      medium : 230000,
      large : 280000,
    }
  },
  "3-ply-red-pearloid" : {
    name : "3 Ply Red Pearloid",
    price : {
      small : 150000,
      medium : 230000,
      large : 280000,
    }
  },
  "3-ply-ivory-pearloid" : {
    name : "3 Ply Ivory Pearloid",
    price : {
      small : 150000,
      medium : 230000,
      large : 280000,
    }
  },
  "3-ply-black-pearloid" : {
    name : "3 Ply Black Pearloid",
    price : {
      small : 150000,
      medium : 230000,
      large : 280000,
    }
  },
  "3-ply-blue-pearloid" : {
    name : "3 Ply Blue Pearloid",
    price : {
      small : 150000,
      medium : 230000,
      large : 280000,
    }
  },
  "3-ply-green-pearloid" : {
    name : "3 Ply Green Pearloid",
    price : {
      small : 150000,
      medium : 230000,
      large : 280000,
    }
  },
  "2-ply-chrome-mirror" : {
    name : "2 Ply Chrome Mirror",
    price : {
      small : 150000,
      medium : 230000,
      large : 280000,
    }
  },
  "2-ply-red-mirror" : {
    name : "2 Ply Red Mirror",
    price : {
      small : 150000,
      medium : 230000,
      large : 280000,
    }
  },
  "2-ply-blue-mirror" : {
    name : "2 Ply Blue Mirror",
    price : {
      small : 150000,
      medium : 230000,
      large : 280000,
    }
  },
  "rosewood-veneer" : {
    name : "Rosewood Veneer",
    price : {
      small : 190000,
      medium : 255000,
      large : 305000,
    }
  },
  "quilted-maple-veneer" : {
    name : "Quilted Maple Veneer",
    price : {
      small : 190000,
      medium : 255000,
      large : 305000,
    }
  },
  "flamed-maple-veneer" : {
    name : "Flamed Maple Veneer",
    price : {
      small : 215000,
      medium : 305000,
      large : 355000,
    }
  },
  "diamond-plate-1-plate" : {
    name : "Diamond Plate 1 Plate",
    price : {
      small : 265000,
      medium : 355000,
      large : 405000,
    }
  },
  "diamond-plate-2-plate" : {
    name : "Diamond Plate 2 Plate",
    price : {
      small : 265000,
      medium : 355000,
      large : 405000,
    }
  },
  "diamond-style-artificial" : {
    name : "Diamond Style Artificial",
    price : {
      small : 190000,
      medium : 255000,
      large : 305000,
    }
  },
  "2-ply-gold-mirror" : {
    name : "2 Ply Gold Mirror",
    price : {
      small : 185000,
      medium : 265000,
      large : 315000,
    }
  },
} as const);


export const orientation = Object.freeze({
  "right-handed": {
    name : "Right Handed",
  },
  "left-handed": {
    name : "Left Handed",
    price : 250000,
  },
} as const);

export const burstTypes = Object.freeze({
  "top" : {
    name : "Top",
    price : 200000,
  },
  "top-back" : {
    name : "Top & Back",
    price : 250000,
  },
} as const)

export const neckProfiles = Object.freeze({
  "c" : {
    name : "C",
  },
  "d" : {
    name : "D",
  },
  "v" : {
    name : "V",
  },
  "u" : {
    name : "U",
  },
  "asymmetric" : {
    name : "Asymmetric",
    price : 200000,
  },
} as const);

export const guitarTypes = Object.freeze({
  "electric-guitar": {
    name : "Gitar Listrik",
  },
  "electric-bass": {
    name : "Bass Listrik",
  },
  "acoustic-guitar": {
    name : "Gitar Akustik",
  },
  "acoustic-bass": {
    name : "Bass Akustik",
  },
} as const);

export const TrussRodType = Object.freeze({
  "single-action": {
    name : "Single Action",
    price : 45000
  },
  "double-action": {
    name : "Double Action",
    price : 75000
  },
} as const);

export const scaleLengths = Object.freeze({
  "electric-guitar" : {
    "24": {
      name : "24",
      value : 24,
    },
    "24.75": {
      name : "24.75",
      value : 24.75,
    },
    "25": {
      name : "25",
      value : 25,
    },
    "25.5": {
      name : "25.5",
      value : 25.5,
    },
    "Baritone (27\"-30\")": {
      name : "Baritone (27\"-30\")",
      value : 27,
      price : 150000,
    },
    "multi-Scale": {
      name : "Multi-Scale",
      value : "multi-scale",
      price : 250000,
    },
  },
  "electric-bass" : {
    "30": {
      name : "30",
      value : 30,
    },
    "32": {
      name : "32",
      value : 32,
    },
    "34": {
      name : "34",
      value : 34,
    },
    "35": {
      name : "35",
      value : 35,
    },
    "38": {
      name : "38",
      value : 38,
    },
    "multi-Scale": {
      name : "Multi-Scale",
      value : "multi-scale",
    },
  },
  "acoustic-guitar" : {
    "Classical 650mm": {
      name : "Classical 650mm",
      value : 25.6,
    },
    "Classical 660mm": {
      name : "Classical 660mm",
      value : 25.98,
    },
    "23": {
      name : "23",
      value : 23,
    },
    "24": {
      name : "24",
      value : 24,
    },
    "24,75": {
      name : "24.75",
      value : 24.75,
    },
    "24,9": {
      name : "24.9",
      value : 24.9,
    },
    "25": {
      name : "25",
      value : 25,
    },
    "25,4": {
      name : "25.4",
      value : 25.4,
    },
    "25,5": {
      name : "25.5",
      value : 25.5,
    },
    "25,625": {
      name : "25.625",
      value : 25.625,
    },
  },
  "acoustic-bass" : {
    "30": {
      name : "30",
      value : 30,
    },
    "32": {
      name : "32",
      value : 32,
    },
    "34": {
      name : "34",
      value : 34,
    },
    "35": {
      name : "35",
      value : 35,
    },
    "38": {
      name : "38",
      value : 38,
    },
  },
} as const);

export const stringCounts = Object.freeze({
  "electric-guitar": {
    "6 String": {
      name : "6 String",
      value : 6,
    },
    "7 String": {
      name : "7 String",
      value : 7,
      price : 250000,
    },
    "8 String": {
      name : "8 String",
      value : 8,
      price : 500000,
    },
    // "12 String": {
    //   name : "12 String",
    //   value : 12,
    //   price : 500000,
    // },
  },
  "acoustic-guitar": {
    "6 String": {
      name : "6 String",
      value : 6,
    },
    "12 String": {
      name : "12 String",
      value : 12,
    },
  },
  "electric-bass": {
    "4 String": {
      name : "4 String",
      value : 4,
    },
    "5 String": {
      name : "5 String",
      value : 5,
    },
    "6 String": {
      name : "6 String",
      value : 6,
    },
  },
  "acoustic-bass": {
    "4 String": {
      name : "4 String",
      value : 4,
    },
  },
} as const);

export const electricBodyTypes = Object.freeze({
  "solid": {
    name : "Solid",
  },
  "chambered": {
    name : "Chambered",
    price : 400000,
  },
  "semi-hollow": {
    name : "Semi Hollow",
    price : 400000
  },
  "hollow": {
    name : "Hollow",
    price : 500000,
  },
} as const);

export const bodyTopWoods = Object.freeze({
  "laminated-rosewood": {
    name : "Laminated Rosewood",
    price : 250000,
  },
  "laminated-plain-maple": {
    name : "Laminated Plain Maple",
    price : 250000,
  },
  "laminated-walnut": {
    name : "laminated Walnut",
    price : 250000,
  },
  "laminated-flamed-maple": {
    name : "Laminated Flamed Maple",
    price : 250000,
  },
  "laminated-quilted-maple": {
    name : "Laminated Quilted Maple",
    price : 300000,
  },
  "laminated-amboyna-burl" : {
    name : "Laminated Spalted / Burl",
    price : 300000,
  },
  "solid-mahogany" : {
    name : "Solid Mahogany",
    price : 400000,
  },
  "solid-white-ash" : {
    name : "Solid White Ash",
    price : 650000,
  },
  "solid-swamp-ash" : {
    name : "Solid Swamp Ash",
    price : 800000,
  },
  "solid-alder" : {
    name : "Solid Alder",
    price : 600000,
  },
  "solid-hard-maple" : {
    name : "Solid Hard Maple",
    price : 600000,
  },
  "solid-walnut" : {
    name : "Solid Walnut",
    price : 600000,
  },
  "solid-rosewood" : {
    name : "Solid Rosewood",
    price : 750000,
  },
  "solid-flamed-mango" : {
    name : "Solid Flamed Mango",
    price : 750000,
  },
  "solid-spalted-tamarind" : {
    name : "Solid Spalted Tamarind",
    price : 850000,
  },
  "solid-amboyna-burl" : {
    name : "Solid Amboyna Burl",
    price : 1500000,
  },
  "solid-flamed-maple" : {
    name : "Solid Flamed Maple",
    price : 3500000,
  },
  "solid-quilted-maple" : {
    name : "Solid Quilted Maple",
    price : 3750000,
  },
  "solid-spalted-maple" : {
    name : "Solid Spalted Maple",
    price : 3750000,
  },
  "solid-korina-white" : {
    name : "Solid Korina White",
    price : 3750000,
  },
  "solid-korina-black" : {
    name : "Solid Korina Black",
    price : 3750000,
  },
} as const);

export const trussRodPositions = Object.freeze({
  electric : {
    "headstock": {
      name : "Headstock",
    },
    "heel": {
      name : "Heel",
    },
    "spoke-wheel": {
      name : "Spoke Wheel",
      price : 100000,
    },
  },
  acoustic : {
    "headstock": {
      name : "Headstock",
    },
    "heel": {
      name : "Heel",
    },
  },
} as const);

export const bodyCoreWoods = Object.freeze({
  "mahogany": {
    name : "Mahogany",
    price : 800000,
  },
  "1-piece-mahogany": {
    name : "1 Piece Mahogany",
    price : 950000,
  },
  "hard-maple": {
    name : "Hard Maple",
    price : 1000000,
  },
  "walnut": {
    name : "Walnut",
    price : 1000000,
  },
  "alder": {
    name : "Alder",
    price : 1000000,
  },
  "white-ash": {
    name : "White Ash",
    price : 1000000,
  },
  "swamp-ash": {
    name : "Swamp Ash",
    price : 1200000,
  },
  "rosewood": {
    name : "Rosewood",
    price : 1200000,
  },
  "korina-white": {
    name : "Korina White",
    price : 1200000,
  },
  "korina-black": {
    name : "Korina Black",
    price : 1200000,
  },
} as const);

export const bodyColorType = Object.freeze({
  "natural" : {
    name : "Natural",
    price : 150000,
  },
  "solid": {
    name : "Solid",
    price : 150000,
  },
  "transparent" : {
    name : "Transparent",
    price : 150000,
  },
  "metallic": {
    name : "Metallic",
    price : 350000,
  },
  // "sparkle": {
  //   name : "Sparkle",
  // },
  // "stripes": {
  //   name : "Stripes",
  // },
  // "swirl": {
  //   name : "Swirl",
  // },
  // "custom": {
  //   name : "Custom",
  // },
} as const);

export const neckColorType = Object.freeze({
  "natural" : {
    name : "Natural",
    price : 150000,
  },
  "solid": {
    name : "Solid",
    price : 150000,
  },
  "transparent" : {
    name : "Transparent",
    price : 150000,
  },
  "metallic": {
    name : "Metallic",
    price : 350000,
  },
} as const);

export const headstockColorType = Object.freeze({
  "natural" : {
    name : "Natural",
    price : 150000,
  },
  "solid": {
    name : "Solid",
    price : 150000,
  },
  "transparent" : {
    name : "Transparent",
    price : 150000,
  },
  "metallic": {
    name : "Metallic",
    price : 350000,
  },
} as const);

export const bodyColorTypeToColorsMap = Object.freeze({
  "solid" : solidColors,
  "transparent" : solidColors,
  "metallic" : metallicColors
})

export const neckColorTypeToColorsMap = Object.freeze({
  "solid" : solidColors,
  "transparent" : solidColors,
  "metallic" : metallicColors
})

export const headstockColorTypeToColorsMap = Object.freeze({
  "solid" : solidColors,
  "transparent" : solidColors,
  "metallic" : metallicColors
})

export const bindings = Object.freeze({
  "1-ply-pvc": {
    name : "1 Ply PVC",
    price : 75000,
  },
  "3-ply-pvc": {
    name : "3 Ply PVC",
    price : 125000,
  },
    "5-ply-pvc": {
    name : "5 Ply PVC",
    price : 175000,
  },
  "pearloid": {
    name : "Pearloid",
    price : 150000,
  },
  "synthetic-abalone": {
    name : "Synthetic Abalone",
    price : 150000,
  },
  "wood-purfling": {
    name : "Wood Purfling",
    price : 175000,
  },
  "herringbone-purfling": {
    name : "Herringbone Purfling",
    price : 200000,
  },
  "mother-of-pearl": {
    name : "Mother of Pearl",
    price : 500000,
  },
  "abalone": {
    name : "Abalone",
    price : 500000,
  },
} as const);

export const headstockOverlay = Object.freeze({
  "pvc": {
    name : "PVC",
    price : 50000
  },
  "pvc-black": {
    name : "PVC Black",
    price : 50000
  },
  "rosewood": {
    name : "Rosewood",
    price : 75000,
  },
  "plain-maple": {
    name : "Plain Maple",
    price : 75000,
  },
  // "custom": {
  //   name : "Custom",
  // },
} as const);

export const bodyLogo = Object.freeze({
  "stranough": {
    name : "Stranough",
  },
  "small-decal-logo": {
    name : "Small Decal Logo",
    price : 100000
  },
  "large-decal-logo": {
    name : "Large Decal Logo",
    price : 150000
  },
  "small-engrave-logo": {
    name : "Small Engrave Logo",
    price : 150000
  },
  "large-engrave-logo": {
    name : "Large Engrave Logo",
    price : 150000
  },
  // "custom": {
  //   name : "Custom",
  // },
} as const);

export const headstockLogo = Object.freeze({
  "stranough": {
    name : "Stranough",
  },
  "decal-logo": {
    name : "Decal Logo",
    price : 100000
  },
  "laser-engrave-logo": {
    name : "Laser Engrave Logo",
    price : 125000
  },
  "pearloid": {
    name : "Pearloid",
    price : 200000
  },
  "mother-of-pearl": {
    name : "Mother of Pearl",
    price : 600000
  },
  "abalone": {
    name : "Abalone",
    price : 600000
  },
  // "custom": {
  //   name : "Custom",
  // },
} as const);

export const neckWoods = Object.freeze({
  "mahogany": {
    name : "Mahogany",
    price : 850000,
  },
  "plain-maple": {
    name : "Plain Maple",
    price : 950000,
  },
  "walnut": {
    name : "Walnut",
    price : 1100000,
  },
  "rosewood": {
    name : "Rosewood",
    price : 1200000,
  },
  "quartersawn-maple": {
    name : "Quartersawn Maple",
    price : 1200000,
  },
  "roasted-maple": {
    name : "Roasted Maple",
    price : 1350000,
  },
  "ebony": {
    name : "Ebony",
    price : 2000000,
  },
  "flamed-maple": {
    name : "Flamed Maple",
    price : 2450000,
  },
  "bird-eyes-maple": {
    name : "Bird Eyes Maple",
    price : 2450000,
  },
  "quilted-maple": {
    name : "Quilted Maple",
    price : 2450000,
  },
} as const);

export const fretCount = Object.freeze({
  "19": {
    name : "19",
    value : 19,
  },
  "20": {
    name : "20",
    value : 20,
  },
  "21": {
    name : "21",
    value : 21,
  },
  "22": {
    name : "22",
    value : 22,
  },
  "24": {
    name : "24",
    value : 24,
  },
  "26": {
    name : "26",
    value : 26,
    price : 50000,
  },
  "27": {
    name : "27",
    value : 27,
    price : 50000,
  },
} as const);

export const fingerboardWoods = Object.freeze({
  "rosewood": {
    name : "Rosewood",
    price : 100000,
  },
  "plain-maple": {
    name : "Maple",
    price : 300000,
  },
  "roasted-maple" : {
    name : "Roasted Maple",
    price : 450000,
  },
  "ebony": {
    name : "Ebony",
    price : 300000,
  },
  "pau-ferro": {
    name : "Pau Ferro",
    price : 600000,
  },
  "flamed-maple": {
    name : "Flamed Maple",
    price : 875000,
  },
  "bird-eyes-maple": {
    name : "Bird Eyes Maple",
    price : 875000,
  },
  "quilted-maple": {
    name : "Quilted Maple",
    price : 875000,
  },
} as const);

export const fingerboardRadius = Object.freeze({
  "0": {
    name : "Flat",
    value : 0,
  },
  "7.25": {
    name : "7.25",
    value : 7.25,
  },
  "9.5": {
    name : "9.5",
    value : 9.5,
  },
  "12": {
    name : "12",
    value : 12,
  },
  "14": {
    name : "14",
    value : 14,
  },
  "16": {
    name : "16",
    value : 16,
  },
  "20": {
    name : "20",
    value : 20,
  },
  "compound": {
    name : "Compound",
    price : 125000,
  },
} as const);

export const fingerboardEdge = Object.freeze({
  "square": {
    name : "Standard Square",
  },
  "semi": {
    name : "Semi Rolled",
    price : 75000,
  },
  "heavy": {
    name : "Heavy Rolled",
    price : 125000,
  },
} as const);

export const sideInlay = Object.freeze({
  "standard": {
    name : "Standard",
  },
  "glow-in-the-dark": {
    name : "Glow in the Dark",
    price : 85000,
  },
} as const);
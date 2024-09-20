import { burstColors } from "./colors";
import { backContourKeys, constructionKeys, topContourKeys } from "./electric-model";
import { pickupConfigurations } from "./pickup";
export type KeyOf<T> = T extends Record<infer K, any> ? K : never;
export type ValueOf<T> = T extends Record<infer K, {
    value?: infer V;
}> ? V : never;
export declare function asArray<T extends object>(obj: T): {
    key: T extends Record<infer K, any> ? K : never;
    name: T extends Record<any, {
        name: infer N;
    }> ? N : never;
    price: T extends Record<any, {
        price: infer P;
    }> ? P : undefined;
}[];
export declare function getValue<T extends object>(obj: T, key?: keyof T): ValueOf<T> | undefined;
export declare const binaryOptions: Readonly<{
    readonly yes: {
        readonly name: "Yes";
        readonly value: true;
    };
    readonly no: {
        readonly name: "No";
        readonly value: false;
    };
}>;
export declare function getGuitarCategory(type: KeyOf<typeof guitarTypes>): "electric" | "acoustic";
export interface SelectedItem {
    guitarType: KeyOf<typeof guitarTypes>;
    orientation: KeyOf<typeof orientation>;
    assembleGuitar: boolean;
    acoustic: {
        guitarModel: number;
        stringCount: KeyOf<typeof stringCounts['acoustic-guitar' | 'acoustic-bass']>;
        scaleLength: KeyOf<typeof scaleLengths['acoustic-guitar' | 'acoustic-bass']>;
        topBinding: KeyOf<typeof bindings>;
        backBinding: KeyOf<typeof bindings>;
        topBodyColorType: KeyOf<typeof bodyColorType>;
        topBodyColor: KeyOf<typeof bodyColorTypeToColorsMap[KeyOf<Omit<typeof bodyColorType, 'natural'>>]>;
        backBodyColorType: KeyOf<typeof bodyColorType>;
        backBodyColor: KeyOf<typeof bodyColorTypeToColorsMap[KeyOf<Omit<typeof bodyColorType, 'natural'>>]>;
        burstType: KeyOf<typeof burstTypes>;
        burstColor: KeyOf<typeof burstColors>;
        neckWood: KeyOf<typeof neckWoods>;
        neckProfile: KeyOf<typeof neckProfiles>;
        trussRodType: KeyOf<typeof TrussRodType>;
        trussRodPosition: KeyOf<typeof trussRodPositions['acoustic']>;
        carbonFiberRod: boolean;
        neckBinding: KeyOf<typeof bindings>;
        neckColorType: KeyOf<typeof neckColorType>;
        neckColor: KeyOf<typeof neckColorTypeToColorsMap[KeyOf<Omit<typeof neckColorType, 'natural'>>]>;
        fingerboardWood: KeyOf<typeof fingerboardWoods>;
        sideInlay: KeyOf<typeof sideInlay>;
        fingerboardRadius: KeyOf<typeof fingerboardRadius>;
        useFret: boolean;
        fretCount: KeyOf<typeof fretCount>;
        fingerboardEdge: KeyOf<typeof fingerboardEdge>;
        headstock: number;
        headstockOverlay: KeyOf<typeof headstockOverlay>;
        headstockBinding: KeyOf<typeof bindings>;
        nut: number;
        peg: number;
        pickguardMaterial: KeyOf<typeof pickguardMaterials>;
    };
    electric: {
        guitarModel: number;
        stringCount: KeyOf<typeof stringCounts['electric-guitar' | 'electric-bass']>;
        constructionMethod: typeof constructionKeys[number];
        scaleLength: KeyOf<typeof scaleLengths['electric-guitar' | 'electric-bass']>;
        bodyType: KeyOf<typeof electricBodyTypes>;
        topContour: typeof topContourKeys[number];
        backContour: typeof backContourKeys[number];
        bodyCoreWood: KeyOf<typeof bodyCoreWoods>;
        bodyTopWood: KeyOf<typeof bodyTopWoods>;
        topBinding: KeyOf<typeof bindings>;
        backBinding: KeyOf<typeof bindings>;
        bodyLogo: KeyOf<typeof bodyLogo>;
        topBodyColorType: KeyOf<typeof bodyColorType>;
        topBodyColor: KeyOf<typeof bodyColorTypeToColorsMap[KeyOf<Omit<typeof bodyColorType, 'natural'>>]>;
        backBodyColorType: KeyOf<typeof bodyColorType>;
        backBodyColor: KeyOf<typeof bodyColorTypeToColorsMap[KeyOf<Omit<typeof bodyColorType, 'natural'>>]>;
        burstType: KeyOf<typeof burstTypes>;
        burstColor: KeyOf<typeof burstColors>;
        neckWood: KeyOf<typeof neckWoods>;
        neckProfile: KeyOf<typeof neckProfiles>;
        trussRodType: KeyOf<typeof TrussRodType>;
        trussRodPosition: KeyOf<typeof trussRodPositions['electric']>;
        neckBinding: KeyOf<typeof bindings>;
        carbonFiberRod: boolean;
        neckColorType: KeyOf<typeof neckColorType>;
        neckColor: KeyOf<typeof neckColorTypeToColorsMap[KeyOf<Omit<typeof neckColorType, 'natural'>>]>;
        fingerboardWood: KeyOf<typeof fingerboardWoods>;
        inlay: KeyOf<typeof inlayTypes>;
        sideInlay: KeyOf<typeof sideInlay>;
        fingerboardRadius: KeyOf<typeof fingerboardRadius>;
        useFret: boolean;
        fretCount: KeyOf<typeof fretCount>;
        fingerboardEdge: KeyOf<typeof fingerboardEdge>;
        headstock: number;
        headstockOverlay: KeyOf<typeof headstockOverlay>;
        headstockLogo: KeyOf<typeof headstockLogo>;
        headstockBinding: KeyOf<typeof bindings>;
        headstockColorType: KeyOf<typeof headstockColorType>;
        headstockColor: KeyOf<typeof headstockColorTypeToColorsMap[KeyOf<Omit<typeof headstockColorType, 'natural'>>]>;
        peg: number;
        nut: number;
        bridge: number;
        bridge2?: number;
        pickguard: number;
        pickguardMaterial: KeyOf<typeof pickguardMaterials>;
        knob: number;
        jack: KeyOf<typeof jackTypes>;
        pickupConfiguration: keyof typeof pickupConfigurations['electric-guitar'];
        bridgePickup: number;
        neckPickup: number;
        middlePickup: number;
    };
}
export declare const selectedItemLabels: {
    [k in SelectedItemKeys]: string;
};
export declare const electricItemLabels: {
    [k in keyof SelectedItem['electric']]: string;
};
export declare const mustImplementLabel: readonly ["bridge", "bridgePickup", "guitarModel", "headstock", "knob", "middlePickup", "neckPickup", "nut", "peg", "bridge2", "pickguard"];
export declare const selectedElectricItemNames: {
    [k in keyof Omit<SelectedItem['electric'], typeof mustImplementLabel[number]>]: (key?: SelectedItem['electric'][k]) => string | undefined;
};
export declare const jackTypes: Readonly<{
    readonly top: {
        readonly name: "Top";
        readonly price: 30000;
    };
    readonly "top-plated": {
        readonly name: "Top Plated";
        readonly price: 50000;
    };
    readonly side: {
        readonly name: "Side";
        readonly price: 50000;
    };
}>;
export declare const inlayTypes: Readonly<{
    readonly "pvc-dot": {
        readonly name: "PVC Dot";
    };
    readonly "pearloid-dot": {
        readonly name: "Pearloid Dot";
    };
    readonly "mother-of-pearl-dot": {
        readonly name: "Mother of Pearl Dot";
        readonly price: 50000;
    };
    readonly "abalone-dot": {
        readonly name: "Abalone Dot";
        readonly price: 50000;
    };
    readonly "glow-in-the-dark-dot": {
        readonly name: "Glow in the Dark Dot";
        readonly price: 100000;
    };
    readonly "pearloid-block": {
        readonly name: "Pearloid Block";
        readonly price: 200000;
    };
}>;
export declare const nullableSelectedItem: {
    common: {
        [k in keyof SelectedItem['electric' | 'acoustic']]?: boolean;
    };
    electric: {
        [k in keyof SelectedItem['electric']]?: boolean;
    };
    acoustic: {
        [k in keyof SelectedItem['acoustic']]?: boolean;
    };
};
export type SelectedItemWithoutObj = Omit<SelectedItem, 'electric' | 'acoustic'>;
export type SelectedItemKeys = keyof SelectedItemWithoutObj | keyof SelectedItem['electric'] | keyof SelectedItem['acoustic'];
export declare const pickguardMaterials: Readonly<{
    readonly "1-ply-black-pvc": {
        readonly name: "1 Ply Black PVC";
        readonly price: {
            readonly small: 115000;
            readonly medium: 165000;
            readonly large: 205000;
        };
    };
    readonly "1-ply-white-pvc": {
        readonly name: "1 Ply White PVC";
        readonly price: {
            readonly small: 115000;
            readonly medium: 165000;
            readonly large: 205000;
        };
    };
    readonly "1-ply-ivory-pvc": {
        readonly name: "1 Ply Ivory PVC";
        readonly price: {
            readonly small: 115000;
            readonly medium: 165000;
            readonly large: 205000;
        };
    };
    readonly "3-ply-black-pvc": {
        readonly name: "3 Ply Black PVC";
        readonly price: {
            readonly small: 125000;
            readonly medium: 205000;
            readonly large: 255000;
        };
    };
    readonly "3-ply-white-pvc": {
        readonly name: "3 Ply White PVC";
        readonly price: {
            readonly small: 125000;
            readonly medium: 205000;
            readonly large: 255000;
        };
    };
    readonly "1-ply-red-pvc": {
        readonly name: "1 Ply Red PVC";
        readonly price: {
            readonly small: 115000;
            readonly medium: 165000;
            readonly large: 205000;
        };
    };
    readonly "1-ply-blue-pvc": {
        readonly name: "1 Ply Blue PVC";
        readonly price: {
            readonly small: 115000;
            readonly medium: 165000;
            readonly large: 205000;
        };
    };
    readonly "1-ply-transparent-acrylic": {
        readonly name: "1 Ply Transparent Acrylic";
        readonly price: {
            readonly small: 115000;
            readonly medium: 165000;
            readonly large: 205000;
        };
    };
    readonly "3-ply-white-pearloid": {
        readonly name: "3 Ply White Pearloid";
        readonly price: {
            readonly small: 150000;
            readonly medium: 230000;
            readonly large: 280000;
        };
    };
    readonly "3-ply-tortoise": {
        readonly name: "3 Ply Tortoise Celluloid";
        readonly price: {
            readonly small: 150000;
            readonly medium: 230000;
            readonly large: 280000;
        };
    };
    readonly "3-ply-red-pearloid": {
        readonly name: "3 Ply Red Pearloid";
        readonly price: {
            readonly small: 150000;
            readonly medium: 230000;
            readonly large: 280000;
        };
    };
    readonly "3-ply-ivory-pearloid": {
        readonly name: "3 Ply Ivory Pearloid";
        readonly price: {
            readonly small: 150000;
            readonly medium: 230000;
            readonly large: 280000;
        };
    };
    readonly "3-ply-black-pearloid": {
        readonly name: "3 Ply Black Pearloid";
        readonly price: {
            readonly small: 150000;
            readonly medium: 230000;
            readonly large: 280000;
        };
    };
    readonly "3-ply-blue-pearloid": {
        readonly name: "3 Ply Blue Pearloid";
        readonly price: {
            readonly small: 150000;
            readonly medium: 230000;
            readonly large: 280000;
        };
    };
    readonly "3-ply-green-pearloid": {
        readonly name: "3 Ply Green Pearloid";
        readonly price: {
            readonly small: 150000;
            readonly medium: 230000;
            readonly large: 280000;
        };
    };
    readonly "2-ply-chrome-mirror": {
        readonly name: "2 Ply Chrome Mirror";
        readonly price: {
            readonly small: 150000;
            readonly medium: 230000;
            readonly large: 280000;
        };
    };
    readonly "2-ply-red-mirror": {
        readonly name: "2 Ply Red Mirror";
        readonly price: {
            readonly small: 150000;
            readonly medium: 230000;
            readonly large: 280000;
        };
    };
    readonly "2-ply-blue-mirror": {
        readonly name: "2 Ply Blue Mirror";
        readonly price: {
            readonly small: 150000;
            readonly medium: 230000;
            readonly large: 280000;
        };
    };
    readonly "rosewood-veneer": {
        readonly name: "Rosewood Veneer";
        readonly price: {
            readonly small: 190000;
            readonly medium: 255000;
            readonly large: 305000;
        };
    };
    readonly "quilted-maple-veneer": {
        readonly name: "Quilted Maple Veneer";
        readonly price: {
            readonly small: 190000;
            readonly medium: 255000;
            readonly large: 305000;
        };
    };
    readonly "flamed-maple-veneer": {
        readonly name: "Flamed Maple Veneer";
        readonly price: {
            readonly small: 215000;
            readonly medium: 305000;
            readonly large: 355000;
        };
    };
    readonly "diamond-plate-1-plate": {
        readonly name: "Diamond Plate 1 Plate";
        readonly price: {
            readonly small: 265000;
            readonly medium: 355000;
            readonly large: 405000;
        };
    };
    readonly "diamond-plate-2-plate": {
        readonly name: "Diamond Plate 2 Plate";
        readonly price: {
            readonly small: 265000;
            readonly medium: 355000;
            readonly large: 405000;
        };
    };
    readonly "diamond-style-artificial": {
        readonly name: "Diamond Style Artificial";
        readonly price: {
            readonly small: 190000;
            readonly medium: 255000;
            readonly large: 305000;
        };
    };
    readonly "2-ply-gold-mirror": {
        readonly name: "2 Ply Gold Mirror";
        readonly price: {
            readonly small: 185000;
            readonly medium: 265000;
            readonly large: 315000;
        };
    };
}>;
export declare const orientation: Readonly<{
    readonly "right-handed": {
        readonly name: "Right Handed";
    };
    readonly "left-handed": {
        readonly name: "Left Handed";
        readonly price: 250000;
    };
}>;
export declare const burstTypes: Readonly<{
    readonly top: {
        readonly name: "Top";
        readonly price: 200000;
    };
    readonly "top-back": {
        readonly name: "Top & Back";
        readonly price: 250000;
    };
}>;
export declare const neckProfiles: Readonly<{
    readonly c: {
        readonly name: "C";
    };
    readonly d: {
        readonly name: "D";
    };
    readonly v: {
        readonly name: "V";
    };
    readonly u: {
        readonly name: "U";
    };
    readonly asymmetric: {
        readonly name: "Asymmetric";
        readonly price: 200000;
    };
}>;
export declare const guitarTypes: Readonly<{
    readonly "electric-guitar": {
        readonly name: "Gitar Listrik";
    };
    readonly "electric-bass": {
        readonly name: "Bass Listrik";
    };
    readonly "acoustic-guitar": {
        readonly name: "Gitar Akustik";
    };
    readonly "acoustic-bass": {
        readonly name: "Bass Akustik";
    };
}>;
export declare const TrussRodType: Readonly<{
    readonly "single-action": {
        readonly name: "Single Action";
        readonly price: 45000;
    };
    readonly "double-action": {
        readonly name: "Double Action";
        readonly price: 75000;
    };
}>;
export declare const scaleLengths: Readonly<{
    readonly "electric-guitar": {
        readonly "24": {
            readonly name: "24";
            readonly value: 24;
        };
        readonly "24.75": {
            readonly name: "24.75";
            readonly value: 24.75;
        };
        readonly "25": {
            readonly name: "25";
            readonly value: 25;
        };
        readonly "25.5": {
            readonly name: "25.5";
            readonly value: 25.5;
        };
        readonly "Baritone (27\"-30\")": {
            readonly name: "Baritone (27\"-30\")";
            readonly value: 27;
            readonly price: 150000;
        };
        readonly "multi-Scale": {
            readonly name: "Multi-Scale";
            readonly value: "multi-scale";
            readonly price: 250000;
        };
    };
    readonly "electric-bass": {
        readonly "30": {
            readonly name: "30";
            readonly value: 30;
        };
        readonly "32": {
            readonly name: "32";
            readonly value: 32;
        };
        readonly "34": {
            readonly name: "34";
            readonly value: 34;
        };
        readonly "35": {
            readonly name: "35";
            readonly value: 35;
        };
        readonly "38": {
            readonly name: "38";
            readonly value: 38;
        };
        readonly "multi-Scale": {
            readonly name: "Multi-Scale";
            readonly value: "multi-scale";
        };
    };
    readonly "acoustic-guitar": {
        readonly "Classical 650mm": {
            readonly name: "Classical 650mm";
            readonly value: 25.6;
        };
        readonly "Classical 660mm": {
            readonly name: "Classical 660mm";
            readonly value: 25.98;
        };
        readonly "23": {
            readonly name: "23";
            readonly value: 23;
        };
        readonly "24": {
            readonly name: "24";
            readonly value: 24;
        };
        readonly "24,75": {
            readonly name: "24.75";
            readonly value: 24.75;
        };
        readonly "24,9": {
            readonly name: "24.9";
            readonly value: 24.9;
        };
        readonly "25": {
            readonly name: "25";
            readonly value: 25;
        };
        readonly "25,4": {
            readonly name: "25.4";
            readonly value: 25.4;
        };
        readonly "25,5": {
            readonly name: "25.5";
            readonly value: 25.5;
        };
        readonly "25,625": {
            readonly name: "25.625";
            readonly value: 25.625;
        };
    };
    readonly "acoustic-bass": {
        readonly "30": {
            readonly name: "30";
            readonly value: 30;
        };
        readonly "32": {
            readonly name: "32";
            readonly value: 32;
        };
        readonly "34": {
            readonly name: "34";
            readonly value: 34;
        };
        readonly "35": {
            readonly name: "35";
            readonly value: 35;
        };
        readonly "38": {
            readonly name: "38";
            readonly value: 38;
        };
    };
}>;
export declare const stringCounts: Readonly<{
    readonly "electric-guitar": {
        readonly "6 String": {
            readonly name: "6 String";
            readonly value: 6;
        };
        readonly "7 String": {
            readonly name: "7 String";
            readonly value: 7;
            readonly price: 250000;
        };
        readonly "8 String": {
            readonly name: "8 String";
            readonly value: 8;
            readonly price: 500000;
        };
    };
    readonly "acoustic-guitar": {
        readonly "6 String": {
            readonly name: "6 String";
            readonly value: 6;
        };
        readonly "12 String": {
            readonly name: "12 String";
            readonly value: 12;
        };
    };
    readonly "electric-bass": {
        readonly "4 String": {
            readonly name: "4 String";
            readonly value: 4;
        };
        readonly "5 String": {
            readonly name: "5 String";
            readonly value: 5;
        };
        readonly "6 String": {
            readonly name: "6 String";
            readonly value: 6;
        };
    };
    readonly "acoustic-bass": {
        readonly "4 String": {
            readonly name: "4 String";
            readonly value: 4;
        };
    };
}>;
export declare const electricBodyTypes: Readonly<{
    readonly solid: {
        readonly name: "Solid";
    };
    readonly chambered: {
        readonly name: "Chambered";
        readonly price: 400000;
    };
    readonly "semi-hollow": {
        readonly name: "Semi Hollow";
        readonly price: 400000;
    };
    readonly hollow: {
        readonly name: "Hollow";
        readonly price: 500000;
    };
}>;
export declare const bodyTopWoods: Readonly<{
    readonly "laminated-rosewood": {
        readonly name: "Laminated Rosewood";
        readonly price: 250000;
    };
    readonly "laminated-plain-maple": {
        readonly name: "Laminated Plain Maple";
        readonly price: 250000;
    };
    readonly "laminated-walnut": {
        readonly name: "laminated Walnut";
        readonly price: 250000;
    };
    readonly "laminated-flamed-maple": {
        readonly name: "Laminated Flamed Maple";
        readonly price: 250000;
    };
    readonly "laminated-quilted-maple": {
        readonly name: "Laminated Quilted Maple";
        readonly price: 300000;
    };
    readonly "laminated-amboyna-burl": {
        readonly name: "Laminated Spalted / Burl";
        readonly price: 300000;
    };
    readonly "solid-mahogany": {
        readonly name: "Solid Mahogany";
        readonly price: 400000;
    };
    readonly "solid-white-ash": {
        readonly name: "Solid White Ash";
        readonly price: 650000;
    };
    readonly "solid-swamp-ash": {
        readonly name: "Solid Swamp Ash";
        readonly price: 800000;
    };
    readonly "solid-alder": {
        readonly name: "Solid Alder";
        readonly price: 600000;
    };
    readonly "solid-hard-maple": {
        readonly name: "Solid Hard Maple";
        readonly price: 600000;
    };
    readonly "solid-walnut": {
        readonly name: "Solid Walnut";
        readonly price: 600000;
    };
    readonly "solid-rosewood": {
        readonly name: "Solid Rosewood";
        readonly price: 750000;
    };
    readonly "solid-flamed-mango": {
        readonly name: "Solid Flamed Mango";
        readonly price: 750000;
    };
    readonly "solid-spalted-tamarind": {
        readonly name: "Solid Spalted Tamarind";
        readonly price: 850000;
    };
    readonly "solid-amboyna-burl": {
        readonly name: "Solid Amboyna Burl";
        readonly price: 1500000;
    };
    readonly "solid-flamed-maple": {
        readonly name: "Solid Flamed Maple";
        readonly price: 3500000;
    };
    readonly "solid-quilted-maple": {
        readonly name: "Solid Quilted Maple";
        readonly price: 3750000;
    };
    readonly "solid-spalted-maple": {
        readonly name: "Solid Spalted Maple";
        readonly price: 3750000;
    };
    readonly "solid-korina-white": {
        readonly name: "Solid Korina White";
        readonly price: 3750000;
    };
    readonly "solid-korina-black": {
        readonly name: "Solid Korina Black";
        readonly price: 3750000;
    };
}>;
export declare const trussRodPositions: Readonly<{
    readonly electric: {
        readonly headstock: {
            readonly name: "Headstock";
        };
        readonly heel: {
            readonly name: "Heel";
        };
        readonly "spoke-wheel": {
            readonly name: "Spoke Wheel";
            readonly price: 100000;
        };
    };
    readonly acoustic: {
        readonly headstock: {
            readonly name: "Headstock";
        };
        readonly heel: {
            readonly name: "Heel";
        };
    };
}>;
export declare const bodyCoreWoods: Readonly<{
    readonly mahogany: {
        readonly name: "Mahogany";
        readonly price: 800000;
    };
    readonly "1-piece-mahogany": {
        readonly name: "1 Piece Mahogany";
        readonly price: 950000;
    };
    readonly "hard-maple": {
        readonly name: "Hard Maple";
        readonly price: 1000000;
    };
    readonly walnut: {
        readonly name: "Walnut";
        readonly price: 1000000;
    };
    readonly alder: {
        readonly name: "Alder";
        readonly price: 1000000;
    };
    readonly "white-ash": {
        readonly name: "White Ash";
        readonly price: 1000000;
    };
    readonly "swamp-ash": {
        readonly name: "Swamp Ash";
        readonly price: 1200000;
    };
    readonly rosewood: {
        readonly name: "Rosewood";
        readonly price: 1200000;
    };
    readonly "korina-white": {
        readonly name: "Korina White";
        readonly price: 1200000;
    };
    readonly "korina-black": {
        readonly name: "Korina Black";
        readonly price: 1200000;
    };
}>;
export declare const bodyColorType: Readonly<{
    readonly natural: {
        readonly name: "Natural";
        readonly price: 150000;
    };
    readonly solid: {
        readonly name: "Solid";
        readonly price: 150000;
    };
    readonly transparent: {
        readonly name: "Transparent";
        readonly price: 150000;
    };
    readonly metallic: {
        readonly name: "Metallic";
        readonly price: 350000;
    };
}>;
export declare const neckColorType: Readonly<{
    readonly natural: {
        readonly name: "Natural";
        readonly price: 150000;
    };
    readonly solid: {
        readonly name: "Solid";
        readonly price: 150000;
    };
    readonly transparent: {
        readonly name: "Transparent";
        readonly price: 150000;
    };
    readonly metallic: {
        readonly name: "Metallic";
        readonly price: 350000;
    };
}>;
export declare const headstockColorType: Readonly<{
    readonly natural: {
        readonly name: "Natural";
        readonly price: 150000;
    };
    readonly solid: {
        readonly name: "Solid";
        readonly price: 150000;
    };
    readonly transparent: {
        readonly name: "Transparent";
        readonly price: 150000;
    };
    readonly metallic: {
        readonly name: "Metallic";
        readonly price: 350000;
    };
}>;
export declare const bodyColorTypeToColorsMap: Readonly<{
    solid: Readonly<{
        readonly RAL9010: {
            readonly name: "putih - RAL9010";
            readonly value: 15854817;
        };
        readonly RAL9002: {
            readonly name: "putih - RAL9002";
            readonly value: 14144971;
        };
        readonly RAL1013: {
            readonly name: "putih - RAL1013";
            readonly value: 14932422;
        };
        readonly RAL9001: {
            readonly name: "kuning - RAL9001";
            readonly value: 15327442;
        };
        readonly RAL5004: {
            readonly name: "hitam - RAL5004";
            readonly value: 1646120;
        };
        readonly RAL7022: {
            readonly name: "abu-abu - RAL7022";
            readonly value: 4999748;
        };
        readonly RAL7005: {
            readonly name: "abu-abu - RAL7005";
            readonly value: 6581091;
        };
        readonly RAL7023: {
            readonly name: "abu-abu - RAL7023";
            readonly value: 6843486;
        };
        readonly RAL7035: {
            readonly name: "abu-abu - RAL7035";
            readonly value: 14145495;
        };
        readonly RAL7004: {
            readonly name: "abu-abu - RAL7004";
            readonly value: 9869714;
        };
        readonly RAL5001: {
            readonly name: "hijau - RAL5001";
            readonly value: 2044984;
        };
        readonly RAL5025: {
            readonly name: "biru - RAL5025";
            readonly value: 2189692;
        };
        readonly RAL5007: {
            readonly name: "biru - RAL5007";
            readonly value: 4087690;
        };
        readonly RAL5013: {
            readonly name: "biru - RAL5013";
            readonly value: 1974589;
        };
        readonly RAL5014: {
            readonly name: "biru - RAL5014";
            readonly value: 6319756;
        };
        readonly RAL5015: {
            readonly name: "biru - RAL5015";
            readonly value: 2257331;
        };
        readonly RAL5017: {
            readonly name: "biru - RAL5017";
            readonly value: 407921;
        };
        readonly RAL5020: {
            readonly name: "biru - RAL5020";
            readonly value: 1913674;
        };
        readonly RAL5022: {
            readonly name: "biru - RAL5022";
            readonly value: 2435152;
        };
        readonly RAL5024: {
            readonly name: "biru - RAL5024";
            readonly value: 6134683;
        };
        readonly RAL6034: {
            readonly name: "hijau - RAL6034";
            readonly value: 8369589;
        };
        readonly RAL7000: {
            readonly name: "abu-abu - RAL7000";
            readonly value: 7898507;
        };
        readonly RAL6000: {
            readonly name: "hijau - RAL6000";
            readonly value: 3237456;
        };
        readonly RAL6001: {
            readonly name: "hijau - RAL6001";
            readonly value: 2650675;
        };
        readonly RAL6003: {
            readonly name: "hijau - RAL6003";
            readonly value: 4343346;
        };
        readonly RAL6004: {
            readonly name: "hijau - RAL6004";
            readonly value: 2046525;
        };
        readonly RAL6011: {
            readonly name: "hijau - RAL6011";
            readonly value: 5796422;
        };
        readonly RAL6012: {
            readonly name: "hijau - RAL6012";
            readonly value: 3423808;
        };
        readonly RAL6018: {
            readonly name: "hijau - RAL6018";
            readonly value: 5744185;
        };
        readonly RAL6019: {
            readonly name: "hijau - RAL6019";
            readonly value: 12446902;
        };
        readonly RAL7002: {
            readonly name: "abu-abu - RAL7002";
            readonly value: 8289106;
        };
        readonly RAL7033: {
            readonly name: "abu-abu - RAL7033";
            readonly value: 8225905;
        };
        readonly RAL3012: {
            readonly name: "merah - RAL3012";
            readonly value: 12683115;
        };
        readonly RAL3014: {
            readonly name: "merah - RAL3014";
            readonly value: 13856368;
        };
        readonly RAL3015: {
            readonly name: "merah - RAL3015";
            readonly value: 15370650;
        };
        readonly RAL4003: {
            readonly name: "merah - RAL4003";
            readonly value: 14568586;
        };
        readonly RAL4009: {
            readonly name: "merah - RAL4009";
            readonly value: 10585492;
        };
        readonly RAL4008: {
            readonly name: "merah - RAL4008";
            readonly value: 9588349;
        };
        readonly RAL4007: {
            readonly name: "merah - RAL4007";
            readonly value: 4856108;
        };
        readonly RAL4005: {
            readonly name: "merah - RAL4005";
            readonly value: 7095925;
        };
        readonly RAL4004: {
            readonly name: "merah - RAL4004";
            readonly value: 6560820;
        };
        readonly RAL4002: {
            readonly name: "merah - RAL4002";
            readonly value: 9579326;
        };
        readonly RAL3007: {
            readonly name: "hitam - RAL3007";
            readonly value: 4268583;
        };
        readonly RAL2001: {
            readonly name: "merah - RAL2001";
            readonly value: 13188128;
        };
        readonly RAL2002: {
            readonly name: "merah - RAL2002";
            readonly value: 13314081;
        };
        readonly RAL2012: {
            readonly name: "merah - RAL2012";
            readonly value: 15028535;
        };
        readonly RAL3001: {
            readonly name: "merah - RAL3001";
            readonly value: 10821657;
        };
        readonly RAL3003: {
            readonly name: "merah - RAL3003";
            readonly value: 10162462;
        };
        readonly RAL3005: {
            readonly name: "merah - RAL3005";
            readonly value: 6168873;
        };
        readonly RAL3018: {
            readonly name: "merah - RAL3018";
            readonly value: 13971506;
        };
        readonly RAL3027: {
            readonly name: "merah - RAL3027";
            readonly value: 12918068;
        };
        readonly RAL8004: {
            readonly name: "merah - RAL8004";
            readonly value: 9322538;
        };
        readonly RAL2003: {
            readonly name: "merah - RAL2003";
            readonly value: 16741652;
        };
        readonly RAL2010: {
            readonly name: "merah - RAL2010";
            readonly value: 16741652;
        };
        readonly RAL8023: {
            readonly name: "merah - RAL8023";
            readonly value: 10903086;
        };
        readonly RAL1000: {
            readonly name: "hijau - RAL1000";
            readonly value: 12500351;
        };
        readonly RAL1003: {
            readonly name: "kuning - RAL1003";
            readonly value: 15056385;
        };
        readonly RAL1011: {
            readonly name: "coklat - RAL1011";
            readonly value: 9070146;
        };
        readonly RAL1016: {
            readonly name: "kuning - RAL1016";
            readonly value: 15597345;
        };
        readonly RAL1017: {
            readonly name: "kuning - RAL1017";
            readonly value: 16109619;
        };
        readonly RAL1021: {
            readonly name: "kuning - RAL1021";
            readonly value: 15981067;
        };
        readonly RAL1027: {
            readonly name: "kuning - RAL1027";
            readonly value: 10326273;
        };
        readonly RAL1001: {
            readonly name: "kuning - RAL1001";
            readonly value: 12759160;
        };
        readonly RAL1012: {
            readonly name: "kuning - RAL1012";
            readonly value: 13087814;
        };
        readonly RAL8000: {
            readonly name: "hijau - RAL8000";
            readonly value: 8547380;
        };
        readonly RAL8001: {
            readonly name: "coklat - RAL8001";
            readonly value: 9789216;
        };
        readonly RAL8008: {
            readonly name: "coklat - RAL8008";
            readonly value: 7294760;
        };
        readonly RAL8011: {
            readonly name: "coklat - RAL8011";
            readonly value: 5978665;
        };
        readonly RAL8025: {
            readonly name: "coklat - RAL8025";
            readonly value: 7691336;
        };
    }>;
    transparent: Readonly<{
        readonly RAL9010: {
            readonly name: "putih - RAL9010";
            readonly value: 15854817;
        };
        readonly RAL9002: {
            readonly name: "putih - RAL9002";
            readonly value: 14144971;
        };
        readonly RAL1013: {
            readonly name: "putih - RAL1013";
            readonly value: 14932422;
        };
        readonly RAL9001: {
            readonly name: "kuning - RAL9001";
            readonly value: 15327442;
        };
        readonly RAL5004: {
            readonly name: "hitam - RAL5004";
            readonly value: 1646120;
        };
        readonly RAL7022: {
            readonly name: "abu-abu - RAL7022";
            readonly value: 4999748;
        };
        readonly RAL7005: {
            readonly name: "abu-abu - RAL7005";
            readonly value: 6581091;
        };
        readonly RAL7023: {
            readonly name: "abu-abu - RAL7023";
            readonly value: 6843486;
        };
        readonly RAL7035: {
            readonly name: "abu-abu - RAL7035";
            readonly value: 14145495;
        };
        readonly RAL7004: {
            readonly name: "abu-abu - RAL7004";
            readonly value: 9869714;
        };
        readonly RAL5001: {
            readonly name: "hijau - RAL5001";
            readonly value: 2044984;
        };
        readonly RAL5025: {
            readonly name: "biru - RAL5025";
            readonly value: 2189692;
        };
        readonly RAL5007: {
            readonly name: "biru - RAL5007";
            readonly value: 4087690;
        };
        readonly RAL5013: {
            readonly name: "biru - RAL5013";
            readonly value: 1974589;
        };
        readonly RAL5014: {
            readonly name: "biru - RAL5014";
            readonly value: 6319756;
        };
        readonly RAL5015: {
            readonly name: "biru - RAL5015";
            readonly value: 2257331;
        };
        readonly RAL5017: {
            readonly name: "biru - RAL5017";
            readonly value: 407921;
        };
        readonly RAL5020: {
            readonly name: "biru - RAL5020";
            readonly value: 1913674;
        };
        readonly RAL5022: {
            readonly name: "biru - RAL5022";
            readonly value: 2435152;
        };
        readonly RAL5024: {
            readonly name: "biru - RAL5024";
            readonly value: 6134683;
        };
        readonly RAL6034: {
            readonly name: "hijau - RAL6034";
            readonly value: 8369589;
        };
        readonly RAL7000: {
            readonly name: "abu-abu - RAL7000";
            readonly value: 7898507;
        };
        readonly RAL6000: {
            readonly name: "hijau - RAL6000";
            readonly value: 3237456;
        };
        readonly RAL6001: {
            readonly name: "hijau - RAL6001";
            readonly value: 2650675;
        };
        readonly RAL6003: {
            readonly name: "hijau - RAL6003";
            readonly value: 4343346;
        };
        readonly RAL6004: {
            readonly name: "hijau - RAL6004";
            readonly value: 2046525;
        };
        readonly RAL6011: {
            readonly name: "hijau - RAL6011";
            readonly value: 5796422;
        };
        readonly RAL6012: {
            readonly name: "hijau - RAL6012";
            readonly value: 3423808;
        };
        readonly RAL6018: {
            readonly name: "hijau - RAL6018";
            readonly value: 5744185;
        };
        readonly RAL6019: {
            readonly name: "hijau - RAL6019";
            readonly value: 12446902;
        };
        readonly RAL7002: {
            readonly name: "abu-abu - RAL7002";
            readonly value: 8289106;
        };
        readonly RAL7033: {
            readonly name: "abu-abu - RAL7033";
            readonly value: 8225905;
        };
        readonly RAL3012: {
            readonly name: "merah - RAL3012";
            readonly value: 12683115;
        };
        readonly RAL3014: {
            readonly name: "merah - RAL3014";
            readonly value: 13856368;
        };
        readonly RAL3015: {
            readonly name: "merah - RAL3015";
            readonly value: 15370650;
        };
        readonly RAL4003: {
            readonly name: "merah - RAL4003";
            readonly value: 14568586;
        };
        readonly RAL4009: {
            readonly name: "merah - RAL4009";
            readonly value: 10585492;
        };
        readonly RAL4008: {
            readonly name: "merah - RAL4008";
            readonly value: 9588349;
        };
        readonly RAL4007: {
            readonly name: "merah - RAL4007";
            readonly value: 4856108;
        };
        readonly RAL4005: {
            readonly name: "merah - RAL4005";
            readonly value: 7095925;
        };
        readonly RAL4004: {
            readonly name: "merah - RAL4004";
            readonly value: 6560820;
        };
        readonly RAL4002: {
            readonly name: "merah - RAL4002";
            readonly value: 9579326;
        };
        readonly RAL3007: {
            readonly name: "hitam - RAL3007";
            readonly value: 4268583;
        };
        readonly RAL2001: {
            readonly name: "merah - RAL2001";
            readonly value: 13188128;
        };
        readonly RAL2002: {
            readonly name: "merah - RAL2002";
            readonly value: 13314081;
        };
        readonly RAL2012: {
            readonly name: "merah - RAL2012";
            readonly value: 15028535;
        };
        readonly RAL3001: {
            readonly name: "merah - RAL3001";
            readonly value: 10821657;
        };
        readonly RAL3003: {
            readonly name: "merah - RAL3003";
            readonly value: 10162462;
        };
        readonly RAL3005: {
            readonly name: "merah - RAL3005";
            readonly value: 6168873;
        };
        readonly RAL3018: {
            readonly name: "merah - RAL3018";
            readonly value: 13971506;
        };
        readonly RAL3027: {
            readonly name: "merah - RAL3027";
            readonly value: 12918068;
        };
        readonly RAL8004: {
            readonly name: "merah - RAL8004";
            readonly value: 9322538;
        };
        readonly RAL2003: {
            readonly name: "merah - RAL2003";
            readonly value: 16741652;
        };
        readonly RAL2010: {
            readonly name: "merah - RAL2010";
            readonly value: 16741652;
        };
        readonly RAL8023: {
            readonly name: "merah - RAL8023";
            readonly value: 10903086;
        };
        readonly RAL1000: {
            readonly name: "hijau - RAL1000";
            readonly value: 12500351;
        };
        readonly RAL1003: {
            readonly name: "kuning - RAL1003";
            readonly value: 15056385;
        };
        readonly RAL1011: {
            readonly name: "coklat - RAL1011";
            readonly value: 9070146;
        };
        readonly RAL1016: {
            readonly name: "kuning - RAL1016";
            readonly value: 15597345;
        };
        readonly RAL1017: {
            readonly name: "kuning - RAL1017";
            readonly value: 16109619;
        };
        readonly RAL1021: {
            readonly name: "kuning - RAL1021";
            readonly value: 15981067;
        };
        readonly RAL1027: {
            readonly name: "kuning - RAL1027";
            readonly value: 10326273;
        };
        readonly RAL1001: {
            readonly name: "kuning - RAL1001";
            readonly value: 12759160;
        };
        readonly RAL1012: {
            readonly name: "kuning - RAL1012";
            readonly value: 13087814;
        };
        readonly RAL8000: {
            readonly name: "hijau - RAL8000";
            readonly value: 8547380;
        };
        readonly RAL8001: {
            readonly name: "coklat - RAL8001";
            readonly value: 9789216;
        };
        readonly RAL8008: {
            readonly name: "coklat - RAL8008";
            readonly value: 7294760;
        };
        readonly RAL8011: {
            readonly name: "coklat - RAL8011";
            readonly value: 5978665;
        };
        readonly RAL8025: {
            readonly name: "coklat - RAL8025";
            readonly value: 7691336;
        };
    }>;
    metallic: Readonly<{
        readonly black: {
            readonly name: "hitam";
        };
        readonly blue: {
            readonly name: "biru";
        };
        readonly "bright-yellow": {
            readonly name: "kuning terang";
        };
        readonly brown: {
            readonly name: "coklat";
        };
        readonly copper: {
            readonly name: "tembaga";
        };
        readonly crimson: {
            readonly name: "merah tua";
        };
        readonly emerald: {
            readonly name: "hijau zamrud";
        };
        readonly gray: {
            readonly name: "abu-abu";
        };
        readonly green: {
            readonly name: "hijau";
        };
        readonly "light-blue": {
            readonly name: "biru muda";
        };
        readonly "light-brown": {
            readonly name: "coklat muda";
        };
        readonly "light-gray": {
            readonly name: "abu-abu muda";
        };
        readonly "light-green": {
            readonly name: "hijau muda";
        };
        readonly "light-orange": {
            readonly name: "orange muda";
        };
        readonly "light-pink": {
            readonly name: "pink muda";
        };
        readonly "light-purple": {
            readonly name: "ungu muda";
        };
        readonly "light-yellow": {
            readonly name: "kuning muda";
        };
        readonly orange: {
            readonly name: "orange";
        };
        readonly "pure-white": {
            readonly name: "putih";
        };
        readonly purple: {
            readonly name: "ungu";
        };
        readonly red: {
            readonly name: "merah";
        };
        readonly seafoam: {
            readonly name: "biru laut";
        };
        readonly turquoise: {
            readonly name: "biru langit";
        };
        readonly white: {
            readonly name: "ivory";
        };
        readonly yellow: {
            readonly name: "kuning";
        };
    }>;
}>;
export declare const neckColorTypeToColorsMap: Readonly<{
    solid: Readonly<{
        readonly RAL9010: {
            readonly name: "putih - RAL9010";
            readonly value: 15854817;
        };
        readonly RAL9002: {
            readonly name: "putih - RAL9002";
            readonly value: 14144971;
        };
        readonly RAL1013: {
            readonly name: "putih - RAL1013";
            readonly value: 14932422;
        };
        readonly RAL9001: {
            readonly name: "kuning - RAL9001";
            readonly value: 15327442;
        };
        readonly RAL5004: {
            readonly name: "hitam - RAL5004";
            readonly value: 1646120;
        };
        readonly RAL7022: {
            readonly name: "abu-abu - RAL7022";
            readonly value: 4999748;
        };
        readonly RAL7005: {
            readonly name: "abu-abu - RAL7005";
            readonly value: 6581091;
        };
        readonly RAL7023: {
            readonly name: "abu-abu - RAL7023";
            readonly value: 6843486;
        };
        readonly RAL7035: {
            readonly name: "abu-abu - RAL7035";
            readonly value: 14145495;
        };
        readonly RAL7004: {
            readonly name: "abu-abu - RAL7004";
            readonly value: 9869714;
        };
        readonly RAL5001: {
            readonly name: "hijau - RAL5001";
            readonly value: 2044984;
        };
        readonly RAL5025: {
            readonly name: "biru - RAL5025";
            readonly value: 2189692;
        };
        readonly RAL5007: {
            readonly name: "biru - RAL5007";
            readonly value: 4087690;
        };
        readonly RAL5013: {
            readonly name: "biru - RAL5013";
            readonly value: 1974589;
        };
        readonly RAL5014: {
            readonly name: "biru - RAL5014";
            readonly value: 6319756;
        };
        readonly RAL5015: {
            readonly name: "biru - RAL5015";
            readonly value: 2257331;
        };
        readonly RAL5017: {
            readonly name: "biru - RAL5017";
            readonly value: 407921;
        };
        readonly RAL5020: {
            readonly name: "biru - RAL5020";
            readonly value: 1913674;
        };
        readonly RAL5022: {
            readonly name: "biru - RAL5022";
            readonly value: 2435152;
        };
        readonly RAL5024: {
            readonly name: "biru - RAL5024";
            readonly value: 6134683;
        };
        readonly RAL6034: {
            readonly name: "hijau - RAL6034";
            readonly value: 8369589;
        };
        readonly RAL7000: {
            readonly name: "abu-abu - RAL7000";
            readonly value: 7898507;
        };
        readonly RAL6000: {
            readonly name: "hijau - RAL6000";
            readonly value: 3237456;
        };
        readonly RAL6001: {
            readonly name: "hijau - RAL6001";
            readonly value: 2650675;
        };
        readonly RAL6003: {
            readonly name: "hijau - RAL6003";
            readonly value: 4343346;
        };
        readonly RAL6004: {
            readonly name: "hijau - RAL6004";
            readonly value: 2046525;
        };
        readonly RAL6011: {
            readonly name: "hijau - RAL6011";
            readonly value: 5796422;
        };
        readonly RAL6012: {
            readonly name: "hijau - RAL6012";
            readonly value: 3423808;
        };
        readonly RAL6018: {
            readonly name: "hijau - RAL6018";
            readonly value: 5744185;
        };
        readonly RAL6019: {
            readonly name: "hijau - RAL6019";
            readonly value: 12446902;
        };
        readonly RAL7002: {
            readonly name: "abu-abu - RAL7002";
            readonly value: 8289106;
        };
        readonly RAL7033: {
            readonly name: "abu-abu - RAL7033";
            readonly value: 8225905;
        };
        readonly RAL3012: {
            readonly name: "merah - RAL3012";
            readonly value: 12683115;
        };
        readonly RAL3014: {
            readonly name: "merah - RAL3014";
            readonly value: 13856368;
        };
        readonly RAL3015: {
            readonly name: "merah - RAL3015";
            readonly value: 15370650;
        };
        readonly RAL4003: {
            readonly name: "merah - RAL4003";
            readonly value: 14568586;
        };
        readonly RAL4009: {
            readonly name: "merah - RAL4009";
            readonly value: 10585492;
        };
        readonly RAL4008: {
            readonly name: "merah - RAL4008";
            readonly value: 9588349;
        };
        readonly RAL4007: {
            readonly name: "merah - RAL4007";
            readonly value: 4856108;
        };
        readonly RAL4005: {
            readonly name: "merah - RAL4005";
            readonly value: 7095925;
        };
        readonly RAL4004: {
            readonly name: "merah - RAL4004";
            readonly value: 6560820;
        };
        readonly RAL4002: {
            readonly name: "merah - RAL4002";
            readonly value: 9579326;
        };
        readonly RAL3007: {
            readonly name: "hitam - RAL3007";
            readonly value: 4268583;
        };
        readonly RAL2001: {
            readonly name: "merah - RAL2001";
            readonly value: 13188128;
        };
        readonly RAL2002: {
            readonly name: "merah - RAL2002";
            readonly value: 13314081;
        };
        readonly RAL2012: {
            readonly name: "merah - RAL2012";
            readonly value: 15028535;
        };
        readonly RAL3001: {
            readonly name: "merah - RAL3001";
            readonly value: 10821657;
        };
        readonly RAL3003: {
            readonly name: "merah - RAL3003";
            readonly value: 10162462;
        };
        readonly RAL3005: {
            readonly name: "merah - RAL3005";
            readonly value: 6168873;
        };
        readonly RAL3018: {
            readonly name: "merah - RAL3018";
            readonly value: 13971506;
        };
        readonly RAL3027: {
            readonly name: "merah - RAL3027";
            readonly value: 12918068;
        };
        readonly RAL8004: {
            readonly name: "merah - RAL8004";
            readonly value: 9322538;
        };
        readonly RAL2003: {
            readonly name: "merah - RAL2003";
            readonly value: 16741652;
        };
        readonly RAL2010: {
            readonly name: "merah - RAL2010";
            readonly value: 16741652;
        };
        readonly RAL8023: {
            readonly name: "merah - RAL8023";
            readonly value: 10903086;
        };
        readonly RAL1000: {
            readonly name: "hijau - RAL1000";
            readonly value: 12500351;
        };
        readonly RAL1003: {
            readonly name: "kuning - RAL1003";
            readonly value: 15056385;
        };
        readonly RAL1011: {
            readonly name: "coklat - RAL1011";
            readonly value: 9070146;
        };
        readonly RAL1016: {
            readonly name: "kuning - RAL1016";
            readonly value: 15597345;
        };
        readonly RAL1017: {
            readonly name: "kuning - RAL1017";
            readonly value: 16109619;
        };
        readonly RAL1021: {
            readonly name: "kuning - RAL1021";
            readonly value: 15981067;
        };
        readonly RAL1027: {
            readonly name: "kuning - RAL1027";
            readonly value: 10326273;
        };
        readonly RAL1001: {
            readonly name: "kuning - RAL1001";
            readonly value: 12759160;
        };
        readonly RAL1012: {
            readonly name: "kuning - RAL1012";
            readonly value: 13087814;
        };
        readonly RAL8000: {
            readonly name: "hijau - RAL8000";
            readonly value: 8547380;
        };
        readonly RAL8001: {
            readonly name: "coklat - RAL8001";
            readonly value: 9789216;
        };
        readonly RAL8008: {
            readonly name: "coklat - RAL8008";
            readonly value: 7294760;
        };
        readonly RAL8011: {
            readonly name: "coklat - RAL8011";
            readonly value: 5978665;
        };
        readonly RAL8025: {
            readonly name: "coklat - RAL8025";
            readonly value: 7691336;
        };
    }>;
    transparent: Readonly<{
        readonly RAL9010: {
            readonly name: "putih - RAL9010";
            readonly value: 15854817;
        };
        readonly RAL9002: {
            readonly name: "putih - RAL9002";
            readonly value: 14144971;
        };
        readonly RAL1013: {
            readonly name: "putih - RAL1013";
            readonly value: 14932422;
        };
        readonly RAL9001: {
            readonly name: "kuning - RAL9001";
            readonly value: 15327442;
        };
        readonly RAL5004: {
            readonly name: "hitam - RAL5004";
            readonly value: 1646120;
        };
        readonly RAL7022: {
            readonly name: "abu-abu - RAL7022";
            readonly value: 4999748;
        };
        readonly RAL7005: {
            readonly name: "abu-abu - RAL7005";
            readonly value: 6581091;
        };
        readonly RAL7023: {
            readonly name: "abu-abu - RAL7023";
            readonly value: 6843486;
        };
        readonly RAL7035: {
            readonly name: "abu-abu - RAL7035";
            readonly value: 14145495;
        };
        readonly RAL7004: {
            readonly name: "abu-abu - RAL7004";
            readonly value: 9869714;
        };
        readonly RAL5001: {
            readonly name: "hijau - RAL5001";
            readonly value: 2044984;
        };
        readonly RAL5025: {
            readonly name: "biru - RAL5025";
            readonly value: 2189692;
        };
        readonly RAL5007: {
            readonly name: "biru - RAL5007";
            readonly value: 4087690;
        };
        readonly RAL5013: {
            readonly name: "biru - RAL5013";
            readonly value: 1974589;
        };
        readonly RAL5014: {
            readonly name: "biru - RAL5014";
            readonly value: 6319756;
        };
        readonly RAL5015: {
            readonly name: "biru - RAL5015";
            readonly value: 2257331;
        };
        readonly RAL5017: {
            readonly name: "biru - RAL5017";
            readonly value: 407921;
        };
        readonly RAL5020: {
            readonly name: "biru - RAL5020";
            readonly value: 1913674;
        };
        readonly RAL5022: {
            readonly name: "biru - RAL5022";
            readonly value: 2435152;
        };
        readonly RAL5024: {
            readonly name: "biru - RAL5024";
            readonly value: 6134683;
        };
        readonly RAL6034: {
            readonly name: "hijau - RAL6034";
            readonly value: 8369589;
        };
        readonly RAL7000: {
            readonly name: "abu-abu - RAL7000";
            readonly value: 7898507;
        };
        readonly RAL6000: {
            readonly name: "hijau - RAL6000";
            readonly value: 3237456;
        };
        readonly RAL6001: {
            readonly name: "hijau - RAL6001";
            readonly value: 2650675;
        };
        readonly RAL6003: {
            readonly name: "hijau - RAL6003";
            readonly value: 4343346;
        };
        readonly RAL6004: {
            readonly name: "hijau - RAL6004";
            readonly value: 2046525;
        };
        readonly RAL6011: {
            readonly name: "hijau - RAL6011";
            readonly value: 5796422;
        };
        readonly RAL6012: {
            readonly name: "hijau - RAL6012";
            readonly value: 3423808;
        };
        readonly RAL6018: {
            readonly name: "hijau - RAL6018";
            readonly value: 5744185;
        };
        readonly RAL6019: {
            readonly name: "hijau - RAL6019";
            readonly value: 12446902;
        };
        readonly RAL7002: {
            readonly name: "abu-abu - RAL7002";
            readonly value: 8289106;
        };
        readonly RAL7033: {
            readonly name: "abu-abu - RAL7033";
            readonly value: 8225905;
        };
        readonly RAL3012: {
            readonly name: "merah - RAL3012";
            readonly value: 12683115;
        };
        readonly RAL3014: {
            readonly name: "merah - RAL3014";
            readonly value: 13856368;
        };
        readonly RAL3015: {
            readonly name: "merah - RAL3015";
            readonly value: 15370650;
        };
        readonly RAL4003: {
            readonly name: "merah - RAL4003";
            readonly value: 14568586;
        };
        readonly RAL4009: {
            readonly name: "merah - RAL4009";
            readonly value: 10585492;
        };
        readonly RAL4008: {
            readonly name: "merah - RAL4008";
            readonly value: 9588349;
        };
        readonly RAL4007: {
            readonly name: "merah - RAL4007";
            readonly value: 4856108;
        };
        readonly RAL4005: {
            readonly name: "merah - RAL4005";
            readonly value: 7095925;
        };
        readonly RAL4004: {
            readonly name: "merah - RAL4004";
            readonly value: 6560820;
        };
        readonly RAL4002: {
            readonly name: "merah - RAL4002";
            readonly value: 9579326;
        };
        readonly RAL3007: {
            readonly name: "hitam - RAL3007";
            readonly value: 4268583;
        };
        readonly RAL2001: {
            readonly name: "merah - RAL2001";
            readonly value: 13188128;
        };
        readonly RAL2002: {
            readonly name: "merah - RAL2002";
            readonly value: 13314081;
        };
        readonly RAL2012: {
            readonly name: "merah - RAL2012";
            readonly value: 15028535;
        };
        readonly RAL3001: {
            readonly name: "merah - RAL3001";
            readonly value: 10821657;
        };
        readonly RAL3003: {
            readonly name: "merah - RAL3003";
            readonly value: 10162462;
        };
        readonly RAL3005: {
            readonly name: "merah - RAL3005";
            readonly value: 6168873;
        };
        readonly RAL3018: {
            readonly name: "merah - RAL3018";
            readonly value: 13971506;
        };
        readonly RAL3027: {
            readonly name: "merah - RAL3027";
            readonly value: 12918068;
        };
        readonly RAL8004: {
            readonly name: "merah - RAL8004";
            readonly value: 9322538;
        };
        readonly RAL2003: {
            readonly name: "merah - RAL2003";
            readonly value: 16741652;
        };
        readonly RAL2010: {
            readonly name: "merah - RAL2010";
            readonly value: 16741652;
        };
        readonly RAL8023: {
            readonly name: "merah - RAL8023";
            readonly value: 10903086;
        };
        readonly RAL1000: {
            readonly name: "hijau - RAL1000";
            readonly value: 12500351;
        };
        readonly RAL1003: {
            readonly name: "kuning - RAL1003";
            readonly value: 15056385;
        };
        readonly RAL1011: {
            readonly name: "coklat - RAL1011";
            readonly value: 9070146;
        };
        readonly RAL1016: {
            readonly name: "kuning - RAL1016";
            readonly value: 15597345;
        };
        readonly RAL1017: {
            readonly name: "kuning - RAL1017";
            readonly value: 16109619;
        };
        readonly RAL1021: {
            readonly name: "kuning - RAL1021";
            readonly value: 15981067;
        };
        readonly RAL1027: {
            readonly name: "kuning - RAL1027";
            readonly value: 10326273;
        };
        readonly RAL1001: {
            readonly name: "kuning - RAL1001";
            readonly value: 12759160;
        };
        readonly RAL1012: {
            readonly name: "kuning - RAL1012";
            readonly value: 13087814;
        };
        readonly RAL8000: {
            readonly name: "hijau - RAL8000";
            readonly value: 8547380;
        };
        readonly RAL8001: {
            readonly name: "coklat - RAL8001";
            readonly value: 9789216;
        };
        readonly RAL8008: {
            readonly name: "coklat - RAL8008";
            readonly value: 7294760;
        };
        readonly RAL8011: {
            readonly name: "coklat - RAL8011";
            readonly value: 5978665;
        };
        readonly RAL8025: {
            readonly name: "coklat - RAL8025";
            readonly value: 7691336;
        };
    }>;
    metallic: Readonly<{
        readonly black: {
            readonly name: "hitam";
        };
        readonly blue: {
            readonly name: "biru";
        };
        readonly "bright-yellow": {
            readonly name: "kuning terang";
        };
        readonly brown: {
            readonly name: "coklat";
        };
        readonly copper: {
            readonly name: "tembaga";
        };
        readonly crimson: {
            readonly name: "merah tua";
        };
        readonly emerald: {
            readonly name: "hijau zamrud";
        };
        readonly gray: {
            readonly name: "abu-abu";
        };
        readonly green: {
            readonly name: "hijau";
        };
        readonly "light-blue": {
            readonly name: "biru muda";
        };
        readonly "light-brown": {
            readonly name: "coklat muda";
        };
        readonly "light-gray": {
            readonly name: "abu-abu muda";
        };
        readonly "light-green": {
            readonly name: "hijau muda";
        };
        readonly "light-orange": {
            readonly name: "orange muda";
        };
        readonly "light-pink": {
            readonly name: "pink muda";
        };
        readonly "light-purple": {
            readonly name: "ungu muda";
        };
        readonly "light-yellow": {
            readonly name: "kuning muda";
        };
        readonly orange: {
            readonly name: "orange";
        };
        readonly "pure-white": {
            readonly name: "putih";
        };
        readonly purple: {
            readonly name: "ungu";
        };
        readonly red: {
            readonly name: "merah";
        };
        readonly seafoam: {
            readonly name: "biru laut";
        };
        readonly turquoise: {
            readonly name: "biru langit";
        };
        readonly white: {
            readonly name: "ivory";
        };
        readonly yellow: {
            readonly name: "kuning";
        };
    }>;
}>;
export declare const headstockColorTypeToColorsMap: Readonly<{
    solid: Readonly<{
        readonly RAL9010: {
            readonly name: "putih - RAL9010";
            readonly value: 15854817;
        };
        readonly RAL9002: {
            readonly name: "putih - RAL9002";
            readonly value: 14144971;
        };
        readonly RAL1013: {
            readonly name: "putih - RAL1013";
            readonly value: 14932422;
        };
        readonly RAL9001: {
            readonly name: "kuning - RAL9001";
            readonly value: 15327442;
        };
        readonly RAL5004: {
            readonly name: "hitam - RAL5004";
            readonly value: 1646120;
        };
        readonly RAL7022: {
            readonly name: "abu-abu - RAL7022";
            readonly value: 4999748;
        };
        readonly RAL7005: {
            readonly name: "abu-abu - RAL7005";
            readonly value: 6581091;
        };
        readonly RAL7023: {
            readonly name: "abu-abu - RAL7023";
            readonly value: 6843486;
        };
        readonly RAL7035: {
            readonly name: "abu-abu - RAL7035";
            readonly value: 14145495;
        };
        readonly RAL7004: {
            readonly name: "abu-abu - RAL7004";
            readonly value: 9869714;
        };
        readonly RAL5001: {
            readonly name: "hijau - RAL5001";
            readonly value: 2044984;
        };
        readonly RAL5025: {
            readonly name: "biru - RAL5025";
            readonly value: 2189692;
        };
        readonly RAL5007: {
            readonly name: "biru - RAL5007";
            readonly value: 4087690;
        };
        readonly RAL5013: {
            readonly name: "biru - RAL5013";
            readonly value: 1974589;
        };
        readonly RAL5014: {
            readonly name: "biru - RAL5014";
            readonly value: 6319756;
        };
        readonly RAL5015: {
            readonly name: "biru - RAL5015";
            readonly value: 2257331;
        };
        readonly RAL5017: {
            readonly name: "biru - RAL5017";
            readonly value: 407921;
        };
        readonly RAL5020: {
            readonly name: "biru - RAL5020";
            readonly value: 1913674;
        };
        readonly RAL5022: {
            readonly name: "biru - RAL5022";
            readonly value: 2435152;
        };
        readonly RAL5024: {
            readonly name: "biru - RAL5024";
            readonly value: 6134683;
        };
        readonly RAL6034: {
            readonly name: "hijau - RAL6034";
            readonly value: 8369589;
        };
        readonly RAL7000: {
            readonly name: "abu-abu - RAL7000";
            readonly value: 7898507;
        };
        readonly RAL6000: {
            readonly name: "hijau - RAL6000";
            readonly value: 3237456;
        };
        readonly RAL6001: {
            readonly name: "hijau - RAL6001";
            readonly value: 2650675;
        };
        readonly RAL6003: {
            readonly name: "hijau - RAL6003";
            readonly value: 4343346;
        };
        readonly RAL6004: {
            readonly name: "hijau - RAL6004";
            readonly value: 2046525;
        };
        readonly RAL6011: {
            readonly name: "hijau - RAL6011";
            readonly value: 5796422;
        };
        readonly RAL6012: {
            readonly name: "hijau - RAL6012";
            readonly value: 3423808;
        };
        readonly RAL6018: {
            readonly name: "hijau - RAL6018";
            readonly value: 5744185;
        };
        readonly RAL6019: {
            readonly name: "hijau - RAL6019";
            readonly value: 12446902;
        };
        readonly RAL7002: {
            readonly name: "abu-abu - RAL7002";
            readonly value: 8289106;
        };
        readonly RAL7033: {
            readonly name: "abu-abu - RAL7033";
            readonly value: 8225905;
        };
        readonly RAL3012: {
            readonly name: "merah - RAL3012";
            readonly value: 12683115;
        };
        readonly RAL3014: {
            readonly name: "merah - RAL3014";
            readonly value: 13856368;
        };
        readonly RAL3015: {
            readonly name: "merah - RAL3015";
            readonly value: 15370650;
        };
        readonly RAL4003: {
            readonly name: "merah - RAL4003";
            readonly value: 14568586;
        };
        readonly RAL4009: {
            readonly name: "merah - RAL4009";
            readonly value: 10585492;
        };
        readonly RAL4008: {
            readonly name: "merah - RAL4008";
            readonly value: 9588349;
        };
        readonly RAL4007: {
            readonly name: "merah - RAL4007";
            readonly value: 4856108;
        };
        readonly RAL4005: {
            readonly name: "merah - RAL4005";
            readonly value: 7095925;
        };
        readonly RAL4004: {
            readonly name: "merah - RAL4004";
            readonly value: 6560820;
        };
        readonly RAL4002: {
            readonly name: "merah - RAL4002";
            readonly value: 9579326;
        };
        readonly RAL3007: {
            readonly name: "hitam - RAL3007";
            readonly value: 4268583;
        };
        readonly RAL2001: {
            readonly name: "merah - RAL2001";
            readonly value: 13188128;
        };
        readonly RAL2002: {
            readonly name: "merah - RAL2002";
            readonly value: 13314081;
        };
        readonly RAL2012: {
            readonly name: "merah - RAL2012";
            readonly value: 15028535;
        };
        readonly RAL3001: {
            readonly name: "merah - RAL3001";
            readonly value: 10821657;
        };
        readonly RAL3003: {
            readonly name: "merah - RAL3003";
            readonly value: 10162462;
        };
        readonly RAL3005: {
            readonly name: "merah - RAL3005";
            readonly value: 6168873;
        };
        readonly RAL3018: {
            readonly name: "merah - RAL3018";
            readonly value: 13971506;
        };
        readonly RAL3027: {
            readonly name: "merah - RAL3027";
            readonly value: 12918068;
        };
        readonly RAL8004: {
            readonly name: "merah - RAL8004";
            readonly value: 9322538;
        };
        readonly RAL2003: {
            readonly name: "merah - RAL2003";
            readonly value: 16741652;
        };
        readonly RAL2010: {
            readonly name: "merah - RAL2010";
            readonly value: 16741652;
        };
        readonly RAL8023: {
            readonly name: "merah - RAL8023";
            readonly value: 10903086;
        };
        readonly RAL1000: {
            readonly name: "hijau - RAL1000";
            readonly value: 12500351;
        };
        readonly RAL1003: {
            readonly name: "kuning - RAL1003";
            readonly value: 15056385;
        };
        readonly RAL1011: {
            readonly name: "coklat - RAL1011";
            readonly value: 9070146;
        };
        readonly RAL1016: {
            readonly name: "kuning - RAL1016";
            readonly value: 15597345;
        };
        readonly RAL1017: {
            readonly name: "kuning - RAL1017";
            readonly value: 16109619;
        };
        readonly RAL1021: {
            readonly name: "kuning - RAL1021";
            readonly value: 15981067;
        };
        readonly RAL1027: {
            readonly name: "kuning - RAL1027";
            readonly value: 10326273;
        };
        readonly RAL1001: {
            readonly name: "kuning - RAL1001";
            readonly value: 12759160;
        };
        readonly RAL1012: {
            readonly name: "kuning - RAL1012";
            readonly value: 13087814;
        };
        readonly RAL8000: {
            readonly name: "hijau - RAL8000";
            readonly value: 8547380;
        };
        readonly RAL8001: {
            readonly name: "coklat - RAL8001";
            readonly value: 9789216;
        };
        readonly RAL8008: {
            readonly name: "coklat - RAL8008";
            readonly value: 7294760;
        };
        readonly RAL8011: {
            readonly name: "coklat - RAL8011";
            readonly value: 5978665;
        };
        readonly RAL8025: {
            readonly name: "coklat - RAL8025";
            readonly value: 7691336;
        };
    }>;
    transparent: Readonly<{
        readonly RAL9010: {
            readonly name: "putih - RAL9010";
            readonly value: 15854817;
        };
        readonly RAL9002: {
            readonly name: "putih - RAL9002";
            readonly value: 14144971;
        };
        readonly RAL1013: {
            readonly name: "putih - RAL1013";
            readonly value: 14932422;
        };
        readonly RAL9001: {
            readonly name: "kuning - RAL9001";
            readonly value: 15327442;
        };
        readonly RAL5004: {
            readonly name: "hitam - RAL5004";
            readonly value: 1646120;
        };
        readonly RAL7022: {
            readonly name: "abu-abu - RAL7022";
            readonly value: 4999748;
        };
        readonly RAL7005: {
            readonly name: "abu-abu - RAL7005";
            readonly value: 6581091;
        };
        readonly RAL7023: {
            readonly name: "abu-abu - RAL7023";
            readonly value: 6843486;
        };
        readonly RAL7035: {
            readonly name: "abu-abu - RAL7035";
            readonly value: 14145495;
        };
        readonly RAL7004: {
            readonly name: "abu-abu - RAL7004";
            readonly value: 9869714;
        };
        readonly RAL5001: {
            readonly name: "hijau - RAL5001";
            readonly value: 2044984;
        };
        readonly RAL5025: {
            readonly name: "biru - RAL5025";
            readonly value: 2189692;
        };
        readonly RAL5007: {
            readonly name: "biru - RAL5007";
            readonly value: 4087690;
        };
        readonly RAL5013: {
            readonly name: "biru - RAL5013";
            readonly value: 1974589;
        };
        readonly RAL5014: {
            readonly name: "biru - RAL5014";
            readonly value: 6319756;
        };
        readonly RAL5015: {
            readonly name: "biru - RAL5015";
            readonly value: 2257331;
        };
        readonly RAL5017: {
            readonly name: "biru - RAL5017";
            readonly value: 407921;
        };
        readonly RAL5020: {
            readonly name: "biru - RAL5020";
            readonly value: 1913674;
        };
        readonly RAL5022: {
            readonly name: "biru - RAL5022";
            readonly value: 2435152;
        };
        readonly RAL5024: {
            readonly name: "biru - RAL5024";
            readonly value: 6134683;
        };
        readonly RAL6034: {
            readonly name: "hijau - RAL6034";
            readonly value: 8369589;
        };
        readonly RAL7000: {
            readonly name: "abu-abu - RAL7000";
            readonly value: 7898507;
        };
        readonly RAL6000: {
            readonly name: "hijau - RAL6000";
            readonly value: 3237456;
        };
        readonly RAL6001: {
            readonly name: "hijau - RAL6001";
            readonly value: 2650675;
        };
        readonly RAL6003: {
            readonly name: "hijau - RAL6003";
            readonly value: 4343346;
        };
        readonly RAL6004: {
            readonly name: "hijau - RAL6004";
            readonly value: 2046525;
        };
        readonly RAL6011: {
            readonly name: "hijau - RAL6011";
            readonly value: 5796422;
        };
        readonly RAL6012: {
            readonly name: "hijau - RAL6012";
            readonly value: 3423808;
        };
        readonly RAL6018: {
            readonly name: "hijau - RAL6018";
            readonly value: 5744185;
        };
        readonly RAL6019: {
            readonly name: "hijau - RAL6019";
            readonly value: 12446902;
        };
        readonly RAL7002: {
            readonly name: "abu-abu - RAL7002";
            readonly value: 8289106;
        };
        readonly RAL7033: {
            readonly name: "abu-abu - RAL7033";
            readonly value: 8225905;
        };
        readonly RAL3012: {
            readonly name: "merah - RAL3012";
            readonly value: 12683115;
        };
        readonly RAL3014: {
            readonly name: "merah - RAL3014";
            readonly value: 13856368;
        };
        readonly RAL3015: {
            readonly name: "merah - RAL3015";
            readonly value: 15370650;
        };
        readonly RAL4003: {
            readonly name: "merah - RAL4003";
            readonly value: 14568586;
        };
        readonly RAL4009: {
            readonly name: "merah - RAL4009";
            readonly value: 10585492;
        };
        readonly RAL4008: {
            readonly name: "merah - RAL4008";
            readonly value: 9588349;
        };
        readonly RAL4007: {
            readonly name: "merah - RAL4007";
            readonly value: 4856108;
        };
        readonly RAL4005: {
            readonly name: "merah - RAL4005";
            readonly value: 7095925;
        };
        readonly RAL4004: {
            readonly name: "merah - RAL4004";
            readonly value: 6560820;
        };
        readonly RAL4002: {
            readonly name: "merah - RAL4002";
            readonly value: 9579326;
        };
        readonly RAL3007: {
            readonly name: "hitam - RAL3007";
            readonly value: 4268583;
        };
        readonly RAL2001: {
            readonly name: "merah - RAL2001";
            readonly value: 13188128;
        };
        readonly RAL2002: {
            readonly name: "merah - RAL2002";
            readonly value: 13314081;
        };
        readonly RAL2012: {
            readonly name: "merah - RAL2012";
            readonly value: 15028535;
        };
        readonly RAL3001: {
            readonly name: "merah - RAL3001";
            readonly value: 10821657;
        };
        readonly RAL3003: {
            readonly name: "merah - RAL3003";
            readonly value: 10162462;
        };
        readonly RAL3005: {
            readonly name: "merah - RAL3005";
            readonly value: 6168873;
        };
        readonly RAL3018: {
            readonly name: "merah - RAL3018";
            readonly value: 13971506;
        };
        readonly RAL3027: {
            readonly name: "merah - RAL3027";
            readonly value: 12918068;
        };
        readonly RAL8004: {
            readonly name: "merah - RAL8004";
            readonly value: 9322538;
        };
        readonly RAL2003: {
            readonly name: "merah - RAL2003";
            readonly value: 16741652;
        };
        readonly RAL2010: {
            readonly name: "merah - RAL2010";
            readonly value: 16741652;
        };
        readonly RAL8023: {
            readonly name: "merah - RAL8023";
            readonly value: 10903086;
        };
        readonly RAL1000: {
            readonly name: "hijau - RAL1000";
            readonly value: 12500351;
        };
        readonly RAL1003: {
            readonly name: "kuning - RAL1003";
            readonly value: 15056385;
        };
        readonly RAL1011: {
            readonly name: "coklat - RAL1011";
            readonly value: 9070146;
        };
        readonly RAL1016: {
            readonly name: "kuning - RAL1016";
            readonly value: 15597345;
        };
        readonly RAL1017: {
            readonly name: "kuning - RAL1017";
            readonly value: 16109619;
        };
        readonly RAL1021: {
            readonly name: "kuning - RAL1021";
            readonly value: 15981067;
        };
        readonly RAL1027: {
            readonly name: "kuning - RAL1027";
            readonly value: 10326273;
        };
        readonly RAL1001: {
            readonly name: "kuning - RAL1001";
            readonly value: 12759160;
        };
        readonly RAL1012: {
            readonly name: "kuning - RAL1012";
            readonly value: 13087814;
        };
        readonly RAL8000: {
            readonly name: "hijau - RAL8000";
            readonly value: 8547380;
        };
        readonly RAL8001: {
            readonly name: "coklat - RAL8001";
            readonly value: 9789216;
        };
        readonly RAL8008: {
            readonly name: "coklat - RAL8008";
            readonly value: 7294760;
        };
        readonly RAL8011: {
            readonly name: "coklat - RAL8011";
            readonly value: 5978665;
        };
        readonly RAL8025: {
            readonly name: "coklat - RAL8025";
            readonly value: 7691336;
        };
    }>;
    metallic: Readonly<{
        readonly black: {
            readonly name: "hitam";
        };
        readonly blue: {
            readonly name: "biru";
        };
        readonly "bright-yellow": {
            readonly name: "kuning terang";
        };
        readonly brown: {
            readonly name: "coklat";
        };
        readonly copper: {
            readonly name: "tembaga";
        };
        readonly crimson: {
            readonly name: "merah tua";
        };
        readonly emerald: {
            readonly name: "hijau zamrud";
        };
        readonly gray: {
            readonly name: "abu-abu";
        };
        readonly green: {
            readonly name: "hijau";
        };
        readonly "light-blue": {
            readonly name: "biru muda";
        };
        readonly "light-brown": {
            readonly name: "coklat muda";
        };
        readonly "light-gray": {
            readonly name: "abu-abu muda";
        };
        readonly "light-green": {
            readonly name: "hijau muda";
        };
        readonly "light-orange": {
            readonly name: "orange muda";
        };
        readonly "light-pink": {
            readonly name: "pink muda";
        };
        readonly "light-purple": {
            readonly name: "ungu muda";
        };
        readonly "light-yellow": {
            readonly name: "kuning muda";
        };
        readonly orange: {
            readonly name: "orange";
        };
        readonly "pure-white": {
            readonly name: "putih";
        };
        readonly purple: {
            readonly name: "ungu";
        };
        readonly red: {
            readonly name: "merah";
        };
        readonly seafoam: {
            readonly name: "biru laut";
        };
        readonly turquoise: {
            readonly name: "biru langit";
        };
        readonly white: {
            readonly name: "ivory";
        };
        readonly yellow: {
            readonly name: "kuning";
        };
    }>;
}>;
export declare const bindings: Readonly<{
    readonly "1-ply-pvc": {
        readonly name: "1 Ply PVC";
        readonly price: 75000;
    };
    readonly "3-ply-pvc": {
        readonly name: "3 Ply PVC";
        readonly price: 125000;
    };
    readonly "5-ply-pvc": {
        readonly name: "5 Ply PVC";
        readonly price: 175000;
    };
    readonly pearloid: {
        readonly name: "Pearloid";
        readonly price: 150000;
    };
    readonly "synthetic-abalone": {
        readonly name: "Synthetic Abalone";
        readonly price: 150000;
    };
    readonly "wood-purfling": {
        readonly name: "Wood Purfling";
        readonly price: 175000;
    };
    readonly "herringbone-purfling": {
        readonly name: "Herringbone Purfling";
        readonly price: 200000;
    };
    readonly "mother-of-pearl": {
        readonly name: "Mother of Pearl";
        readonly price: 500000;
    };
    readonly abalone: {
        readonly name: "Abalone";
        readonly price: 500000;
    };
}>;
export declare const headstockOverlay: Readonly<{
    readonly pvc: {
        readonly name: "PVC";
        readonly price: 50000;
    };
    readonly "pvc-black": {
        readonly name: "PVC Black";
        readonly price: 50000;
    };
    readonly rosewood: {
        readonly name: "Rosewood";
        readonly price: 75000;
    };
    readonly "plain-maple": {
        readonly name: "Plain Maple";
        readonly price: 75000;
    };
}>;
export declare const bodyLogo: Readonly<{
    readonly stranough: {
        readonly name: "Stranough";
    };
    readonly "small-decal-logo": {
        readonly name: "Small Decal Logo";
        readonly price: 100000;
    };
    readonly "large-decal-logo": {
        readonly name: "Large Decal Logo";
        readonly price: 150000;
    };
    readonly "small-engrave-logo": {
        readonly name: "Small Engrave Logo";
        readonly price: 150000;
    };
    readonly "large-engrave-logo": {
        readonly name: "Large Engrave Logo";
        readonly price: 150000;
    };
}>;
export declare const headstockLogo: Readonly<{
    readonly stranough: {
        readonly name: "Stranough";
    };
    readonly "decal-logo": {
        readonly name: "Decal Logo";
        readonly price: 100000;
    };
    readonly "laser-engrave-logo": {
        readonly name: "Laser Engrave Logo";
        readonly price: 125000;
    };
    readonly pearloid: {
        readonly name: "Pearloid";
        readonly price: 200000;
    };
    readonly "mother-of-pearl": {
        readonly name: "Mother of Pearl";
        readonly price: 600000;
    };
    readonly abalone: {
        readonly name: "Abalone";
        readonly price: 600000;
    };
}>;
export declare const neckWoods: Readonly<{
    readonly mahogany: {
        readonly name: "Mahogany";
        readonly price: 850000;
    };
    readonly "plain-maple": {
        readonly name: "Plain Maple";
        readonly price: 950000;
    };
    readonly walnut: {
        readonly name: "Walnut";
        readonly price: 1100000;
    };
    readonly rosewood: {
        readonly name: "Rosewood";
        readonly price: 1200000;
    };
    readonly "quartersawn-maple": {
        readonly name: "Quartersawn Maple";
        readonly price: 1200000;
    };
    readonly "roasted-maple": {
        readonly name: "Roasted Maple";
        readonly price: 1350000;
    };
    readonly ebony: {
        readonly name: "Ebony";
        readonly price: 2000000;
    };
    readonly "flamed-maple": {
        readonly name: "Flamed Maple";
        readonly price: 2450000;
    };
    readonly "bird-eyes-maple": {
        readonly name: "Bird Eyes Maple";
        readonly price: 2450000;
    };
    readonly "quilted-maple": {
        readonly name: "Quilted Maple";
        readonly price: 2450000;
    };
}>;
export declare const fretCount: Readonly<{
    readonly "19": {
        readonly name: "19";
        readonly value: 19;
    };
    readonly "20": {
        readonly name: "20";
        readonly value: 20;
    };
    readonly "21": {
        readonly name: "21";
        readonly value: 21;
    };
    readonly "22": {
        readonly name: "22";
        readonly value: 22;
    };
    readonly "24": {
        readonly name: "24";
        readonly value: 24;
    };
    readonly "26": {
        readonly name: "26";
        readonly value: 26;
        readonly price: 50000;
    };
    readonly "27": {
        readonly name: "27";
        readonly value: 27;
        readonly price: 50000;
    };
}>;
export declare const fingerboardWoods: Readonly<{
    readonly rosewood: {
        readonly name: "Rosewood";
        readonly price: 100000;
    };
    readonly "plain-maple": {
        readonly name: "Maple";
        readonly price: 300000;
    };
    readonly "roasted-maple": {
        readonly name: "Roasted Maple";
        readonly price: 450000;
    };
    readonly ebony: {
        readonly name: "Ebony";
        readonly price: 300000;
    };
    readonly "pau-ferro": {
        readonly name: "Pau Ferro";
        readonly price: 600000;
    };
    readonly "flamed-maple": {
        readonly name: "Flamed Maple";
        readonly price: 875000;
    };
    readonly "bird-eyes-maple": {
        readonly name: "Bird Eyes Maple";
        readonly price: 875000;
    };
    readonly "quilted-maple": {
        readonly name: "Quilted Maple";
        readonly price: 875000;
    };
}>;
export declare const fingerboardRadius: Readonly<{
    readonly "0": {
        readonly name: "Flat";
        readonly value: 0;
    };
    readonly "7.25": {
        readonly name: "7.25";
        readonly value: 7.25;
    };
    readonly "9.5": {
        readonly name: "9.5";
        readonly value: 9.5;
    };
    readonly "12": {
        readonly name: "12";
        readonly value: 12;
    };
    readonly "14": {
        readonly name: "14";
        readonly value: 14;
    };
    readonly "16": {
        readonly name: "16";
        readonly value: 16;
    };
    readonly "20": {
        readonly name: "20";
        readonly value: 20;
    };
    readonly compound: {
        readonly name: "Compound";
        readonly price: 125000;
    };
}>;
export declare const fingerboardEdge: Readonly<{
    readonly square: {
        readonly name: "Standard Square";
    };
    readonly semi: {
        readonly name: "Semi Rolled";
        readonly price: 75000;
    };
    readonly heavy: {
        readonly name: "Heavy Rolled";
        readonly price: 125000;
    };
}>;
export declare const sideInlay: Readonly<{
    readonly standard: {
        readonly name: "Standard";
    };
    readonly "glow-in-the-dark": {
        readonly name: "Glow in the Dark";
        readonly price: 85000;
    };
}>;

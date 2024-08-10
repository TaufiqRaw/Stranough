"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sideInlay = exports.fingerboardEdge = exports.fingerboardRadius = exports.fingerboardWoods = exports.fretCount = exports.neckWoods = exports.headstockLogo = exports.bodyLogo = exports.headstockOverlay = exports.bindings = exports.neckColorTypeToColorsMap = exports.bodyColorTypeToColorsMap = exports.neckColorType = exports.bodyColorType = exports.bodyCoreWoods = exports.trussRodPositions = exports.bodyTopWoods = exports.electricBodyTypes = exports.stringCounts = exports.scaleLengths = exports.TrussRodType = exports.guitarTypes = exports.neckProfiles = exports.burstTypes = exports.orientation = exports.pickguardMaterials = exports.nullableSelectedItem = exports.inlayTypes = exports.jackTypes = exports.selectedElectricItemNames = exports.mustImplementLabel = exports.electricItemLabels = exports.getGuitarCategory = exports.binaryOptions = exports.getValue = exports.asArray = void 0;
const colors_1 = require("./colors");
const electric_model_1 = require("./electric-model");
const R = __importStar(require("remeda"));
function asArray(obj) {
    return R.pipe(R.entries(obj), R.map(([key, value]) => ({
        key: key,
        name: value.name,
        price: value.price ?? 0,
    })));
}
exports.asArray = asArray;
function getValue(obj, key) {
    if (!key)
        return undefined;
    if (obj[key]) {
        return obj[key].value;
    }
    else {
        return undefined;
    }
}
exports.getValue = getValue;
exports.binaryOptions = Object.freeze({
    "yes": {
        name: "Yes",
        value: true,
    },
    "no": {
        name: "No",
        value: false,
    },
});
function getGuitarCategory(type) {
    switch (type) {
        case "electric-guitar":
        case "electric-bass":
            return "electric";
        case "acoustic-guitar":
        case "acoustic-bass":
            return "acoustic";
    }
}
exports.getGuitarCategory = getGuitarCategory;
exports.electricItemLabels = {
    guitarModel: "Bentuk dasar gitar",
    stringCount: "Jumlah senar",
    constructionMethod: "Metode konstruksi",
    scaleLength: "Panjang skala",
    bodyType: "Tipe body",
    topContour: "Kontur top",
    backContour: "Kontur back",
    bodyCoreWood: "Kayu inti body",
    bodyTopWood: "Kayu top body",
    topBinding: "Binding top",
    backBinding: "Binding back",
    bodyLogo: "Logo body",
    topBodyColorType: "Tipe warna top",
    topBodyColor: "Warna top",
    backBodyColorType: "Tipe warna back",
    backBodyColor: "Warna back",
    burstType: "Tipe burst",
    burstColor: "Warna burst",
    neckWood: "Kayu leher",
    neckProfile: "Profil leher",
    trussRodType: "Tipe truss rod",
    trussRodPosition: "Posisi truss rod",
    neckBinding: "Binding leher",
    carbonFiberRod: "Truss rod karbon",
    neckColorType: "Tipe warna leher",
    neckColor: "Warna leher",
    fingerboardWood: "Kayu fingerboard",
    sideInlay: "Inlay samping",
    fingerboardRadius: "Radius fingerboard",
    useFret: "Fret",
    fretCount: "Jumlah fret",
    fingerboardEdge: "Edge fingerboard",
    inlay: "Inlay",
    headstock: "Headstock",
    headstockOverlay: "Overlay headstock",
    headstockLogo: "Logo headstock",
    headstockBinding: "Binding headstock",
    peg: "Peg",
    nut: "Nut",
    pickguardMaterial: "Material pickguard",
    knob: "Knob",
    jack: "Jack",
    pickupConfiguration: "Konfigurasi pickup",
    bridgePickup: "Pickup bridge",
    neckPickup: "Pickup neck",
    middlePickup: "Pickup middle",
    bridge: "Bridge",
    bridge2: "Bridge 2",
};
exports.mustImplementLabel = ['bridge', 'bridgePickup', 'guitarModel', 'headstock', 'knob', 'middlePickup', 'neckPickup', 'nut', 'peg', 'bridge2'];
exports.selectedElectricItemNames = {
    backBinding: (item) => item ? exports.bindings[item].name : undefined,
    backContour: (item) => item ? electric_model_1.contourLabels[item] : undefined,
    backBodyColorType: (item) => item ? exports.bodyColorType[item].name : undefined,
    bodyCoreWood: (item) => item ? exports.bodyCoreWoods[item].name : undefined,
    bodyLogo: (item) => item ? exports.bodyLogo[item].name : undefined,
    bodyTopWood: (item) => item ? exports.bodyTopWoods[item].name : undefined,
    bodyType: (item) => item ? exports.electricBodyTypes[item].name : undefined,
    burstColor: (item) => item ? colors_1.burstColors[item].name : undefined,
    burstType: (item) => item ? exports.burstTypes[item].name : undefined,
    constructionMethod: (item) => item ? electric_model_1.constructionLabels[item] : undefined,
    fingerboardEdge: (item) => item ? exports.fingerboardEdge[item].name : undefined,
    fingerboardRadius: (item) => item ? exports.fingerboardRadius[item].name : undefined,
    fingerboardWood: (item) => item ? exports.fingerboardWoods[item].name : undefined,
    headstockBinding: (item) => item ? exports.bindings[item].name : undefined,
    headstockLogo: (item) => item ? exports.headstockLogo[item].name : undefined,
    headstockOverlay: (item) => item ? exports.headstockOverlay[item].name : undefined,
    neckBinding: (item) => item ? exports.bindings[item].name : undefined,
    neckColorType: (item) => item ? exports.bodyColorType[item].name : undefined,
    neckProfile: (item) => item ? exports.neckProfiles[item].name : undefined,
    neckWood: (item) => item ? exports.neckWoods[item].name : undefined,
    pickguardMaterial: (item) => item ? exports.pickguardMaterials[item].name : undefined,
    trussRodPosition: (item) => item ? exports.trussRodPositions.electric[item].name : undefined,
    trussRodType: (item) => item ? exports.TrussRodType[item].name : undefined,
    stringCount: (item) => item ? item.replace(/String/g, "Senar") : undefined,
    carbonFiberRod: (item) => item ? 'Pakai' : 'Tidak pakai',
    useFret: (item) => item ? 'Pakai' : 'Tidak pakai',
    pickupConfiguration: (item) => item,
    fretCount: (item) => item ? `${item} Fret` : undefined,
    scaleLength: (item) => item ? `${item}` : undefined,
    backBodyColor: (item) => item,
    topBodyColor: (item) => item,
    neckColor: (item) => item,
    sideInlay: (item) => item ? exports.sideInlay[item].name : undefined,
    inlay: (item) => item ? exports.inlayTypes[item].name : undefined,
    jack: (item) => item ? exports.jackTypes[item].name : undefined,
    topBinding: (item) => item ? exports.bindings[item].name : undefined,
    topBodyColorType: (item) => item ? exports.bodyColorType[item].name : undefined,
    topContour: (item) => item ? electric_model_1.contourLabels[item] : undefined,
};
exports.jackTypes = Object.freeze({
    "top": {
        name: "Top",
        price: 30000,
    },
    "top-plated": {
        name: "Top Plated",
        price: 50000,
    },
    "side": {
        name: "Side",
        price: 50000,
    },
});
exports.inlayTypes = Object.freeze({
    "pvc-dot": {
        name: "PVC Dot",
    },
    "pearloid-dot": {
        name: "Pearloid Dot",
    },
    // "mother-of-pearl-dot" : {
    //   name : "Mother of Pearl Dot",
    //   price : 50000,
    // },
    "abalone-dot": {
        name: "Abalone Dot",
        price: 50000,
    },
    "glow-in-the-dark-dot": {
        name: "Glow in the Dark Dot",
        price: 100000,
    },
    "pearloid-block": {
        name: "Pearloid Block",
        price: 200000,
    }
});
// true means the key is nullable
// false means the key is sometimes nullable, this for programmer to implement the logic
// undefined means the key is required
exports.nullableSelectedItem = {
    common: {
        topBinding: true,
        backBinding: true,
        neckBinding: true,
        headstockBinding: true,
        headstockOverlay: true,
        sideInlay: true,
    },
    electric: {
        bodyTopWood: false,
    },
    acoustic: {}
};
exports.pickguardMaterials = Object.freeze({
    "1-ply-black-pvc": {
        name: "1 Ply Black PVC",
        price: {
            small: 115000,
            medium: 165000,
            large: 205000,
        }
    },
    "1-ply-white-pvc": {
        name: "1 Ply White PVC",
        price: {
            small: 115000,
            medium: 165000,
            large: 205000,
        }
    },
    "1-ply-ivory-pvc": {
        name: "1 Ply Ivory PVC",
        price: {
            small: 115000,
            medium: 165000,
            large: 205000,
        }
    },
    "3-ply-black-pvc": {
        name: "3 Ply Black PVC",
        price: {
            small: 125000,
            medium: 205000,
            large: 255000,
        }
    },
    "3-ply-white-pvc": {
        name: "3 Ply White PVC",
        price: {
            small: 125000,
            medium: 205000,
            large: 255000,
        }
    },
    "1-ply-red-pvc": {
        name: "1 Ply Red PVC",
        price: {
            small: 115000,
            medium: 165000,
            large: 205000,
        }
    },
    "1-ply-blue-pvc": {
        name: "1 Ply Blue PVC",
        price: {
            small: 115000,
            medium: 165000,
            large: 205000,
        }
    },
    "1-ply-transparent-acrylic": {
        name: "1 Ply Transparent Acrylic",
        price: {
            small: 115000,
            medium: 165000,
            large: 205000,
        }
    },
    "3-ply-white-pearloid": {
        name: "3 Ply White Pearloid",
        price: {
            small: 150000,
            medium: 230000,
            large: 280000,
        }
    },
    "3-ply-tortoise": {
        name: "3 Ply Tortoise Celluloid",
        price: {
            small: 150000,
            medium: 230000,
            large: 280000,
        }
    },
    "3-ply-red-pearloid": {
        name: "3 Ply Red Pearloid",
        price: {
            small: 150000,
            medium: 230000,
            large: 280000,
        }
    },
    "3-ply-ivory-pearloid": {
        name: "3 Ply Ivory Pearloid",
        price: {
            small: 150000,
            medium: 230000,
            large: 280000,
        }
    },
    "3-ply-black-pearloid": {
        name: "3 Ply Black Pearloid",
        price: {
            small: 150000,
            medium: 230000,
            large: 280000,
        }
    },
    "3-ply-blue-pearloid": {
        name: "3 Ply Blue Pearloid",
        price: {
            small: 150000,
            medium: 230000,
            large: 280000,
        }
    },
    "3-ply-green-pearloid": {
        name: "3 Ply Green Pearloid",
        price: {
            small: 150000,
            medium: 230000,
            large: 280000,
        }
    },
    "2-ply-chrome-mirror": {
        name: "2 Ply Chrome Mirror",
        price: {
            small: 150000,
            medium: 230000,
            large: 280000,
        }
    },
    "2-ply-red-mirror": {
        name: "2 Ply Red Mirror",
        price: {
            small: 150000,
            medium: 230000,
            large: 280000,
        }
    },
    "2-ply-blue-mirror": {
        name: "2 Ply Blue Mirror",
        price: {
            small: 150000,
            medium: 230000,
            large: 280000,
        }
    },
    "rosewood-veneer": {
        name: "Rosewood Veneer",
        price: {
            small: 190000,
            medium: 255000,
            large: 305000,
        }
    },
    "quilted-maple-veneer": {
        name: "Quilted Maple Veneer",
        price: {
            small: 190000,
            medium: 255000,
            large: 305000,
        }
    },
    "flamed-maple-veneer": {
        name: "Flamed Maple Veneer",
        price: {
            small: 215000,
            medium: 305000,
            large: 355000,
        }
    },
    "diamond-plate-1-plate": {
        name: "Diamond Plate 1 Plate",
        price: {
            small: 265000,
            medium: 355000,
            large: 405000,
        }
    },
    "diamond-plate-2-plate": {
        name: "Diamond Plate 2 Plate",
        price: {
            small: 265000,
            medium: 355000,
            large: 405000,
        }
    },
    "diamond-style-artificial": {
        name: "Diamond Style Artificial",
        price: {
            small: 190000,
            medium: 255000,
            large: 305000,
        }
    },
    "2-ply-gold-mirror": {
        name: "2 Ply Gold Mirror",
        price: {
            small: 185000,
            medium: 265000,
            large: 315000,
        }
    },
});
exports.orientation = Object.freeze({
    "right-handed": {
        name: "Right Handed",
    },
    "left-handed": {
        name: "Left Handed",
        price: 250000,
    },
});
exports.burstTypes = Object.freeze({
    "top": {
        name: "Top",
        price: 200000,
    },
    "top-back": {
        name: "Top & Back",
        price: 250000,
    },
});
exports.neckProfiles = Object.freeze({
    "c": {
        name: "C",
    },
    "d": {
        name: "D",
    },
    "v": {
        name: "V",
    },
    "u": {
        name: "U",
    },
    "asymmetric": {
        name: "Asymmetric",
        price: 200000,
    },
});
exports.guitarTypes = Object.freeze({
    "electric-guitar": {
        name: "Gitar Listrik",
    },
    "electric-bass": {
        name: "Bass Listrik",
    },
    "acoustic-guitar": {
        name: "Gitar Akustik",
    },
    "acoustic-bass": {
        name: "Bass Akustik",
    },
});
exports.TrussRodType = Object.freeze({
    "single-action": {
        name: "Single Action",
        price: 45000
    },
    "double-action": {
        name: "Double Action",
        price: 75000
    },
});
exports.scaleLengths = Object.freeze({
    "electric-guitar": {
        "24": {
            name: "24",
            value: 24,
        },
        "24.75": {
            name: "24.75",
            value: 24.75,
        },
        "25": {
            name: "25",
            value: 25,
        },
        "25.5": {
            name: "25.5",
            value: 25.5,
        },
        "Baritone (27\"-30\")": {
            name: "Baritone (27\"-30\")",
            value: 27,
            price: 150000,
        },
        "multi-Scale": {
            name: "Multi-Scale",
            value: "multi-scale",
            price: 250000,
        },
    },
    "electric-bass": {
        "30": {
            name: "30",
            value: 30,
        },
        "32": {
            name: "32",
            value: 32,
        },
        "34": {
            name: "34",
            value: 34,
        },
        "35": {
            name: "35",
            value: 35,
        },
        "38": {
            name: "38",
            value: 38,
        },
        "multi-Scale": {
            name: "Multi-Scale",
            value: "multi-scale",
        },
    },
    "acoustic-guitar": {
        "Classical 650mm": {
            name: "Classical 650mm",
            value: 25.6,
        },
        "Classical 660mm": {
            name: "Classical 660mm",
            value: 25.98,
        },
        "23": {
            name: "23",
            value: 23,
        },
        "24": {
            name: "24",
            value: 24,
        },
        "24,75": {
            name: "24.75",
            value: 24.75,
        },
        "24,9": {
            name: "24.9",
            value: 24.9,
        },
        "25": {
            name: "25",
            value: 25,
        },
        "25,4": {
            name: "25.4",
            value: 25.4,
        },
        "25,5": {
            name: "25.5",
            value: 25.5,
        },
        "25,625": {
            name: "25.625",
            value: 25.625,
        },
    },
    "acoustic-bass": {
        "30": {
            name: "30",
            value: 30,
        },
        "32": {
            name: "32",
            value: 32,
        },
        "34": {
            name: "34",
            value: 34,
        },
        "35": {
            name: "35",
            value: 35,
        },
        "38": {
            name: "38",
            value: 38,
        },
    },
});
exports.stringCounts = Object.freeze({
    "electric-guitar": {
        "6 String": {
            name: "6 String",
            value: 6,
        },
        "7 String": {
            name: "7 String",
            value: 7,
            price: 250000,
        },
        "8 String": {
            name: "8 String",
            value: 8,
            price: 500000,
        },
        "12 String": {
            name: "12 String",
            value: 12,
            price: 500000,
        },
    },
    "acoustic-guitar": {
        "6 String": {
            name: "6 String",
            value: 6,
        },
        "12 String": {
            name: "12 String",
            value: 12,
        },
    },
    "electric-bass": {
        "4 String": {
            name: "4 String",
            value: 4,
        },
        "5 String": {
            name: "5 String",
            value: 5,
        },
        "6 String": {
            name: "6 String",
            value: 6,
        },
    },
    "acoustic-bass": {
        "4 String": {
            name: "4 String",
            value: 4,
        },
    },
});
exports.electricBodyTypes = Object.freeze({
    "solid": {
        name: "Solid",
    },
    "chambered": {
        name: "Chambered",
        price: 400000,
    },
    "semi-hollow": {
        name: "Semi Hollow",
        price: 400000
    },
    "hollow": {
        name: "Hollow",
        price: 500000,
    },
});
exports.bodyTopWoods = Object.freeze({
    "laminated-rosewood": {
        name: "Laminated Rosewood",
        price: 250000,
    },
    "laminated-plain-maple": {
        name: "Laminated Plain Maple",
        price: 250000,
    },
    "laminated-walnut": {
        name: "laminated Walnut",
        price: 250000,
    },
    "laminated-flamed-maple": {
        name: "Laminated Flamed Maple",
        price: 250000,
    },
    "laminated-quilted-maple": {
        name: "Laminated Quilted Maple",
        price: 300000,
    },
    "laminated-amboyna-burl": {
        name: "Laminated Spalted / Burl",
        price: 300000,
    },
    "solid-mahogany": {
        name: "Solid Mahogany",
        price: 400000,
    },
    "solid-white-ash": {
        name: "Solid White Ash",
        price: 650000,
    },
    "solid-swamp-ash": {
        name: "Solid Swamp Ash",
        price: 800000,
    },
    "solid-alder": {
        name: "Solid Alder",
        price: 600000,
    },
    "solid-hard-maple": {
        name: "Solid Hard Maple",
        price: 600000,
    },
    "solid-walnut": {
        name: "Solid Walnut",
        price: 600000,
    },
    "solid-rosewood": {
        name: "Solid Rosewood",
        price: 750000,
    },
    "solid-flamed-mango": {
        name: "Solid Flamed Mango",
        price: 750000,
    },
    "solid-spalted-tamarind": {
        name: "Solid Spalted Tamarind",
        price: 850000,
    },
    "solid-amboyna-burl": {
        name: "Solid Amboyna Burl",
        price: 1500000,
    },
    "solid-flamed-maple": {
        name: "Solid Flamed Maple",
        price: 3500000,
    },
    "solid-quilted-maple": {
        name: "Solid Quilted Maple",
        price: 3750000,
    },
    "solid-spalted-maple": {
        name: "Solid Spalted Maple",
        price: 3750000,
    },
    "solid-korina-white": {
        name: "Solid Korina White",
        price: 3750000,
    },
    "solid-korina-black": {
        name: "Solid Korina Black",
        price: 3750000,
    },
});
exports.trussRodPositions = Object.freeze({
    electric: {
        "headstock": {
            name: "Headstock",
        },
        "heel": {
            name: "Heel",
        },
        "spoke-wheel": {
            name: "Spoke Wheel",
            price: 100000,
        },
    },
    acoustic: {
        "headstock": {
            name: "Headstock",
        },
        "heel": {
            name: "Heel",
        },
    },
});
exports.bodyCoreWoods = Object.freeze({
    "mahogany": {
        name: "Mahogany",
        price: 800000,
    },
    "1-piece-mahogany": {
        name: "1 Piece Mahogany",
        price: 950000,
    },
    "hard-maple": {
        name: "Hard Maple",
        price: 1000000,
    },
    "walnut": {
        name: "Walnut",
        price: 1000000,
    },
    "alder": {
        name: "Alder",
        price: 1000000,
    },
    "white-ash": {
        name: "White Ash",
        price: 1000000,
    },
    "swamp-ash": {
        name: "Swamp Ash",
        price: 1200000,
    },
    "rosewood": {
        name: "Rosewood",
        price: 1200000,
    },
    "korina-white": {
        name: "Korina White",
        price: 1200000,
    },
    "korina-black": {
        name: "Korina Black",
        price: 1200000,
    },
});
exports.bodyColorType = Object.freeze({
    "solid": {
        name: "Solid",
        price: 150000,
    },
    "transparent": {
        name: "Transparent",
        price: 150000,
    },
    "metallic": {
        name: "Metallic",
        price: 350000,
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
});
exports.neckColorType = Object.freeze({
    "solid": {
        name: "Solid",
        price: 150000,
    },
    "transparent": {
        name: "Transparent",
        price: 150000,
    },
    "metallic": {
        name: "Metallic",
        price: 350000,
    },
});
exports.bodyColorTypeToColorsMap = Object.freeze({
    "solid": colors_1.solidColors,
    "transparent": colors_1.solidColors,
    "metallic": colors_1.metallicColors
});
exports.neckColorTypeToColorsMap = Object.freeze({
    "solid": colors_1.solidColors,
    "transparent": colors_1.solidColors,
    "metallic": colors_1.metallicColors
});
exports.bindings = Object.freeze({
    "1-ply-pvc": {
        name: "1 Ply PVC",
        price: 75000,
    },
    "3-ply-pvc": {
        name: "3 Ply PVC",
        price: 125000,
    },
    "5-ply-pvc": {
        name: "5 Ply PVC",
        price: 175000,
    },
    "pearloid": {
        name: "Pearloid",
        price: 150000,
    },
    "synthetic-abalone": {
        name: "Synthetic Abalone",
        price: 150000,
    },
    "wood-purfling": {
        name: "Wood Purfling",
        price: 175000,
    },
    "herringbone-purfling": {
        name: "Herringbone Purfling",
        price: 200000,
    },
    "mother-of-pearl": {
        name: "Mother of Pearl",
        price: 500000,
    },
    "abalone": {
        name: "Abalone",
        price: 500000,
    },
});
exports.headstockOverlay = Object.freeze({
    "pvc": {
        name: "PVC",
        price: 50000
    },
    "rosewood": {
        name: "Rosewood",
        price: 75000,
    },
    "plain-maple": {
        name: "Plain Maple",
        price: 75000,
    },
    // "custom": {
    //   name : "Custom",
    // },
});
exports.bodyLogo = Object.freeze({
    "stranough": {
        name: "Stranough",
    },
    "small-decal-logo": {
        name: "Small Decal Logo",
        price: 100000
    },
    "large-decal-logo": {
        name: "Large Decal Logo",
        price: 150000
    },
    "small-engrave-logo": {
        name: "Small Engrave Logo",
        price: 150000
    },
    "large-engrave-logo": {
        name: "Large Engrave Logo",
        price: 150000
    },
    // "custom": {
    //   name : "Custom",
    // },
});
exports.headstockLogo = Object.freeze({
    "stranough": {
        name: "Stranough",
    },
    "decal-logo": {
        name: "Decal Logo",
        price: 100000
    },
    "laser-engrave-logo": {
        name: "Laser Engrave Logo",
        price: 125000
    },
    "pearloid": {
        name: "Pearloid",
        price: 200000
    },
    "mother-of-pearl": {
        name: "Mother of Pearl",
        price: 600000
    },
    "abalone": {
        name: "Abalone",
        price: 600000
    },
    // "custom": {
    //   name : "Custom",
    // },
});
exports.neckWoods = Object.freeze({
    "mahogany": {
        name: "Mahogany",
        price: 850000,
    },
    "plain-maple": {
        name: "Plain Maple",
        price: 950000,
    },
    "walnut": {
        name: "Walnut",
        price: 1100000,
    },
    "rosewood": {
        name: "Rosewood",
        price: 1200000,
    },
    "quartersawn-maple": {
        name: "Quartersawn Maple",
        price: 1200000,
    },
    "roasted-maple": {
        name: "Roasted Maple",
        price: 1350000,
    },
    "ebony": {
        name: "Ebony",
        price: 2000000,
    },
    "flamed-maple": {
        name: "Flamed Maple",
        price: 2450000,
    },
    "bird-eyes-maple": {
        name: "Bird Eyes Maple",
        price: 2450000,
    },
    "quilted-maple": {
        name: "Quilted Maple",
        price: 2450000,
    },
});
exports.fretCount = Object.freeze({
    "19": {
        name: "19",
        value: 19,
    },
    "20": {
        name: "20",
        value: 20,
    },
    "21": {
        name: "21",
        value: 21,
    },
    "22": {
        name: "22",
        value: 22,
    },
    "24": {
        name: "24",
        value: 24,
    },
    "26": {
        name: "26",
        value: 26,
        price: 50000,
    },
    "27": {
        name: "27",
        value: 27,
        price: 50000,
    },
});
exports.fingerboardWoods = Object.freeze({
    "rosewood": {
        name: "Rosewood",
        price: 100000,
    },
    "plain-maple": {
        name: "Maple",
        price: 300000,
    },
    "roasted-maple": {
        name: "Roasted Maple",
        price: 450000,
    },
    "ebony": {
        name: "Ebony",
        price: 300000,
    },
    "pau-ferro": {
        name: "Pau Ferro",
        price: 600000,
    },
    "flamed-maple": {
        name: "Flamed Maple",
        price: 875000,
    },
    "bird-eyes-maple": {
        name: "Bird Eyes Maple",
        price: 875000,
    },
    "quilted-maple": {
        name: "Quilted Maple",
        price: 875000,
    },
});
exports.fingerboardRadius = Object.freeze({
    "0": {
        name: "Flat",
        value: 0,
    },
    "7.25": {
        name: "7.25",
        value: 7.25,
    },
    "9.5": {
        name: "9.5",
        value: 9.5,
    },
    "12": {
        name: "12",
        value: 12,
    },
    "14": {
        name: "14",
        value: 14,
    },
    "16": {
        name: "16",
        value: 16,
    },
    "20": {
        name: "20",
        value: 20,
    },
    "compound": {
        name: "Compound",
        price: 125000,
    },
});
exports.fingerboardEdge = Object.freeze({
    "square": {
        name: "Standard Square",
    },
    "semi": {
        name: "Semi Rolled",
        price: 75000,
    },
    "heavy": {
        name: "Heavy Rolled",
        price: 125000,
    },
});
exports.sideInlay = Object.freeze({
    "standard": {
        name: "Standard",
    },
    "glow-in-the-dark": {
        name: "Glow in the Dark",
        price: 85000,
    },
});
//# sourceMappingURL=guitar-builder.js.map
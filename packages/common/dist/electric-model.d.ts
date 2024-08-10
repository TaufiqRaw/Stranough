export declare const spawnPointKeys: readonly ["knobSpawnPoint", "bridgeSpawnPoint", "pickupSpawnPoint", "switchSpawnPoint", "topJackSpawnPoint", "sideJackSpawnPoint", "fingerboardSpawnPoint", "fingerboardBackEndSpawnPoint", "pickguardSpawnPoint", "soundHoleSpawnPointLeft", "soundHoleSpawnPointRight", "electronicsSpawnPoint", "minorElectronicCoverSpawnPoint", "batteryCoverSpawnPoint", "logoSpawnPoint", undefined, "topSpawnPoint", "bottomSpawnPoint"];
export declare const constructionKeys: readonly ["boltOnConstruction", "setInConstruction", "neckThroughConstruction"];
export declare const constructionPrice: Readonly<{
    readonly boltOnConstruction: 0;
    readonly setInConstruction: 0;
    readonly neckThroughConstruction: 850000;
}>;
export declare const constructionLabels: Readonly<{
    readonly boltOnConstruction: "Bolt On";
    readonly setInConstruction: "Set In";
    readonly neckThroughConstruction: "Neck Through";
}>;
export declare const topContourKeys: readonly ["flatContour", "carvedContour", "forearmContour"];
export declare const backContourKeys: readonly ["flatContour", "carvedContour", "tummyContour"];
export declare const contourKeys: ("flatContour" | "carvedContour" | "forearmContour" | "tummyContour")[];
export declare const backContourPrice: Readonly<{
    readonly flatContour: 0;
    readonly carvedContour: 200000;
    readonly tummyContour: 75000;
}>;
export declare const topContourPrice: Readonly<{
    readonly flatContour: 0;
    readonly carvedContour: 200000;
    readonly forearmContour: 75000;
}>;
export declare const contourOverlayKeys: ("flatContourOverlay" | "carvedContourOverlay" | "forearmContourOverlay" | "tummyContourOverlay")[];
export declare const contourLabels: Readonly<{
    readonly flatContour: "Flat";
    readonly carvedContour: "Carved";
    readonly tummyContour: "Tummy";
    readonly forearmContour: "Forearm";
}>;

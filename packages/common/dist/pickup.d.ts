export declare enum PickupType {
    Single = "single",
    Humbucker = "humbucker",
    P90 = "p90",
    Jazz = "jazz",
    Piezo = "piezo",
    SoapBar = "soapbar",
    MusicMan = "musicman"
}
export declare const pickupConfigurations: Readonly<{
    readonly "electric-guitar": Readonly<{
        readonly S: readonly [PickupType.Single];
        readonly 'S-S': readonly [PickupType.Single, PickupType.Single];
        readonly 'S-S-S': readonly [PickupType.Single, PickupType.Single, PickupType.Single];
        readonly H: readonly [PickupType.Humbucker];
        readonly 'H-H': readonly [PickupType.Humbucker, PickupType.Humbucker];
        readonly 'H-S': readonly [PickupType.Humbucker, PickupType.Single];
        readonly 'H-S-S': readonly [PickupType.Humbucker, PickupType.Single, PickupType.Single];
        readonly 'H-S-H': readonly [PickupType.Humbucker, PickupType.Single, PickupType.Humbucker];
        readonly 'H-H-H': readonly [PickupType.Humbucker, PickupType.Humbucker, PickupType.Humbucker];
        readonly P90: readonly [PickupType.P90];
        readonly 'P90-P90': readonly [PickupType.P90, PickupType.P90];
    }>;
    readonly "electric-bass": Readonly<{
        J: PickupType[];
        'J-J': PickupType[];
        P: PickupType[];
        'P-P': PickupType[];
        'P-J': PickupType[];
        '1 Soap Bar': PickupType[];
        '2 Soap Bar': PickupType[];
        '1 MM': PickupType[];
        '2 MM': PickupType[];
    }>;
}>;

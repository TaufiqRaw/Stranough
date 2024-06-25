export declare enum PickupType {
    Single = "single",
    Humbucker = "humbucker",
    P90 = "p90"
}
export declare const pickupConfigurations: readonly [readonly [PickupType.Single], readonly [PickupType.Single, PickupType.Single], readonly [PickupType.Single, PickupType.Single, PickupType.Single], readonly [PickupType.Humbucker], readonly [PickupType.Humbucker, PickupType.Single], readonly [PickupType.Humbucker, PickupType.Humbucker], readonly [PickupType.Humbucker, PickupType.Single, PickupType.Single], readonly [PickupType.Humbucker, PickupType.Single, PickupType.Humbucker], readonly [PickupType.Humbucker, PickupType.Humbucker, PickupType.Humbucker], readonly [PickupType.P90], readonly [PickupType.P90, PickupType.P90]];

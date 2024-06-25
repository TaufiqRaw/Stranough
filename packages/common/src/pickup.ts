export enum PickupType {
  Single = 'single',
  Humbucker = 'humbucker',
  P90 = 'p90',
  // Filtertron = 'filtertron',
  // WideRange = 'wide-range'
}

export const pickupConfigurations = Object.freeze([
  [PickupType.Single],
  [PickupType.Single, PickupType.Single],
  [PickupType.Single, PickupType.Single, PickupType.Single],
  [PickupType.Humbucker],
  [PickupType.Humbucker, PickupType.Single],
  [PickupType.Humbucker, PickupType.Humbucker],
  [PickupType.Humbucker, PickupType.Single, PickupType.Single],
  [PickupType.Humbucker, PickupType.Single, PickupType.Humbucker],
  [PickupType.Humbucker, PickupType.Humbucker, PickupType.Humbucker],
  [PickupType.P90],
  [PickupType.P90, PickupType.P90],
] as const)
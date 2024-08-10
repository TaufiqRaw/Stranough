import * as R from 'remeda';

export enum PickupType {
  Single = 'single',
  Humbucker = 'humbucker',
  P90 = 'p90',
  Jazz = 'jazz',
  Piezo = 'piezo',
  SoapBar = 'soapbar',
  MusicMan = 'musicman',
  // Filtertron = 'filtertron',
  // WideRange = 'wide-range'
}

export const pickupConfigurations = Object.freeze({
  ['electric-guitar']: Object.freeze({
    'S' : [PickupType.Single],
    'S-S' : [PickupType.Single, PickupType.Single],
    'S-S-S' : [PickupType.Single, PickupType.Single, PickupType.Single],
    'H' : [PickupType.Humbucker],
    'H-H' : [PickupType.Humbucker, PickupType.Humbucker],
    'H-S' : [PickupType.Humbucker, PickupType.Single],
    'H-S-S' : [PickupType.Humbucker, PickupType.Single, PickupType.Single],
    'H-S-H' : [PickupType.Humbucker, PickupType.Single, PickupType.Humbucker],
    'H-H-H' : [PickupType.Humbucker, PickupType.Humbucker, PickupType.Humbucker],
    'P90' : [PickupType.P90],
    'P90-P90' : [PickupType.P90, PickupType.P90],
  } as const),
  ['electric-bass']: Object.freeze({
    'J' : [PickupType.Jazz],
    'J-J' : [PickupType.Jazz, PickupType.Jazz],
    'P' : [PickupType.Piezo],
    'P-P' : [PickupType.Piezo, PickupType.Piezo],
    'P-J' : [PickupType.Piezo, PickupType.Jazz],
    '1 Soap Bar' : [PickupType.SoapBar],
    '2 Soap Bar' : [PickupType.SoapBar, PickupType.SoapBar],
    '1 MM' : [PickupType.MusicMan],
    '2 MM' : [PickupType.MusicMan, PickupType.MusicMan],
  })
} as const);
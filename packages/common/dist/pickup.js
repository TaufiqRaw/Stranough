"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickupConfigurations = exports.PickupType = void 0;
var PickupType;
(function (PickupType) {
    PickupType["Single"] = "single";
    PickupType["Humbucker"] = "humbucker";
    PickupType["P90"] = "p90";
    // Filtertron = 'filtertron',
    // WideRange = 'wide-range'
})(PickupType || (exports.PickupType = PickupType = {}));
exports.pickupConfigurations = Object.freeze([
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
]);
//# sourceMappingURL=pickup.js.map
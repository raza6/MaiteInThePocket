/* eslint-disable no-unused-vars */
enum EVolumeUnit {
    teaspoon = 'teaspoon',
    tablespoon = 'tablespoon',
    ml = 'ml',
    cl = 'cl',
    dl = 'dl',
    l = 'l'
}

enum EMassUnit {
    g = 'g', kg = 'kg'
}

enum ELengthUnit {
    mm = 'mm', cm = 'cm', m = 'm'
}

enum ETemperatureUnit {
    fahrenheit = 'fahrenheit', celsius = 'celsius', thermostat = 'thermostat'
}

type EUnit = EVolumeUnit | EMassUnit | ELengthUnit | ETemperatureUnit;

export {
  EVolumeUnit, EMassUnit, ELengthUnit, ETemperatureUnit, EUnit,
};

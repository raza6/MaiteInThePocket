enum EVolumeUnit {
    teaspoon, tablespoon, ml, cl, dl, l
}

enum EMassUnit {
    g, kg
}

enum ELengthUnit {
    mm, cm, m
}

enum ETemperatureUnit {
    fahrenheit, celsius, thermostat
}

type EUnit = EVolumeUnit | EMassUnit | ELengthUnit | ETemperatureUnit;

export { EVolumeUnit, EMassUnit, ELengthUnit, ETemperatureUnit, EUnit };
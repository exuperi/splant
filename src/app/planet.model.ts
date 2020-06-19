export interface IPlanet {
    id: number;
    name: string;
    rotation_period: number;
    orbital_period: number;
    diameter: number;
    climate: string;
    gravity: string;
    terrain: string;
    surface_water: number;
    population: number;
    page?: number;
}

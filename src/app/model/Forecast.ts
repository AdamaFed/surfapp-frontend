import {Spot} from "./Spot";

export interface Forecast {
  id?: number,
  spot: Spot,
  wind: {
    speed: number,
    direction: number,
  }
  waves: {
    direction: number,
    height: number,
  }
}

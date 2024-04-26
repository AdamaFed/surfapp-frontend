export interface WaveData {
  latitude?: number;
  longitude?: number;
  generationtime_ms?: number;
  utc_offset_seconds?: number;
  timezone?: string;
  timezone_abbreviation?: string;
  elevation?: number;
  hourly_units?: {
    time?: string;
    wave_height?: string;
    wave_direction?: string;
  };
  hourly: {
    time: string[];
    wave_height: number[];
    wave_direction: number[];
  };
}

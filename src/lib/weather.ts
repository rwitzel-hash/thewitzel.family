export type DailyForecast = {
  date: string;
  high: number;
  low: number;
  precipChance: number;
  weatherCode: number;
};

export type WeatherForecast = {
  currentTemp: number;
  weatherCode: number;
  /** Current wind, miles per hour. Null when the feed omits it. */
  windMph: number | null;
  days: DailyForecast[];
};

function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌦️";
  if (code <= 86) return "❄️";
  return "⛈️";
}

export function weatherCodeEmoji(code: number): string {
  return weatherEmoji(code);
}

export function weatherCodeLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

export async function getWeatherForecast(options: {
  latitude: number;
  longitude: number;
  timezone?: string;
}): Promise<WeatherForecast | null> {
  const timezone = encodeURIComponent(options.timezone ?? "America/Denver");
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${options.latitude}` +
    `&longitude=${options.longitude}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&temperature_unit=fahrenheit` +
    `&wind_speed_unit=mph` +
    `&timezone=${timezone}` +
    `&forecast_days=5`;

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      current?: {
        temperature_2m?: number;
        weather_code?: number;
        wind_speed_10m?: number;
      };
      daily?: {
        time?: string[];
        weather_code?: number[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_probability_max?: number[];
      };
    };

    const times = data.daily?.time ?? [];
    const days: DailyForecast[] = times.map((date, index) => ({
      date,
      high: Math.round(data.daily?.temperature_2m_max?.[index] ?? 0),
      low: Math.round(data.daily?.temperature_2m_min?.[index] ?? 0),
      precipChance: Math.round(
        data.daily?.precipitation_probability_max?.[index] ?? 0,
      ),
      weatherCode: data.daily?.weather_code?.[index] ?? 0,
    }));

    const wind = data.current?.wind_speed_10m;

    return {
      currentTemp: Math.round(data.current?.temperature_2m ?? 0),
      weatherCode: data.current?.weather_code ?? 0,
      windMph: wind == null ? null : Math.round(wind),
      days,
    };
  } catch {
    return null;
  }
}

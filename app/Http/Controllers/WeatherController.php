<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    private function resolveCoordinates(Request $request): array
    {
        $city = $request->query('city');
        $lat  = $request->query('lat');
        $lon  = $request->query('lon');

        if (empty($city) && (empty($lat) || empty($lon))) {
            abort(response()->json([
                'message' => 'Provide either city or both lat and lon parameters.',
            ], 422));
        }

        if (!empty($lat) && !empty($lon)) {
            return [
                'lat' => (float)$lat,
                'lon' => (float)$lon,
                'name' => null,
                'country' => null,
            ];
        }

        $resp = Http::get('https://geocoding-api.open-meteo.com/v1/search', [
            'name'     => $city,
            'count'    => 1,
            'format'   => 'json',
            'language' => 'en',
        ]);

        if ($resp->failed()) {
            abort(response()->json(['message' => 'Error occurred while geocoding.'], 502));
        }

        $json = $resp->json();
        if (empty($json['results'][0])) {
            abort(response()->json(['message' => 'City not found.'], 404));
        }

        $r = $json['results'][0];

        return [
            'lat' => (float)$r['latitude'],
            'lon' => (float)$r['longitude'],
            'name' => $r['name'] ?? $city,
            'country' => $r['country'] ?? null,
        ];
    }

    private function decodeWeatherCode(int $code): string
    {
        $map = [
            0 => 'Vedro',
            1 => 'Uglavnom vedro',
            2 => 'Delimično oblačno',
            3 => 'Oblačno',
            45 => 'Magla',
            48 => 'Magla s naslagama',
            51 => 'Slaba rosa',
            53 => 'Umerena rosa',
            55 => 'Jaka rosa',
            61 => 'Slaba kiša',
            63 => 'Umerena kiša',
            65 => 'Jaka kiša',
            71 => 'Slab sneg',
            73 => 'Umeren sneg',
            75 => 'Jak sneg',
            80 => 'Slabi pljuskovi',
            81 => 'Umereni pljuskovi',
            82 => 'Jaki pljuskovi',
            95 => 'Grmljavina',
            96 => 'Grmljavina s gradom',
            99 => 'Grmljavina s gradom',
        ];

        return $map[$code] ?? 'Nepoznat kod';
    }

    public function forecast(Request $request)
    {
        $loc = $this->resolveCoordinates($request);
        $lat = $loc['lat'];
        $lon = $loc['lon'];

        $resp = Http::get('https://api.open-meteo.com/v1/forecast', [
            'latitude'      => $lat,
            'longitude'     => $lon,
            'timezone'      => 'auto',
            'daily'         => 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max',
            'forecast_days' => 14,
        ]);

        if ($resp->failed()) {
            return response()->json(['message' => 'Error fetching forecast.'], 502);
        }

        $data  = $resp->json();
        $daily = $data['daily'] ?? [];

        $out = [];
        if (!empty($daily['time'])) {
            $n = count($daily['time']);
            for ($i = 0; $i < $n; $i++) {
                $code = $daily['weathercode'][$i] ?? null;

                $out[] = [
                    'date'         => $daily['time'][$i],
                    'temp_max_c'   => $daily['temperature_2m_max'][$i] ?? null,
                    'temp_min_c'   => $daily['temperature_2m_min'][$i] ?? null,
                    'precip_mm'    => $daily['precipitation_sum'][$i] ?? null,
                    'wind_max_ms'  => $daily['windspeed_10m_max'][$i] ?? null,
                    'weather_code' => $code,
                    'weather_text' => $code !== null ? $this->decodeWeatherCode($code) : null,
                ];
            }
        }

        return response()->json([
            'location' => [
                'lat'     => $lat,
                'lon'     => $lon,
                'name'    => $loc['name'],
                'country' => $loc['country'],
                'tz'      => $data['timezone'] ?? null,
            ],
            'daily'  => $out,
            'source' => 'Open-Meteo',
        ]);
    }
}

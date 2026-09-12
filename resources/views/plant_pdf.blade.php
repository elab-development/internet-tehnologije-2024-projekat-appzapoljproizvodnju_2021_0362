<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <title>Biljka PDF</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 30px;
            color: #222;
        }

        h1 {
            text-align: center;
            margin-bottom: 30px;
        }

        .stavka {
            margin-bottom: 12px;
            font-size: 16px;
        }

        .label {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Podaci o biljci</h1>

    <div class="stavka">
        <span class="label">Vrsta:</span> {{ $plant->variety }}
    </div>

    <div class="stavka">
        <span class="label">Lokacija:</span> {{ $plant->location ?? '-' }}
    </div>

    <div class="stavka">
        <span class="label">Datum sadnje:</span> {{ $plant->planted_on ? \Carbon\Carbon::parse($plant->planted_on)->format('d.m.Y.') : '-' }}
    </div>

    <div class="stavka">
        <span class="label">Aktivnost:</span>
        {{ $plant->is_active ? 'Aktivna' : 'Neaktivna' }}
    </div>

    <div class="stavka">
        <span class="label">Zdravstveno stanje:</span> {{ $plant->health_status ?? '-' }}
    </div>

    <div class="stavka">
        <span class="label">Broj zalivanja:</span> {{ $plant->watering_count }}
    </div>

    <div class="stavka">
        <span class="label">Poslednje zalivanje:</span> {{ $plant->last_watered_at ? \Carbon\Carbon::parse($plant->last_watered_at)->format('d.m.Y.') : '-' }}
    </div>

    <div class="stavka">
        <span class="label">Naredno zalivanje:</span> {{ $plant->next_watering_at ? \Carbon\Carbon::parse($plant->next_watering_at)->format('d.m.Y.') : '-' }}
    </div>

    <div class="stavka">
        <span class="label">Broj đubrenja:</span> {{ $plant->fertilizing_count }}
    </div>

    <div class="stavka">
        <span class="label">Poslednje đubrenje:</span> {{ $plant->last_fertilized_at ? \Carbon\Carbon::parse($plant->last_fertilized_at)->format('d.m.Y.') : '-' }}
    </div>

    <div class="stavka">
        <span class="label">Naredno đubrenje:</span> {{ $plant->next_fertilizing_at ? \Carbon\Carbon::parse($plant->next_fertilizing_at)->format('d.m.Y.') : '-' }}
    </div>
</body>
</html>

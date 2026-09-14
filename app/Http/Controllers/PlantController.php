<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Plant;
use Barryvdh\DomPDF\Facade\Pdf;
use OpenApi\Attributes as OA;

class PlantController extends Controller
{
    private const DB_CRITICAL_STATUS = 'kriticno stanje';

    public function index(Request $request)
    {
        $query = Plant::where('user_id', $request->user()->id);

        if ($request->has('sort') && $request->sort === 'planted_on') {
            $direction = $request->direction === 'asc' ? 'asc' : 'desc';
            $query->orderBy('planted_on', $direction);
        } else {
            $query->orderByDesc('created_at');
        }

        $plants = $query->paginate(10);

        return response()->json($plants);
    }

    public function store(Request $request)
    {
        $request = $this->normalizeHealthStatus($request);

        $data = $request->validate([
            'variety'             => 'required|string|max:255',
            'location'            => 'nullable|string|max:255',
            'planted_on'          => 'nullable|date',
            'health_status'       => 'nullable|string|in:dobro stanje,' . self::DB_CRITICAL_STATUS . ',biljka je uvenula',
            'is_active'           => 'nullable|boolean',
            'last_watered_at'     => 'nullable|date',
            'next_watering_at'    => 'nullable|date',
            'last_fertilized_at'  => 'nullable|date',
            'next_fertilizing_at' => 'nullable|date',
            'watering_count'      => 'nullable|integer|min:0',
            'fertilizing_count'   => 'nullable|integer|min:1',
            'notes'               => 'nullable|string|max:5000',
        ]);

        if (!empty($data['last_watered_at'])) {
            $data['next_watering_at'] = \Carbon\Carbon::parse($data['last_watered_at'])
                ->addDays(5)
                ->toDateString();
        }

        if (empty($data['last_fertilized_at']) && !empty($data['planted_on'])) {
            $data['last_fertilized_at'] = $data['planted_on'];
        }

        if (!empty($data['last_fertilized_at'])) {
            $data['next_fertilizing_at'] = \Carbon\Carbon::parse($data['last_fertilized_at'])
                ->addDays(14)
                ->toDateString();
        }

        $plant = Plant::create(array_merge([
            'is_active' => true,
            'health_status' => 'dobro stanje',
            'watering_count' => 0,
            'fertilizing_count' => 1,
        ], $data, [
            'user_id' => $request->user()->id,
        ]));

        return response()->json($plant, 201);
    }

    #[OA\Get(
        path: '/api/plants/{plant}',
        summary: 'Prikaz biljke',
        tags: ['Plants'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'plant',
                in: 'path',
                required: true,
                description: 'ID biljke',
                schema: new OA\Schema(type: 'integer'),
                example: 1
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'podaci o biljci'
            ),
            new OA\Response(
                response: 401,
                description: 'neautentifikovan korisnik'
            ),
            new OA\Response(
                response: 404,
                description: 'biljka nije pronađena'
            )
        ]
    )]

    public function show(Request $request, string $id)
    {
        $plant = Plant::findOrFail($id);
        $this->ensureOwner($request->user()->id, $plant->user_id);

        return response()->json($plant);
    }

    public function update(Request $request, string $id)
    {
        $plant = Plant::findOrFail($id);

        $this->ensureOwner($request->user()->id, $plant->user_id);
        $request = $this->normalizeHealthStatus($request);

        $data = $request->validate([
            'variety'              => 'sometimes|string|max:255',
            'location'             => 'sometimes|nullable|string|max:255',
            'planted_on'           => 'sometimes|nullable|date',
            'health_status'        => 'sometimes|nullable|string|in:dobro stanje,' . self::DB_CRITICAL_STATUS . ',biljka je uvenula',
            'is_active'            => 'sometimes|boolean',
            'last_watered_at'      => 'sometimes|nullable|date',
            'next_watering_at'     => 'sometimes|nullable|date',
            'last_fertilized_at'   => 'sometimes|nullable|date',
            'next_fertilizing_at'  => 'sometimes|nullable|date',
            'watering_count'       => 'sometimes|integer|min:0',
            'fertilizing_count'    => 'sometimes|integer|min:0',
            'notes'                => 'sometimes|nullable|string|max:5000',
        ]);
        
        if (!empty($data['last_watered_at'])) {
            $data['next_watering_at'] = \Carbon\Carbon::parse($data['last_watered_at'])
                ->addDays(5)
                ->toDateString();
        }

        if (!empty($data['last_fertilized_at'])) {
            $data['next_fertilizing_at'] = \Carbon\Carbon::parse($data['last_fertilized_at'])
                ->addDays(14)
                ->toDateString();
        }

        $plant->update($data);

        return response()->json($plant);
    }
    
    #[OA\Delete(
        path: '/api/plants/{plant}',
        summary: 'Brisanje biljke',
        tags: ['Plants'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'plant',
                in: 'path',
                required: true,
                description: 'ID biljke',
                schema: new OA\Schema(type: 'integer'),
                example: 1
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'biljka je obrisana'
            )
        ]
    )]

    public function destroy(Request $request, string $id)
    {
        $plant = Plant::findOrFail($id);

        $this->ensureOwner($request->user()->id, $plant->user_id);

        $plant->delete();

        return response()->json([
            'message' => 'Biljka je uspešno obrisana'
        ]);
    }

    private function ensureOwner(int $authUserId, int $ownerId): void
    {
        abort_if($authUserId !== $ownerId, 403, 'Forbidden');
    }

    private function normalizeHealthStatus(Request $request): Request
    {
        $value = $request->input('health_status');

        if (in_array($value, ['kriticno stanje', 'kriticno stanje', 'kritično stanje', 'kriti??no stanje'], true)) {
            $request->merge([
                'health_status' => self::DB_CRITICAL_STATUS,
            ]);
        }

        return $request;
    }

    public function downloadPdf(Request $request, string $id)
    {
        $plant = Plant::findOrFail($id);
        $this->ensureOwner($request->user()->id, $plant->user_id);

        $pdf = Pdf::loadView('plant_pdf', [
            'plant' => $plant,
        ]);

        return $pdf->download('plant_' . $plant->id . '.pdf');
    }

}




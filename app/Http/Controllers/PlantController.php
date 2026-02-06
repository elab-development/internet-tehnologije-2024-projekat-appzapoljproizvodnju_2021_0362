<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Plant;

class PlantController extends Controller
{

    public function index(Request $request)
    {
        $query = Plant::where('user_id', $request->user()->id);

        if ($request->has('sort') && $request->sort === 'planted_at') {
            $direction = $request->direction === 'asc' ? 'asc' : 'desc';
            $query->orderBy('planted_at', $direction);
        } else {
            $query->orderByDesc('created_at');
        }

        $plants = $query->paginate(10);

        return response()->json($plants);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'variety'        => 'required|string|max:255',
            'location'       => 'nullable|string|max:255',
            'planted_at'     => 'nullable|date',
            'health_status'  => 'nullable|string|in:dobro stanje,kritično stanje,biljka je uvenula',
            'is_active'      => 'boolean',
            'last_watered_at'     => 'nullable|date',
            'next_watering_at'    => 'nullable|date',
            'last_fertilized_at'  => 'nullable|date',
            'next_fertilizing_at' => 'nullable|date',
            'watering_count'      => 'nullable|integer|min:0',
            'fertilizing_count'   => 'nullable|integer|min:0',
            'notes'               => 'nullable|string|max:1000',
        ]);

        $plant = Plant::create(array_merge($data, [
            'user_id' => $request->user()->id,
        ]));

        return response()->json($plant, 201);
    }

    public function show(string $id)
    {
        $this->ensureOwner($request->user()->id, $plant->user_id);
        return response()->json($plant);
    }

    public function update(Request $request, string $id)
    {
        $this->ensureOwner($request->user()->id, $plant->user_id);

        $data = $request->validate([
            'variety'        => 'sometimes|string|max:255',
            'location'       => 'sometimes|nullable|string|max:255',
            'planted_at'     => 'sometimes|nullable|date',
            'health_status'  => 'sometimes|nullable|string|in:dobro stanje,kritično stanje,biljka je uvenula',
            'is_active'      => 'sometimes|boolean',
            'last_watered_at'     => 'sometimes|nullable|date',
            'next_watering_at'    => 'sometimes|nullable|date',
            'last_fertilized_at'  => 'sometimes|nullable|date',
            'next_fertilizing_at' => 'sometimes|nullable|date',
            'watering_count'      => 'sometimes|integer|min:0',
            'fertilizing_count'   => 'sometimes|integer|min:0',
            'notes'               => 'sometimes|nullable|string|max:5000',
        ]);

        $plant->update($data);
        return response()->json($plant);
    }

    public function destroy(string $id)
    {
        $this->ensureOwner($request->user()->id, $plant->user_id);
        $plant->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function ensureOwner(int $authUserId, int $ownerId): void
    {
        abort_if($authUserId !== $ownerId, 403, 'Forbidden');
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Activity;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $q = \App\Models\Activity::where('user_id', $request->user()->id);

        if ($request->filled('date')) {
            $q->whereDate('activity_date', $request->query('date'));
        }

        $q->orderBy('updated_at', 'desc');

        return response()->json($q->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'activity_date' => 'required|string|max:255', 
            'activity_type' => 'required|in:sadnja,zalivanje,djubrenje,obrezivanje,berba,presadjivanje,drugo',
        ]);

        $activity = \App\Models\Activity::create([
            'user_id'       => $request->user()->id,
            'activity_date' => $data['activity_date'],
            'activity_type' => $data['activity_type'],
        ]);

        return response()->json($activity, 201);
    }

    public function show(Request $request, \App\Models\Activity $activity)
    {
        if ($activity->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($activity);
    }

    public function update(Request $request, \App\Models\Activity $activity)
    {
        if ($activity->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'activity_date' => 'nullable|string|max:255',
            'activity_type' => 'sometimes|required|in:sadnja,zalivanje,djubrenje,obrezivanje,berba,presadjivanje,drugo',
        ]);

        $activity->update($data);

        return response()->json($activity);
    }

    public function destroy(Request $request, \App\Models\Activity $activity)
    {
        if ($activity->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $activity->delete();

        return response()->json(['message' => 'Activity deleted']);
    }
}

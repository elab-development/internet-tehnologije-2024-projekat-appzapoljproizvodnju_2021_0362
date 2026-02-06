<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'Admin ne može obrisati sopstveni nalog.'
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'Korisnik je uspešno obrisan.'
        ], 200);
    }
    public function index()
    {
        return response()->json(
            User::select('id','name','username','email','role')->get(),
            200
        );
    }
}

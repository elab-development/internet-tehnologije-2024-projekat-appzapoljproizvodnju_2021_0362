<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'            => ['required','string','max:100'],
            'username'        => ['required','string','max:50','alpha_dash','unique:users,username'],
            'email'           => ['required','email','unique:users,email'],
            'password'        => ['required','string','min:8'],
        ]);

        $user = User::create([
            'name'            => $data['name'],
            'username'        => $data['username'],
            'email'           => $data['email'],
            'password'        => $data['password'],
            'role'            => 'user',
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required','string'],
        ]);

        try {
            $user = User::where('email', $data['email'])->first();
        } catch (\PDOException $e) {
            return response()->json(['message' => 'Nema konekcije sa MySQL bazom podataka.'], 500);
        }

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Neispravni podaci za prijavu.'], 401);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Odjavljeni ste uspešno.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password'      => ['required', 'string'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'], 
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Stara lozinka nije tačna'], 422);
        }

        $user->password = $request->password;
        $user->save();

        return response()->json(['message' => 'Lozinka je uspešno promenjena']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => ['required','email']]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Ako email postoji, poslat je token.'], 200);
        }

        $token = Password::createToken($user);

        return response()->json([
            'message' => 'Token generisan. Iskoristi ga na /reset-password',
            'token'   => $token,
            'email'   => $user->email,
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'                 => ['required','email'],
            'token'                 => ['required','string'],
            'password'              => ['required','string','min:8','confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email','password','password_confirmation','token'),
            function ($user) use ($request) {
                $user->password = $request->password;
                $user->setRememberToken(Str::random(60));
                $user->save();
                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Lozinka uspešno resetovana.']);
        }
        return response()->json(['message' => __($status)], 400);
    }
}
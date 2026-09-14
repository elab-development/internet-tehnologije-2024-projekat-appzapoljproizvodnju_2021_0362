<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: "/api/register",
        summary: "Registracija korisnika",
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "username", "email", "password"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Test Testic"),
                    new OA\Property(property: "username", type: "string", example: "gostttttt"),
                    new OA\Property(property: "email", type: "string", example: "test@gmail.com"),
                    new OA\Property(property: "password", type: "string", example: "lozinka123")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "uspesna registracija"),
            new OA\Response(response: 422, description: "greska u registraciji")
        ]
    )]
    
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
            'profile_picture' => '/profile-pictures/pocetna.png',
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    #[OA\Post(
        path: '/api/login',
        summary: 'Prijava korisnika',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(
                        property: 'email', type: 'string', format: 'email', example: 'test@gmail.com'
                        ),
                    new OA\Property(
                        property: 'password', type: 'string', format: 'password', example: 'password123'
                        )
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'prijava uspela'),
            new OA\Response(response: 401, description: 'neispravni podaci')
        ]
    )]

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

    #[OA\Post(
        path: '/api/logout',
        summary: 'Odjava korisnika',
        security: [['bearerAuth' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(response: 200, description: 'Uspešna odjava'),
            new OA\Response(response: 401, description: 'Neautentifikovan korisnik')
        ]
    )]

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Odjavljeni ste uspešno.']);
    }

    #[OA\Get(
        path: '/api/me',
        summary: 'Podaci o trenutno prijavljenom korisniku',
        security: [['bearerAuth' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(
                response: 200, description: 'Podaci o korisniku', content: new OA\JsonContent(type: 'object')
            ),
            new OA\Response(
                response: 401, description: 'Neautentifikovan korisnik'
            )
        ]
    )]

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    #[OA\Post(
        path: '/api/change-password',
        summary: 'Promena lozinke',
        tags: ['Auth'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: [
                    'current_password',
                    'password',
                    'password_confirmation'
                ],
                properties: [
                    new OA\Property(
                        property: 'current_password',
                        type: 'string',
                        format: 'password'
                    ),
                    new OA\Property(
                        property: 'password',
                        type: 'string',
                        format: 'password',
                        minLength: 8
                    ),
                    new OA\Property(
                        property: 'password_confirmation',
                        type: 'string',
                        format: 'password'
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'nozinka je uspešno promenjena'
            ),
            new OA\Response(
                response: 401,
                description: 'neulogovan korisnik'
            ),
            new OA\Response(
                response: 422,
                description: 'neispravni podaci ili pogresna trenutna lozinka'
            )
        ]
    )]

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

    #[OA\Post(
        path: '/api/forgot-password',
        summary: 'Zahtev za resetovanje lozinke',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email'],
                properties: [
                        new OA\Property(
                            property: 'email', type: 'string', format: 'email', example: 'test@gmail.com'
                        )
                    ]
                )
            ),
        responses: [
            new OA\Response(response: 200, description: 'zahtev obradjen'),
            new OA\Response(response: 422, description: 'neispravni podaci')
        ]
    )]

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

    #[OA\Post(
        path: '/api/reset-password',
        summary: 'Resetovanje lozinke',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'token', 'password', 'password_confirmation'],
                properties: [
                    new OA\Property(
                        property: 'email', type: 'string', format: 'email', example: 'test@gmail.com'
                    ),
                    new OA\Property(
                        property: 'token', type: 'string'
                    ),
                    new OA\Property(
                        property: 'password', type:'string', minLength: 8
                    ),
                    new OA\Property(
                        property: 'password_confirmation', type: 'string'
                    )
                ]
            )
        ),
        responses: [
            new OA\Response (response: 200, description: 'lozinka je resetovana'),
            new OA\Response (response: 400, description: 'resetovanje nije uspelo'),
            new OA\Response (response: 422, description: 'neispravni podaci')
        ]
    )]

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

    #[OA\Post(
        path: '/api/become-premium',
        summary: 'Prelazak korisnika na premium nalog',
        tags: ['Auth'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'korisnik je vec premium'
            ),
            new OA\Response(
                response: 401,
                description: 'neautentifikovan korisnik'
            )
        ]
    )]

    public function becomePremium(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'premium') {
            return response()->json([
                'message' => 'Korisnik je već premium.',
                'user' => $user
            ], 200);
        }

        if ($user->role === 'admin') {
            return response()->json([
                'message' => 'Admin ima pristup svim funkcionalnostima.',
                'user' => $user
            ], 200);
        }

        $user->role = 'premium';
        $user->save();

        return response()->json([
            'message' => 'Uspešno ste postali premium korisnik.',
            'user' => $user
        ], 200);
    }
}
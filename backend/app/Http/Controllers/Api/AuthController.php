<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('username', $request->username)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'username' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Actualizar último login
        $admin->update(['last_login' => now()]);

        // Crear token (en producción usar Laravel Sanctum)
        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso',
            'admin' => [
                'id' => $admin->id,
                'username' => $admin->username,
                'email' => $admin->email,
                'role' => $admin->role,
                'last_login' => $admin->last_login,
                'created_at' => $admin->created_at,
            ],
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout exitoso'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'admin' => $request->user()
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:admins',
            'email' => 'required|email|unique:admins',
            'password' => 'required|string|min:8',
            'role' => 'in:admin,super_admin'
        ]);

        $admin = Admin::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => $request->password, // Se hasheará automáticamente en el modelo
            'role' => $request->role ?? 'admin'
        ]);

        return response()->json([
            'message' => 'Admin creado exitosamente',
            'admin' => [
                'id' => $admin->id,
                'username' => $admin->username,
                'email' => $admin->email,
                'role' => $admin->role,
                'created_at' => $admin->created_at,
            ]
        ], 201);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BankAccountController extends Controller
{
    /**
     * Display a listing of the resource for admin.
     */
    public function index(): JsonResponse
    {
        $bankAccounts = BankAccount::orderBy('created_at', 'desc')->get();
        
        return response()->json($bankAccounts);
    }

    /**
     * Display a listing of active bank accounts for public.
     */
    public function publicIndex(): JsonResponse
    {
        $bankAccounts = BankAccount::active()->orderBy('created_at', 'desc')->get();
        
        return response()->json($bankAccounts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'banco' => 'required|string|max:255',
            'tipo_cuenta' => 'required|in:corriente,ahorros',
            'numero_cuenta' => 'required|string|max:255',
            'titular' => 'required|string|max:255',
            'cedula_ruc' => 'required|string|max:255',
            'email_contacto' => 'required|email|max:255',
            'activa' => 'boolean'
        ]);

        $bankAccount = BankAccount::create($validated);

        return response()->json([
            'message' => 'Cuenta bancaria creada exitosamente',
            'bank_account' => $bankAccount
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(BankAccount $bankAccount): JsonResponse
    {
        return response()->json($bankAccount);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BankAccount $bankAccount): JsonResponse
    {
        $validated = $request->validate([
            'banco' => 'required|string|max:255',
            'tipo_cuenta' => 'required|in:corriente,ahorros',
            'numero_cuenta' => 'required|string|max:255',
            'titular' => 'required|string|max:255',
            'cedula_ruc' => 'required|string|max:255',
            'email_contacto' => 'required|email|max:255',
            'activa' => 'boolean'
        ]);

        $bankAccount->update($validated);

        return response()->json([
            'message' => 'Cuenta bancaria actualizada exitosamente',
            'bank_account' => $bankAccount
        ]);
    }

    /**
     * Toggle the active status of a bank account.
     */
    public function toggle(BankAccount $bankAccount): JsonResponse
    {
        $bankAccount->update(['activa' => !$bankAccount->activa]);

        return response()->json([
            'message' => 'Estado de cuenta bancaria actualizado',
            'bank_account' => $bankAccount
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BankAccount $bankAccount): JsonResponse
    {
        $bankAccount->delete();

        return response()->json([
            'message' => 'Cuenta bancaria eliminada exitosamente'
        ]);
    }
}

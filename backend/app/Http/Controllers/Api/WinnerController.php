<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Winner;
use App\Models\Activity;
use Illuminate\Http\Request;

class WinnerController extends Controller
{
    /**
     * Display a listing of all winners (admin and public).
     */
    public function index()
    {
        $winners = Winner::with(['activity', 'order'])
            ->orderBy('fecha_sorteo', 'desc')
            ->get();

        return response()->json($winners);
    }

    /**
     * Display public winners (only announced winners).
     */
    public function publicIndex()
    {
        $winners = Winner::with(['activity', 'order'])
            ->where('anunciado_en_instagram', true)
            ->orderBy('fecha_sorteo', 'desc')
            ->get()
            ->map(function ($winner) {
                return [
                    'id' => $winner->id,
                    'activity_name' => $winner->activity->nombre,
                    'activity_number' => $winner->activity->actividad_numero,
                    'activity_image' => $winner->activity->imagen_url,
                    'numero_ganador' => $winner->numero_ganador,
                    'fecha_sorteo' => $winner->fecha_sorteo,
                    'winner_name' => $winner->order ? $winner->order->nombre_cliente : 'N/A',
                    'numeros_premiados' => $winner->activity->numeros_premiados ?? []
                ];
            });

        return response()->json($winners);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'order_id' => 'required|exists:orders,id',
            'numero_ganador' => 'required|string',
            'es_numero_premiado' => 'boolean',
            'notas' => 'nullable|string'
        ]);

        $winner = Winner::create([
            'activity_id' => $request->activity_id,
            'order_id' => $request->order_id,
            'numero_ganador' => $request->numero_ganador,
            'es_numero_premiado' => $request->es_numero_premiado ?? true,
            'fecha_sorteo' => now(),
            'anunciado_en_instagram' => false,
            'notas' => $request->notas
        ]);

        return response()->json([
            'message' => 'Ganador creado exitosamente',
            'winner' => $winner->load(['activity', 'order'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $winner = Winner::with(['activity', 'order'])->findOrFail($id);
        return response()->json($winner);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $winner = Winner::findOrFail($id);

        $request->validate([
            'order_id' => 'exists:orders,id',
            'numero_ganador' => 'string',
            'es_numero_premiado' => 'boolean',
            'anunciado_en_instagram' => 'boolean',
            'notas' => 'nullable|string'
        ]);

        $winner->update($request->only([
            'order_id', 
            'numero_ganador', 
            'es_numero_premiado', 
            'anunciado_en_instagram', 
            'notas'
        ]));

        return response()->json([
            'message' => 'Ganador actualizado exitosamente',
            'winner' => $winner->load(['activity', 'order'])
        ]);
    }

    /**
     * Toggle Instagram announcement status.
     */
    public function toggleInstagramAnnouncement(string $id)
    {
        $winner = Winner::findOrFail($id);
        $winner->update(['anunciado_en_instagram' => !$winner->anunciado_en_instagram]);

        return response()->json([
            'message' => $winner->anunciado_en_instagram ? 'Ganador marcado como anunciado' : 'Ganador marcado como no anunciado',
            'winner' => $winner->load(['activity', 'order'])
        ]);
    }

    /**
     * Mark winner as announced on Instagram.
     */
    public function markAsAnnounced(string $id)
    {
        $winner = Winner::findOrFail($id);
        $winner->update(['anunciado_en_instagram' => true]);

        return response()->json([
            'message' => 'Ganador marcado como anunciado',
            'winner' => $winner
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $winner = Winner::findOrFail($id);
        $winner->delete();

        return response()->json([
            'message' => 'Ganador eliminado exitosamente'
        ]);
    }
}

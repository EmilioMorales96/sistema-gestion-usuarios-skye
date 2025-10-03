<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;

/**
 * UserController - Controlador de Usuarios para CatWare Systems
 * 
 * Maneja listado y gestión de usuarios
 * Incluye ordenamiento y paginación
 */
class UserController extends Controller
{
    /**
     * Listar todos los usuarios con ordenamiento
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // Validar parámetros de ordenamiento
        $request->validate([
            'sort_by' => 'sometimes|string|in:name,email,created_at',
            'sort_direction' => 'sometimes|string|in:asc,desc',
        ]);

        // Obtener parámetros de ordenamiento (valores por defecto)
        $sortBy = $request->get('sort_by', 'name');
        $sortDirection = $request->get('sort_direction', 'asc');

        // Obtener usuarios ordenados
        $users = User::select('id', 'name', 'email', 'created_at')
            ->orderBy($sortBy, $sortDirection)
            ->get();

        return response()->json([
            'success' => true,
            'users' => $users,
            'total' => $users->count(),
            'sort_by' => $sortBy,
            'sort_direction' => $sortDirection
        ]);
    }
}

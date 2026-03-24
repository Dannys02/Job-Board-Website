<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    // Cek apakah role user sesuai dengan yang dibutuhkan route
    public function handle(Request $request, Closure $next, string $role): mixed
    {
        // Kalau role tidak cocok, tolak dengan 403
        if ($request->user()->role !== $role) {
            return response()->json([
                'message' => 'Akses ditolak. Kamu tidak punya izin.'
            ], 403);
        }

        return $next($request);
    }
}
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $action, $entity): Response
    {
        $user = Auth::user();
        
        // Check if the user has the required permission
        if ($user->hasPermission($action, $entity)) {
            return $next($request); // Allow access
        }
        
        // Deny access if no matching permission is found
        return response()->json(['message' => 'Unauthorized'], 403);
    }
}

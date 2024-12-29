<?php

namespace App\Http\Controllers;

use App\Models\Audience;
use Illuminate\Http\Request;

class AudienceController extends Controller
{
    public function index()
    {
        return Audience::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        return Audience::create($request->all());
    }

    public function show(Audience $audience)
    {
        return $audience->load('projects', 'activities');
    }

    public function update(Request $request, Audience $audience)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $audience->update($request->all());

        return $audience;
    }

    public function destroy(Audience $audience)
    {
        $audience->delete();
        return response()->noContent();
    }
}

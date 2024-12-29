<?php

namespace App\Http\Controllers;

use App\Models\Entity;
use Illuminate\Http\Request;

class EntityController extends Controller
{
    public function index() {
        $entities = Entity::all();
        return response()->json($entities);
    }
}

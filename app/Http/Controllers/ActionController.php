<?php

namespace App\Http\Controllers;

use App\Models\Action;
use Illuminate\Http\Request;

class ActionController extends Controller
{
    public function index() {
        $actions = Action::all();
        return response()->json($actions);
    }
}

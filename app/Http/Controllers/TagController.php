<?php
// app/Http/Controllers/TagController.php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Display a listing of the tags.
     */
    public function index(Request $request)
    {
        $name = $request->input('name');

        $tags = Tag::with('user')->nameFiltered($name)->get();
        return response()->json($tags);
    }

    /**
     * Store a newly created tag in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
        ]);

        $tag = Tag::create([
            'name' => $request->input('name'),
            'user_id' => $request->user()->id // Add user_id
        ]);

        return response()->json($tag, 201);
    }

    /**
     * Display the specified tag.
     */
    public function show(Tag $tag)
    {
        return $tag;
    }

    /**
     * Update the specified tag in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:tags,name,' . $tag->id,
        ]);

        $tag->update($request->only('name'));

        return $tag;
    }

    /**
     * Remove the specified tag from storage.
     */
    public function destroy(Tag $tag)
    {
        $tag->delete();

        return response()->json(null, 204);
    }
}

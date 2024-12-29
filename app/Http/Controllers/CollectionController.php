<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Http\Request;
 
class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all root collections (should typically return only one)
        return Collection::with([
            'children' => function($query) {
                $query->with('tags');
            },
            'documents' => function($query) {
                $query->with(['user','tags']);
            }
            ])->whereNull('parent_id')->get();
    }

    /** 
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:collections,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        // Check if trying to create another root collection
        if ($request->parent_id === null) {
            $rootExists = Collection::whereNull('parent_id')->exists();
            if ($rootExists) {
                return response()->json(['error' => 'A root collection already exists.'], 400);
            }
        }

        $collection = Collection::create([
            'name' => $request->name,
            'description' => $request->description,
            'parent_id' => $request->parent_id,
            'user_id' => $request->user()->id,
        ]);

        
        if(isset($validated['tag_ids'])) {
            $collection->tags()->sync($validated['tag_ids']); // Attach tags to collection
        }

        $collection->load(['user','tags']);
        return response()->json($collection, 201);
    }

    public function show(Request $request, string $id)
    {
        $filters = [
            'tag' => $request->get('tag'),
            'search' => $request->get('search')
        ];

        // Fetch the specific collection with necessary relationships and filtering
        $collection = Collection::with([
            'parent',
            'children' => function($query) use ($filters) {
                $query->whereHas('tags', function ($tagQuery) use ($filters) {
                    if (!empty($filters['tag'])) {
                        $tagQuery->where('name', $filters['tag']);
                    }
                })
                ->where(function($searchQuery) use ($filters) {
                    if (!empty($filters['search'])) {
                        $keywords = explode(' ', $filters['search']);
                        foreach ($keywords as $keyword) {
                            $searchQuery->orWhere('name', 'LIKE', '%' . $keyword . '%')
                                        ->orWhere('description', 'LIKE', '%' . $keyword . '%')
                                        ->orWhereHas('tags', function ($tagQuery) use ($keyword) {
                                            $tagQuery->where('name', 'LIKE', '%' . $keyword . '%');
                                        });
                        }
                    }
                })
                ->with('tags');
            },
            'documents' => function($query) use ($filters) {
                $query->whereHas('tags', function ($tagQuery) use ($filters) {
                    if (!empty($filters['tag'])) {
                        $tagQuery->where('name', $filters['tag']);
                    }
                })
                ->where(function($searchQuery) use ($filters) {
                    if (!empty($filters['search'])) {
                        $keywords = explode(' ', $filters['search']);
                        foreach ($keywords as $keyword) {
                            $searchQuery->orWhere('name', 'LIKE', '%' . $keyword . '%')
                                        ->orWhere('description', 'LIKE', '%' . $keyword . '%')
                                        ->orWhereHas('tags', function ($tagQuery) use ($keyword) {
                                            $tagQuery->where('name', 'LIKE', '%' . $keyword . '%');
                                        });
                        }
                    }
                })
                ->with(['tags', 'user']);
            }
        ])->findOrFail($id);

        return response()->json($collection);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id'
        ]);

        $collection = Collection::findOrFail($id);

        // Check if trying to change parent_id to null (attempting to make it root)
        if ($request->has('parent_id') && $request->parent_id === null) {
            $rootExists = Collection::whereNull('parent_id')
                ->where('id', '!=', $collection->id)
                ->exists();
            if ($rootExists) {
                return response()->json(['error' => 'Another root collection already exists'], 400);
            }
        }

        $collection->update($request->only(['name','description']));

        if(isset($validated['tag_ids'])) {
            $collection->tags()->sync($validated['tag_ids']); // Attach tags to collection
        }

        $collection->load('tags');
        return response()->json($collection);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $collection = Collection::findOrFail($id);

        // Ensure the root collection is not being deleted if it has children
        if ($collection->parent_id === null && $collection->children()->exists()) {
            return response()->json(['error' => 'Cannot delete the root collection while it has children.'], 400);
        }

        $collection->delete();

        return response()->json(null, 204);
    }

    /**
     * Get children of a collection.
     */
    public function getChildren($id)
    {
        $collection = Collection::with(['children','children.tags'])->findOrFail($id);
        return response()->json($collection->children);
    }

    /**
     * Move a collection under another collection.
     */
    public function moveCollection(Request $request, $id)
    {
        $request->validate([
            'new_parent_id' => 'nullable|exists:collections,id',
        ]);

        $collection = Collection::findOrFail($id);

        // Check if trying to move a collection to root
        if ($request->new_parent_id === null) {
            $rootExists = Collection::whereNull('parent_id')
                ->where('id', '!=', $collection->id)
                ->exists();
            if ($rootExists) {
                return response()->json(['error' => 'Cannot move to root because another root collection exists.'], 400);
            }
        }

        $collection->update(['parent_id' => $request->new_parent_id]);

        return response()->json($collection);
    }

    public function getRoot(Request $request)
    {
        $filters = [
            'tag' => $request->get('tag'),
            'search' => $request->get('search')
        ];

        // Fetch the root collection with necessary relationships and filtering
        $rootCollection = Collection::with([
            'parent',
            'children' => function($query) use ($filters) {
                $query->whereHas('tags', function ($tagQuery) use ($filters) {
                    if (!empty($filters['tag'])) {
                        $tagQuery->where('name', $filters['tag']);
                    }
                })
                ->where(function($searchQuery) use ($filters) {
                    if (!empty($filters['search'])) {
                        $keywords = explode(' ', $filters['search']);
                        foreach ($keywords as $keyword) {
                            $searchQuery->orWhere('name', 'LIKE', '%' . $keyword . '%')
                                        ->orWhere('description', 'LIKE', '%' . $keyword . '%')
                                        ->orWhereHas('tags', function ($tagQuery) use ($keyword) {
                                            $tagQuery->where('name', 'LIKE', '%' . $keyword . '%');
                                        });
                        }
                    }
                })
                ->with('tags');
            },
            'documents' => function($query) use ($filters) {
                $query->whereHas('tags', function ($tagQuery) use ($filters) {
                    if (!empty($filters['tag'])) {
                        $tagQuery->where('name', $filters['tag']);
                    }
                })
                ->where(function($searchQuery) use ($filters) {
                    if (!empty($filters['search'])) {
                        $keywords = explode(' ', $filters['search']);
                        foreach ($keywords as $keyword) {
                            $searchQuery->orWhere('name', 'LIKE', '%' . $keyword . '%')
                                        ->orWhere('description', 'LIKE', '%' . $keyword . '%')
                                        ->orWhereHas('tags', function ($tagQuery) use ($keyword) {
                                            $tagQuery->where('name', 'LIKE', '%' . $keyword . '%');
                                        });
                        }
                    }
                })
                ->with(['tags', 'user']);
            }
        ])->whereNull('parent_id')->first();

        if (!$rootCollection) {
            return response()->json(['message' => 'Root collection not found'], 404);
        }

        return response()->json($rootCollection);
    }


    // public function fetchRootId() {
    //     $root = Collection::whereNull('parent_id')->first();
    //     $rootId = $root -> id;
    //     if (!$rootId) {
    //         return response()->json(['message' => 'Root Collection not found'],404);
    //     }
    //     // return response()->json($rootId);
    //     return response()->json($root->id);
    // }


    public function fetchRootId() {
        $root = Collection::whereNull('parent_id')->first();
    
        if (!$root) {
            // Automatically create a root collection if none exists
            $root = Collection::create([
                'name' => 'Root Collection',
                'description' => 'This is the root collection.',
                'parent_id' => null,
                'user_id' => auth()->id() ?? 1, // Use authenticated user ID or a default one
            ]);
        }
    
        return response()->json($root->id);
    }
    
}

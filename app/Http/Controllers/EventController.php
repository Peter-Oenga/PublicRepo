<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
 
class EventController extends Controller
{ 
    public function index(Request $request)
    {
        // Get query parameters for filtering
        $search = $request->input('search');
        $tag = $request->input('tag');

        // Fetch events with related outcomes, tags, and user, and apply search and tag filters
        $events = Event::with(['outcomes', 'tags', 'user'])
                    ->searchFiltered($search) // Apply search filter
                    ->tagFiltered($tag)       // Apply tag filter
                    ->get();

        return response()->json($events);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
            'poster' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'location' => 'required|string|max:255',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        // Handle file upload
        if ($request->hasFile('poster')) {
            $file = $request->file('poster');
            $path = $file->store('event_posters', 'public');
            $validated['poster'] = $path;
        }

        // Attach authenticated user ID
        $validated['user_id'] = Auth::id();

        $event = Event::create($validated);
        if (isset($validated['tag_ids'])) {
            $event->tags()->sync($validated['tag_ids']); // Attach tags to event
        }
        $event->load('outcomes','tags','user');
        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        // Fetch the event with related outcomes, tags, user, and related data
        $event = Event::with([
            'outcomes' => function ($query) {
                $query->with([
                    'images',
                    'files' => function ($query) {
                        $query->with('user'); // Eager load user for each file in outcomes
                    },
                    'user'
                ]); 
            },
            'tags',
            'user',
            'files' => function ($query) {
                $query->with('user'); // Eager load user for each event file
            }
        ])->findOrFail($event->id);

        return response()->json($event);
    }

    public function update(Request $request,Event $event)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',  // Required during update
            'description' => 'required|string',   // Required during update
            'start' => 'required|date',           // Required during update
            'end' => 'required|date|after_or_equal:start', // Required during update
            'poster' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'location' => 'required|string|max:255',  // Required during update
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        // Handle file upload
        if ($request->hasFile('poster')) {
            // Delete old file if exists
            if ($event->poster && Storage::disk('public')->exists($event->poster)) {
                Storage::disk('public')->delete($event->poster);
            }

            $file = $request->file('poster');
            $path = $file->store('event_posters', 'public');
            $validated['poster'] = $path;
        }
        $event->update($validated);
        if (isset($validated['tag_ids'])) {
            $event->tags()->sync($validated['tag_ids']); // Attach or detach tags from event
        }

        return response()->json($event, 200);
    }

    public function destroy(Event $event)
    {
        // Delete poster file if exists
        if ($event->poster && Storage::disk('public')->exists($event->poster)) {
            Storage::disk('public')->delete($event->poster);
        }

        $event->delete();
        return response()->json(null, 204);
    }

    public function getUpcomingEvents()
    {
        return Event::where('start', '>=', now())->get();
    }

    public function getPastEvents()
    {
        return Event::where('end', '<', now())->get();
    }

    public function addPoster(Request $request, Event $event)
    {
        $request->validate([
            'poster' => 'required|file|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Delete old file if exists
        if ($event->poster && Storage::disk('public')->exists($event->poster)) {
            Storage::disk('public')->delete($event->poster);
        }

        // Store new poster
        $file = $request->file('poster');
        $path = $file->store('event_posters', 'public');
        
        // Update event with new poster path
        $event->poster = $path;
        $event->save();

        return response()->json($event, 200);
    }

    /**
     * Add file to a specific event.
     */
    public function addFile(Request $request, Event $event)
    {
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,xlsx,xls,ppt,pptx,txt|max:5120',
        ]);

        // Handle file upload
        $file = $request->file('file');
        $filePath = $file->store('event_files', 'public');

        // Retrieve file information
        $fileName = $file->getClientOriginalName();
        $fileType = $file->getMimeType();
        $userId = Auth::id(); // Get the ID of the currently authenticated user

        // Store file record in database
        $eventFile = $event->files()->create([
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_type' => $fileType,
            'user_id' => $userId,
        ]);

        $eventFile->load('user');
        return response()->json(['file' => $eventFile], 201);
    }

    /**
     * Remove a file from a specific event.
     */
    public function removeFile(Event $event, EventFile $file)
    {
        // Ensure the file belongs to the event
        if ($file->event_id !== $event->id) {
            return response()->json(['error' => 'File does not belong to the specified event.'], 403);
        }

        $filePath = $file->file_path; // Retrieve file path from model

        // Delete file from storage
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }

        // Delete file record from the database
        $file->delete();

        return response()->json(null, 204);
    }

}

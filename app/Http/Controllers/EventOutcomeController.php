<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventOutcome;
use Illuminate\Http\Request;
use App\Models\EventOutcomeFile;
use App\Models\EventOutcomeImage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EventOutcomeController extends Controller
{
    /**
     * Display a listing of the event outcomes.
     */
    public function index()
    {
        $eventOutcomes = EventOutcome::all();
        return response()->json($eventOutcomes);
    }

    /**
     * Store a newly created event outcome in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'event_id' => 'required|exists:events,id',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        // Assign the authenticated user's ID
        $validatedData['user_id'] = Auth::id();

        $eventOutcome = EventOutcome::create($validatedData);

        return response()->json($eventOutcome, 201);
    }

    /**
     * Display the specified event outcome.
     */
    public function show(EventOutcome $eventOutcome)
    {
        return response()->json($eventOutcome);
    }

    /**
     * Update the specified event outcome in storage.
     */
    public function update(Request $request,Event $event,EventOutcome $outcome)
    {
        // Ensure the outcome belongs to the event
        if ($outcome->event_id !== $event->id) {
            return response()->json(['error' => 'Outcome does not belong to this event'], 403);
        }

        $validatedData = $request->validate([
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $outcome->update($validatedData);

        return response()->json($outcome);
    }

    /**
     * Remove the specified event outcome from storage.
     */
    public function destroy(Event $event,EventOutcome $outcome)
    {
        // Ensure the outcome belongs to the event
        if ($outcome->event_id !== $event->id) {
            return response()->json(['error' => 'Outcome does not belong to this event'], 403);
        }
        
        $outcome->delete();

        return response()->json(null, 204);
    }

    /**
     * Add files to the specified event outcome.
     */
    public function addFile(Request $request,Event $event,EventOutcome $outcome)
    {
        // Ensure the outcome belongs to the event
        if ($outcome->event_id !== $event->id) {
            return response()->json(['error' => 'Outcome does not belong to this event'], 403);
        }

        // Validate the uploaded file
        $request->validate([
        'file' => 'required|file|mimes:pdf,doc,docx,xlsx,xls,ppt,pptx,txt|max:5120',
        ]);

        // Handle file upload
        $file = $request->file('file');
        $filePath = $file->store('outcome_files', 'public');

        // Retrieve file information
        $fileName = $file->getClientOriginalName();
        $fileType = $file->getMimeType();
        $userId = Auth::id(); // Get the ID of the currently authenticated user

        // Store file record in database
        $eventOutcomeFile = $outcome->files()->create([
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_type' => $fileType,
            'user_id' => $userId,
        ]);

        $outcome->load(['images','files','user']);
        return response()->json($outcome);
    }

     /**
     * Remove a file from the specified event outcome.
     */
    public function removeFile(Event $event,EventOutcome $outcome, EventOutcomeFile $file)
    {
        // Ensure the file belongs to the event outcome
        if ($file->event_outcome_id !== $outcome->id) {
            return response()->json(['error' => 'File does not belong to the specified event outcome.'], 403);
        }

        // Delete the file from storage
        if (Storage::exists($file->file_path)) {
            Storage::delete($file->file_path);
        }

        // Delete the file record from the database
        $file->delete();

        return response()->json(null,204);
    }

    /**
     * Add an image to the specified event outcome.
    */
    public function addImage(Request $request, Event $event, EventOutcome $outcome)
    {
        // Ensure the outcome belongs to the event
        if ($outcome->event_id !== $event->id) {
            return response()->json(['error' => 'Outcome does not belong to this event'], 403);
        }

        // Validate the uploaded image
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Handle image upload
        $image = $request->file('image');
        $path = $image->store('event_outcome_images', 'public');
        $userId = Auth::id(); // Get the ID of the currently authenticated user

        // Store image record in database
        $eventOutcomeImage = $outcome->images()->create([
            'image_path' => $path,
            'user_id' => $userId,
        ]);

        // Load the outcome with related images, files, and user
        $outcome->load(['images','files','user']);
        
        return response()->json($outcome);
    }


    /**
     * Remove an image from the specified event outcome.
     */
    public function removeImage(Event $event, EventOutcome $outcome, EventOutcomeImage $image)
    {
        // Ensure the image belongs to the event outcome
        if ($image->event_outcome_id !== $outcome->id) {
            return response()->json(['error' => 'Image does not belong to the specified event outcome.'], 403);
        }

        // Delete the image from storage
        if (Storage::exists($image->image_path)) {
            Storage::delete($image->image_path);
        }

        // Delete the image record from the database
        $image->delete();

        return response()->json(null, 204);
    }

}

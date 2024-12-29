<?php
namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Document::with(['tags','versions'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file',
            'collection_id' => 'required|exists:collections,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $filePath = $request->file('file')->store('documents');
        $fileType = $request->file('file')->getMimeType();

        $document = Document::create([
            'name' => $request->name,
            'description' => $request->description,
            'file_path' => $filePath,
            'file_type' => $fileType,
            'collection_id' => $request->collection_id,
            'user_id' => $request->user()->id,
        ]);

        if(isset($validated['tag_ids'])) {
            $document->tags()->sync($validated['tag_ids']); // Attach tags to document
        }

        $document->load(['user','tags']);
        
        return response()->json($document, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        return response()->json($document->load(['tags','versions','user']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id'
        ]);

        $document->update($request->only(['name', 'description']));

        if(isset($validated['tag_ids'])) {
            $document->tags()->sync($validated['tag_ids']); // Attach tags to document
        }
        
        return response()->json($document);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        // Delete the main document file
        $filePath = storage_path('app/' . $document->file_path);
        if (file_exists($filePath)) {
            unlink($filePath); // Delete the file from the file system
        } else {
            return response()->json(['error' => 'File not found'], 404);
        }

        // Delete the version files
        foreach ($document->versions as $version) {
            $versionFilePath = storage_path('app/' . $version->file_path);
            if (file_exists($versionFilePath)) {
                unlink($versionFilePath); // Delete the version file from the file system
            }
        }

        // Delete the document and associated versions from the database
        $document->delete();

        return response()->json(null, 204);
    }

    // Custom methods
    public function moveDocument(Request $request, Document $document)
    {
        $request->validate([
            'new_collection_id' => 'required|exists:collections,id',
        ]);

        $document->update(['collection_id' => $request->new_collection_id]);

        return response()->json($document);
    }

    public function createVersion(Request $request, Document $document)
    {
        $request->validate([
            'file' => 'required|file',
            'description' => 'required|string',
        ]);

        $document->createVersion($request->file('file'), $request->input('description'));

        return response()->json($document);
    }

    public function restoreVersion(Request $request, Document $document,$versionId)
    {
        $document->restoreVersion($versionId);

        return response()->json($document);
    }

    /**
     * Serve the specified document as a download.
     */
    public function downloadDocument(Document $document)
    {
        $filePath = storage_path('app/' . $document->file_path);

        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $fileName = $document->name . '.' . pathinfo($document->file_path, PATHINFO_EXTENSION);

        return response()->download($filePath, $fileName, [
            'Content-Type' => $document->file_type,
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    public function downloadVersion(Document $document, $versionId) {
        // Find the version or fail with a 404 error if not found
        $version = $document->versions()->findOrFail($versionId);
    
        // Construct the full file path
        $filePath = storage_path('app/' . $version->file_path);
    
        // Check if the file exists
        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }
    
        // Determine the file's MIME type
        $mimeType = mime_content_type($filePath);
    
        // Create a download file name based on the document name and file extension
        $fileName = $document->name . '.' . pathinfo($version->file_path, PATHINFO_EXTENSION);
    
        // Return the file as a download response
        return response()->download($filePath, $fileName, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }
    


}

<?php
namespace App\Models;

use App\Models\Tag;
use App\Models\DocumentVersion;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Document extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'file_path', 'file_type', 'collection_id', 'user_id'];

    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }

    public function versions()
    {
        return $this->hasMany(DocumentVersion::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function createVersion(UploadedFile $newFile, $description)
    {
        $currentMimeType = Storage::mimeType($this->file_path);
        $newMimeType = $newFile->getMimeType();

        if ($currentMimeType !== $newMimeType) {
            throw new \Exception('The new version must have the same MIME type as the current document.');
        }

        $newFilePath = $newFile->store('documents');

        // Check if the current document already exists in the versions table
        $existingVersion = $this->versions()
            ->where('file_path', $this->file_path)
            ->first();

        if (!$existingVersion) {
            // Save the current document as a new version
            $this->versions()->create([
                'version_number' => $this->versions()->count() + 1,
                'file_path' => $this->file_path,
                'user_id' => $this->user_id, // Preserve the original uploader
                'description' => $this->description, // Preserve the original description
            ]);
        }

        // Update the document with the new file and description
        $this->update([
            'file_path' => $newFilePath,
            'description' => $description, // New description for the new version
        ]);
    }

   
    public function restoreVersion($versionId)
    {
        $version = $this->versions()->findOrFail($versionId);

        // Check if the version being restored is already the current one
        if ($this->file_path === $version->file_path) {
            \Log::info('Same file path');
            return; // No need to restore if it's already the current version
        }

        // Check if the current document already exists in the versions table
        $existingVersion = $this->versions()
            ->where('file_path', $this->file_path)
            ->first();
        \Log::info($existingVersion);
        if (!$existingVersion) {
            // Save the current document as a new version
            $this->versions()->create([
                'version_number' => $this->versions()->count() + 1,
                'file_path' => $this->file_path,
                'user_id' => $this->user_id,
                'description' => $this->description,
            ]);
        }

        // Update the document to point to the restored version's file and description
        $this->update([
            'file_path' => $version->file_path,
            'description' => $version->description,
            // Do not update user_id; preserve the original ownership
        ]);
    }

    // Relationship with the Report model
    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}

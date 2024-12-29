<?php

namespace App\Models;

use App\Models\EventFile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    // Fillable attributes for mass assignment
    protected $fillable = ['name', 'description', 'start', 'end', 'poster', 'location', 'user_id'];

    /**
     * Get all of the tags for the event.
     */
    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    /**
     * The outcomes that belong to the event.
     */
    public function outcomes()
    {
        return $this->hasMany(EventOutcome::class);
    }

    /**
     * The files that belong to the event.
     */
    public function files()
    {
        return $this->hasMany(EventFile::class);
    }

    /**
     * The user that owns the event.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeSearchFiltered($query, $search)
    {
        if (!empty($search)) {
            // Explode the search string into individual keywords
            $keywords = explode(' ', $search);
            $query->where(function ($searchQuery) use ($keywords) {
                foreach ($keywords as $keyword) {
                    // Search in name, description, and location fields
                    $searchQuery->orWhere('name', 'LIKE', '%' . $keyword . '%')
                                ->orWhere('description', 'LIKE', '%' . $keyword . '%')
                                ->orWhere('location', 'LIKE', '%' . $keyword . '%');
                }
            });

            // Also search in related tags
            $query->orWhereHas('tags', function ($tagQuery) use ($keywords) {
                foreach ($keywords as $keyword) {
                    $tagQuery->where('name', 'LIKE', '%' . $keyword . '%');
                }
            });
        }

        return $query;
    }

    public function scopeTagFiltered($query, $tag)
    {
        if (!empty($tag)) {
            // Filter events that are associated with the specified tag name
            $query->whereHas('tags', function ($tagQuery) use ($tag) {
                $tagQuery->where('name', $tag);
            });
        }
        return $query;
    }

}

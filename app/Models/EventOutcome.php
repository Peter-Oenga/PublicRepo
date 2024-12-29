<?php

namespace App\Models;

use App\Models\User;
use App\Models\Event;
use App\Models\EventOutcomeFile;
use App\Models\EventOutcomeImage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EventOutcome extends Model
{
    use HasFactory;

    // Fillable attributes for mass assignment
    protected $fillable = ['event_id', 'description', 'date', 'user_id'];

    /**
     * The event that owns the outcome.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * The user that owns the outcome.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The images associated with the outcome.
     */
    public function images()
    {
        return $this->hasMany(EventOutcomeImage::class);
    }

    /**
     * The files associated with the outcome.
     */
    public function files()
    {
        return $this->hasMany(EventOutcomeFile::class);
    }
}

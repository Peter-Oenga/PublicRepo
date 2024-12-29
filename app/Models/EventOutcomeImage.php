<?php

namespace App\Models;

use App\Models\User;
use App\Models\EventOutcome;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EventOutcomeImage extends Model
{
    use HasFactory;

    // Fillable attributes for mass assignment
    protected $fillable = ['event_outcome_id', 'image_path', 'user_id'];

    /**
     * The outcome that owns the image.
     */
    public function eventOutcome()
    {
        return $this->belongsTo(EventOutcome::class);
    }

    /**
     * The user that uploaded the image.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use App\Models\User;
use App\Models\EventOutcome;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EventOutcomeFile extends Model
{
    use HasFactory;

    // Fillable attributes for mass assignment
    protected $fillable = ['event_outcome_id', 'file_name', 'file_path', 'file_type', 'user_id'];

    /**
     * The outcome that owns the file.
     */
    public function eventOutcome()
    {
        return $this->belongsTo(EventOutcome::class);
    }

    /**
     * The user that uploaded the file.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

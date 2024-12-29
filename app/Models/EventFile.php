<?php

namespace App\Models;

use App\Models\User;
use App\Models\Event;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EventFile extends Model
{
    use HasFactory;

    // Fillable attributes for mass assignment
    protected $fillable = ['event_id', 'file_name', 'file_path', 'file_type', 'user_id'];

    /**
     * The event that owns the file.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * The user that uploaded the file.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

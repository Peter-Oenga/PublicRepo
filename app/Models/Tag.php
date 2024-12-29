<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tag extends Model
{
    use HasFactory;

    // Fillable attributes for mass assignment
    protected $fillable = ['name', 'user_id'];

    /**
     * Get all the models that are assigned this tag.
     */
    public function events()
    {
        return $this->morphedByMany(Event::class, 'taggable');
    }

    public function documents()
    {
        return $this->morphedByMany(Document::class, 'taggable');
    }

    public function collections()
    {
        return $this->morphedByMany(Collection::class, 'taggable');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function scopeNameFiltered($query,$name) {
        if(!empty($name)) {
            $query->where('name','LIKE','%' . $name . '%');
        }
        return $query;
    }
}

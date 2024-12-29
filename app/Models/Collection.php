<?php

namespace App\Models;

use App\Models\Tag;
use App\Models\User;
use App\Models\Document;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Collection extends Model
{
    use HasFactory;


    protected $fillable = ['name', 'description', 'parent_id', 'user_id'];

    public function parent()
    {
        return $this->belongsTo(Collection::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Collection::class, 'parent_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'collection_id');
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

}

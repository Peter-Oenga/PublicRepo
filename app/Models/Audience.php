<?php

namespace App\Models;

use App\Models\Project;
use App\Models\Activity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Audience extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    // Relationship: Audience has many Projects
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    // Relationship: Audience has many Activities
    public function activities()
    {
        return $this->hasMany(Activity::class);
    }
}

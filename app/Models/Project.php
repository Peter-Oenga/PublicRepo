<?php

namespace App\Models;

use App\Models\Activity;
use App\Models\Audience;
use App\Models\Achievement;
use App\Models\ExpectedResult;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 
        'description', 
        'start_date', 
        'end_date', 
        'audience_id'
    ];

    // Relationship: Project belongs to one Audience
    public function audience()
    {
        return $this->belongsTo(Audience::class);
    }

    // Relationship: Project has many Activities
    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    // Relationship: Project has many Expected Results
    public function expectedResults()
    {
        return $this->hasMany(ExpectedResult::class);
    }

    // Relationship: Project has many Achievements
    public function achievements()
    {
        return $this->hasMany(Achievement::class);
    }
}

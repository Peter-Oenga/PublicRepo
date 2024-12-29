<?php

namespace App\Models;

use App\Models\Project;
use App\Models\Audience;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 
        'description', 
        'project_id', 
        'start_date', 
        'end_date', 
        'report', 
        'audience_id'
    ];

    // Relationship: Activity belongs to one Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Relationship: Activity belongs to one Audience
    public function audience()
    {
        return $this->belongsTo(Audience::class);
    }
}

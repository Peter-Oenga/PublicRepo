<?php

namespace App\Models;

use App\Models\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'description', 
        'project_id', 
        'category'
    ];

    // Relationship: Achievement belongs to one Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}

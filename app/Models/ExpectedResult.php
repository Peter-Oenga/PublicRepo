<?php

namespace App\Models;

use App\Models\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExpectedResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'description', 
        'project_id'
    ];

    // Relationship: ExpectedResult belongs to one Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}

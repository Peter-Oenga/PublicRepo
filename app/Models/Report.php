<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'document_id',
        'municipality',
        'participants',
        'workshops',
        'challenges',
        'recommendations',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'challenges' => 'array',
        'recommendations' => 'array',
    ];

    /**
     * Define relationship to the Document model.
     */
    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}

<?php

namespace App\Models;

use App\Models\Role;
use App\Models\Action;
use App\Models\Entity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = ['role_id', 'action_id', 'entity_id'];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function action()
    {
        return $this->belongsTo(Action::class);
    }

    public function entity()
    {
        return $this->belongsTo(Entity::class);
    }
}

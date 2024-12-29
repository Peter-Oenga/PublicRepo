<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;  // Add Spatie HasRoles trait
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;  // Include HasRoles trait

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'phone',
        'password',
        'avatar'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Override the default notification for password reset
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * Check if the user has a specific permission for an action on an entity.
     * 
     * @param string $action
     * @param string $entity
     * @return bool
     */
    public function hasPermission($action, $entity)
    {
        // This custom function checks if the user has a certain permission
        foreach ($this->roles as $role) {
            foreach ($role->permissions as $permission) {
                // Check if the role has the permission based on action and entity
                if ($permission->action->name === $action && $permission->entity->name === $entity) {
                    return true;
                }
            }
        }
        return false;
    }
}

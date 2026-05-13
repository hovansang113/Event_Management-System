<?php

namespace App\Models;

// app/Models/User.php
use Illuminate\Foundation\Auth\User as Authenticatable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class User extends Authenticatable implements JWTSubject
{
    use HasFactory;
    # The attributes that are mass assignable.
    # it alow create new user with these attributes
    protected $fillable = [
        'name', 'email', 'password', 'role',
        'email_verified', 'email_verified_at',
        'verification_token', 'verification_token_expires_at'
    ];
    # The attributes that should be hidden for arrays. when we return user data, these attributes will be hidden
    protected $hidden = ['password', 'verification_token'];

    # it alow us to cast these attributes to specific types when we access them. for example, when we access email_verified, it will be casted to boolean, and when we access email_verified_at, it will be casted to datetime
    protected $casts = [
        'email_verified' => 'boolean',
        'email_verified_at' => 'datetime',
        'verification_token_expires_at' => 'datetime',
    ];


    # JWTSubject interface methods implementation to generate JWT token for the user
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    # This method allows us to add custom claims to the JWT token. In this case, we are adding the user's role as a claim, which can be useful for authorization purposes when the token is decoded.
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'name' => $this->name
        
        ];
    }

        # it helps the code is cleaner and more readable when we want to check if the user's email is verified. instead of checking $user->email_verified every time, we can simply call $user->isVerified() which is more intuitive and self-explanatory.
    public function isVerified(): bool
    {
        return $this->email_verified;
    }
}
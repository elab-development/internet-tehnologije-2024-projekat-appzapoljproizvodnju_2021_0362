<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plant extends Model
{
    protected $fillable = [
        'user_id',
        'variety',
        'location',
        'planted_at',
        'last_watered_at',
        'next_watering_at',
        'last_fertilized_at',
        'next_fertilizing_at',
        'watering_count',
        'fertilizing_count',
        'health_status',
        'notes',
    ];

    protected $casts = [
        'planted_at'         => 'date',
        'last_watered_at'    => 'date',
        'next_watering_at'   => 'date',
        'last_fertilized_at' => 'date',
        'next_fertilizing_at'=> 'date',
    ];

    public function user() { return $this->belongsTo(User::class); }
}

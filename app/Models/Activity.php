<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'user_id',
        'activity_date',
        'activity_type',
    ];

    protected $casts = [
        'activity_date' => 'datetime',
    ];

    public function user() { return $this->belongsTo(User::class); }
}

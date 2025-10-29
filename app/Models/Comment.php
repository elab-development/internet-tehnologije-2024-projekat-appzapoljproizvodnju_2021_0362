<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'user_id',
        'text',
        'comment_date',
    ];

    protected $casts = [
        'comment_date' => 'datetime',
    ];

    public function user() { return $this->belongsTo(User::class); }
}

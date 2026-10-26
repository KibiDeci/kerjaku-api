<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lowongan extends Model
{
    protected $table = 'lowongan';

    protected $fillable = ['title', 'company', 'location', 'salary', 'description'];

    protected $hidden = ['created_at', 'updated_at'];

    public function lamaran()
    {
        return $this->hasMany(Lamaran::class);
    }
}

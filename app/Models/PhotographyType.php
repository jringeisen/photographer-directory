<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PhotographyType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'is_predefined',
        'user_id',
    ];

    protected $casts = [
        'is_predefined' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function listings(): BelongsToMany
    {
        return $this->belongsToMany(Listing::class, 'listing_photography_type')
            ->withTimestamps();
    }

    public function scopeAvailableFor(Builder $query, ?int $userId = null): Builder
    {
        return $query->where('is_predefined', true)
            ->orWhere('user_id', $userId);
    }
}

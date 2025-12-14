<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Listing extends Model
{
    use HasFactory;

    public const FLAG_AUTO_HIDE_THRESHOLD = 5;

    protected $fillable = [
        'user_id',
        'company_name',
        'city',
        'state',
        'phone',
        'email',
        'description',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function photographyTypes(): BelongsToMany
    {
        return $this->belongsToMany(PhotographyType::class, 'listing_photography_type')
            ->withTimestamps();
    }

    public function images(): HasMany
    {
        return $this->hasMany(ListingImage::class)->orderBy('order');
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }

    public function contactMessages(): HasMany
    {
        return $this->hasMany(ContactMessage::class);
    }

    public function flags(): HasMany
    {
        return $this->hasMany(Flag::class);
    }

    public function scopeVisible(Builder $query): Builder
    {
        $cutoff = now()->subDay();

        return $query
            ->whereHas('user', fn (Builder $userQuery) => $userQuery->where('verification_status', '!=', 'rejected'))
            ->whereRaw(
                '(select count(*) from flags where flags.listing_id = listings.id and flags.status = ? and flags.created_at >= ?) < ?',
                [Flag::STATUS_PENDING, $cutoff, self::FLAG_AUTO_HIDE_THRESHOLD]
            );
    }

    public function pendingFlagsCount(): int
    {
        return $this->flags()
            ->where('status', Flag::STATUS_PENDING)
            ->where('created_at', '>=', now()->subDay())
            ->count();
    }

    public function isHiddenFromPublic(): bool
    {
        $this->loadMissing('user');

        if ($this->user?->verification_status === 'rejected') {
            return true;
        }

        return $this->pendingFlagsCount() >= self::FLAG_AUTO_HIDE_THRESHOLD;
    }

    public function getLocationAttribute(): string
    {
        return "{$this->city}, {$this->state}";
    }
}

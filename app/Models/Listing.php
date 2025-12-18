<?php

namespace App\Models;

use App\Enums\FlagStatus;
use App\Enums\UserVerificationStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Listing extends Model
{
    use HasFactory;
    use Searchable;

    public const FLAG_AUTO_HIDE_THRESHOLD = 5;

    protected $fillable = [
        'user_id',
        'company_name',
        'city',
        'state',
        'phone',
        'email',
        'description',
        'starting_price_cents',
        'ending_price_cents',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starting_price_cents' => 'integer',
            'ending_price_cents' => 'integer',
        ];
    }

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

    public function highlights(): HasMany
    {
        return $this->hasMany(ListingHighlight::class)->orderBy('sort_order');
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
            ->whereDoesntHave('flags', fn (Builder $flagQuery) => $flagQuery
                ->where('status', FlagStatus::Rejected->value))
            ->whereHas(
                'user',
                fn (Builder $userQuery) => $userQuery->where(
                    'verification_status',
                    '!=',
                    UserVerificationStatus::Rejected->value
                )
            )
            ->whereRaw(
                '(select count(*) from flags where flags.listing_id = listings.id and flags.status = ? and flags.created_at >= ?) < ?',
                [FlagStatus::Pending->value, $cutoff, self::FLAG_AUTO_HIDE_THRESHOLD]
            );
    }

    public function pendingFlagsCount(): int
    {
        return $this->flags()
            ->where('status', FlagStatus::Pending->value)
            ->where('created_at', '>=', now()->subDay())
            ->count();
    }

    public function isHiddenFromPublic(): bool
    {
        $this->loadMissing('user');

        if ($this->user?->verification_status === UserVerificationStatus::Rejected) {
            return true;
        }

        if ($this->flags()->where('status', FlagStatus::Rejected->value)->exists()) {
            return true;
        }

        return $this->pendingFlagsCount() >= self::FLAG_AUTO_HIDE_THRESHOLD;
    }

    public function shouldBeSearchable(): bool
    {
        return ! $this->isHiddenFromPublic();
    }

    public function getLocationAttribute(): string
    {
        return collect([$this->city, $this->state])
            ->filter()
            ->implode(', ');
    }

    public function searchableAs(): string
    {
        return 'listings';
    }

    /**
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        $photographyTypes = $this->photographyTypeNames();

        return [
            'id' => (int) $this->id,
            'company_name' => $this->company_name,
            'city' => $this->city,
            'state' => $this->state,
            'location' => $this->location,
            'description' => $this->description,
            'keywords' => $this->buildKeywordText(),
            'photography_types' => $photographyTypes,
            'location_phrase' => $this->location ? "photographers in {$this->location}" : null,
            'created_at' => $this->created_at?->timestamp,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function buildKeywordText(): string
    {
        $types = $this->photographyTypeNames();

        return collect([
            $this->company_name,
            $this->description,
            $this->location,
            $types->implode(' '),
            $types->map(fn ($type) => "{$type} photographers")->implode(' '),
            'photographer',
            'photographers',
        ])->filter()->join(' ');
    }

    /**
     * @return \Illuminate\Support\Collection<int, string>
     */
    protected function photographyTypeNames(): \Illuminate\Support\Collection
    {
        if ($this->relationLoaded('photographyTypes')) {
            return $this->photographyTypes->pluck('name')->filter();
        }

        return $this->photographyTypes()->pluck('name')->filter();
    }
}

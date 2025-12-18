<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingHighlight extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'listing_id',
        'body',
        'sort_order',
    ];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UploadSession extends Model
{
    /** @use HasFactory<\Database\Factories\UploadSessionFactory> */
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_ATTACHED = 'attached';

    public const STATUS_ABORTED = 'aborted';

    protected $fillable = [
        'public_id',
        'user_id',
        'disk',
        'purpose',
        'directory',
        'filename',
        'content_type',
        'content_length',
        'part_size',
        'part_count',
        'upload_id',
        'storage_path',
        'status',
        'parts',
        'completed_at',
        'expires_at',
        'attached_to_type',
        'attached_to_id',
        'error',
    ];

    protected $casts = [
        'content_length' => 'integer',
        'part_size' => 'integer',
        'part_count' => 'integer',
        'completed_at' => 'datetime',
        'expires_at' => 'datetime',
        'parts' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getRouteKeyName(): string
    {
        return 'public_id';
    }

    public function scopeBelongingToUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function isComplete(): bool
    {
        return $this->status === self::STATUS_COMPLETED || $this->status === self::STATUS_ATTACHED;
    }

    public function isAttachable(): bool
    {
        return $this->status === self::STATUS_COMPLETED && $this->attached_to_id === null;
    }
}

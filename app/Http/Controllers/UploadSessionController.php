<?php

namespace App\Http\Controllers;

use App\Enums\UploadSessionStatus;
use App\Http\Requests\CompleteUploadSessionRequest;
use App\Http\Requests\StoreUploadSessionRequest;
use App\Models\UploadSession;
use App\Services\UploadSessionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class UploadSessionController extends Controller
{
    public function __construct(
        protected UploadSessionService $uploadService
    ) {}

    public function store(StoreUploadSessionRequest $request): JsonResponse
    {
        [$session, $urls] = $this->uploadService->createSession(
            user: $request->user(),
            filename: $request->string('filename')->toString(),
            contentType: $request->string('content_type')->toString(),
            contentLength: (int) $request->input('content_length'),
            purpose: $request->string('purpose')->toString(),
        );

        return response()->json([
            'id' => $session->public_id,
            'part_size' => $session->part_size,
            'part_count' => $session->part_count,
            'upload_id' => $session->upload_id,
            'storage_path' => $session->storage_path,
            'urls' => $urls,
            'expires_at' => $session->expires_at?->toIso8601String(),
        ], Response::HTTP_CREATED);
    }

    public function complete(CompleteUploadSessionRequest $request, UploadSession $uploadSession): JsonResponse
    {
        $this->abortIfForbidden($request->user()->id, $uploadSession);

        if ($uploadSession->status !== UploadSessionStatus::Pending) {
            return response()->json([
                'message' => 'This upload session is no longer active.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $session = $this->uploadService->complete($uploadSession, $request->input('parts'));

        return response()->json([
            'id' => $session->public_id,
            'storage_path' => $session->storage_path,
            'disk' => $session->disk,
            'filename' => $session->filename,
            'status' => $session->status,
        ]);
    }

    public function destroy(UploadSession $uploadSession): JsonResponse
    {
        $this->abortIfForbidden(auth()->id(), $uploadSession);

        if ($uploadSession->status === UploadSessionStatus::Attached) {
            return response()->json([
                'message' => 'Completed uploads already attached to a record cannot be removed.',
            ], Response::HTTP_BAD_REQUEST);
        }

        if ($uploadSession->status === UploadSessionStatus::Completed) {
            Storage::disk($uploadSession->disk)->delete($uploadSession->storage_path);

            $uploadSession->update([
                'status' => UploadSessionStatus::Aborted,
                'error' => 'Upload removed before attachment.',
            ]);

            return response()->json(['status' => 'deleted']);
        }

        $this->uploadService->abort($uploadSession);

        return response()->json(['status' => 'aborted']);
    }

    protected function abortIfForbidden(int $userId, UploadSession $session): void
    {
        abort_if($session->user_id !== $userId, Response::HTTP_FORBIDDEN);
    }
}

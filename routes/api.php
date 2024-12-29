<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TagController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ActionController;
use App\Http\Controllers\EntityController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AudienceController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\EventOutcomeController;
use App\Http\Controllers\ExpectedResultController;

// USER MANAGEMENT
Route::prefix('users')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/request-password-reset', [AuthController::class, 'requestPasswordReset']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::get('/profile', [AuthController::class, 'getAuthenticatedUser'])->middleware('auth:sanctum');

    //Specific user by ID
    Route::get('/{user}', [AuthController::class, 'show'])->middleware('auth:sanctum');
    //Update User
    Route::post('/{user}/update', [AuthController::class, 'update'])->middleware('auth:sanctum');
    //Logout User
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// COLLECTION MANAGEMENT
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Additional custom routes
    Route::get('collections/root', [CollectionController::class, 'getRoot']);
    Route::get('collections/{id}/children', [CollectionController::class, 'getChildren']);
    Route::post('collections/{id}/move', [CollectionController::class, 'moveCollection']);
    Route::get('collections/rootId', [CollectionController::class, 'fetchRootId']);

    // Explicitly declare resourceful routes with route model binding
    Route::get('/collections', [CollectionController::class, 'index']);
    Route::post('/collections', [CollectionController::class, 'store']);


    Route::get('/collections/{collection}', [CollectionController::class, 'show']);
    Route::post('/collections/{collection}/update', [CollectionController::class, 'update']); // Replacing PUT with POST
    Route::post('/collections/{collection}/delete', [CollectionController::class, 'destroy']); // Replacing DELETE with POST
});

// DOCUMENT AND VERSIONS MANAGEMENT
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Additional custom routes with route model binding
    Route::get('/documents/{document}/download', [DocumentController::class, 'downloadDocument']);
    Route::post('/documents/{document}/move', [DocumentController::class, 'moveDocument']);
    Route::post('/documents/{document}/versions', [DocumentController::class, 'createVersion']);
    Route::post('/documents/{document}/restore/{versionId}', [DocumentController::class, 'restoreVersion']);
    Route::get('/documents/{document}/versions/{versionId}/download', [DocumentController::class, 'downloadVersion']);

    // Explicitly declare resourceful routes with route model binding
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{document}', [DocumentController::class, 'show']);
    Route::post('/documents/{document}/update', [DocumentController::class, 'update']); // Replacing PUT with POST
    Route::post('/documents/{document}/delete', [DocumentController::class, 'destroy']); // Replacing DELETE with POST
});

// REPORT MANAGEMENT
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Additional custom routes
    Route::get('reports', [ReportController::class, 'index']);
    Route::get('reports/{report}', [ReportController::class, 'show']);
    Route::post('reports', [ReportController::class, 'store']);
    Route::post('reports/{report}/update', [ReportController::class, 'update']);
    Route::post('reports/{report}/delete', [ReportController::class, 'destroy']);
    Route::post('reports/{report}/upload', [ReportController::class, 'uploadReport']);
    Route::post('reports/{report}/download', [ReportController::class, 'downloadReport']);

    // Fetch reports for a specific document
    Route::get('/reports/by-document/{document}', [ReportController::class, 'getReportsByDocumentId']);
});



// EVENT MANAGEMENT
Route::middleware('auth:sanctum')->group(function () {
    Route::get('events/upcoming', [EventController::class, 'getUpcomingEvents']);
    Route::get('events/past', [EventController::class, 'getPastEvents']);

    // Explicitly declare resourceful routes with route model binding
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events/{event}', [EventController::class, 'show']);
    Route::post('/events/{event}/update', [EventController::class, 'update']); // Replacing PUT with POST
    Route::post('/events/{event}/delete', [EventController::class, 'destroy']); // Replacing DELETE with POST

    // Update Event Poster
    Route::post('events/{event}/poster', [EventController::class, 'addPoster']);

    // Event Outcomes CRUD operations
    Route::prefix('events/{event}/outcomes')->group(function () {
        Route::get('/', [EventOutcomeController::class, 'index']);
        Route::post('/', [EventOutcomeController::class, 'store']);
        Route::get('/{outcome}', [EventOutcomeController::class, 'show']);
        Route::post('/{outcome}/update', [EventOutcomeController::class, 'update']); // Replacing PUT with POST
        Route::post('/{outcome}/delete', [EventOutcomeController::class, 'destroy']); // Replacing DELETE with POST

        // File Management for Event Outcomes 
        Route::post('/{outcome}/files', [EventOutcomeController::class, 'addFile']);
        Route::post('/{outcome}/files/{file}/delete', [EventOutcomeController::class, 'removeFile']); // Replacing DELETE with POST

        // Image Management for Event Outcomes
        Route::post('/{outcome}/images', [EventOutcomeController::class, 'addImage']);
        Route::post('/{outcome}/images/{image}/delete', [EventOutcomeController::class, 'removeImage']); // Replacing DELETE with POST
    });

    // File Management for Events
    Route::prefix('events/{event}/files')->group(function () {
        Route::post('/', [EventController::class, 'addFile']);
        Route::post('/{file}/delete', [EventController::class, 'removeFile']); // Replacing DELETE with POST
    });
});

Route::middleware('auth:sanctum')->group(function () {
    // TAG MANAGEMENT
    Route::get('/tags', [TagController::class, 'index']);
    Route::post('/tags', [TagController::class, 'store']);
    Route::get('/tags/{tag}', [TagController::class, 'show']);
    Route::post('/tags/{tag}/update', [TagController::class, 'update']); // Replacing PUT with POST
    Route::post('/tags/{tag}/delete', [TagController::class, 'destroy']); // Replacing DELETE with POST

    // ROLE MANAGEMENT
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/roles/{role}', [RoleController::class, 'show']);
    Route::post('/roles/{role}/update', [RoleController::class, 'update']); // Replacing PUT with POST
    Route::post('/roles/{role}/delete', [RoleController::class, 'destroy']); // Replacing DELETE with POST

    // PERMISSION MANAGEMENT
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::post('/permissions', [PermissionController::class, 'store']);
    Route::get('/permissions/{permission}', [PermissionController::class, 'show']);
    Route::post('/permissions/{permission}/update', [PermissionController::class, 'update']); // Replacing PUT with POST
    Route::post('/permissions/{permission}/delete', [PermissionController::class, 'destroy']); // Replacing DELETE with POST
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('actions', [ActionController::class, 'index']);
    Route::get('entities', [EntityController::class, 'index']);
});

Route::middleware('auth:sanctum')->group(function () {
    // Audiences CRUD
    Route::get('/audiences', [AudienceController::class, 'index'])->name('audiences.index');
    Route::post('/audiences', [AudienceController::class, 'store'])->name('audiences.store');
    Route::get('/audiences/{audience}', [AudienceController::class, 'show'])->name('audiences.show');
    Route::post('/audiences/{audience}/update', [AudienceController::class, 'update'])->name('audiences.update');
    Route::post('/audiences/{audience}/delete', [AudienceController::class, 'destroy'])->name('audiences.destroy');

    // Projects CRUD
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::post('/projects/{project}/update', [ProjectController::class, 'update'])->name('projects.update');
    Route::post('/projects/{project}/delete', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Routes for Activities, Expected Results, and Achievements under a Project
    Route::prefix('projects/{project}')->group(function () {
        // Activities CRUD
        Route::get('/activities', [ActivityController::class, 'index'])->name('activities.index');
        Route::post('/activities', [ActivityController::class, 'store'])->name('activities.store');
        Route::get('/activities/{activity}', [ActivityController::class, 'show'])->name('activities.show');
        Route::post('/activities/{activity}/update', [ActivityController::class, 'update'])->name('activities.update');
        Route::post('/activities/{activity}/delete', [ActivityController::class, 'destroy'])->name('activities.destroy');

        //Activity Report 
        Route::post('/activities/{activity}/upload-report', [ActivityController::class, 'uploadReport'])->name('activities.uploadReport');

        // Expected Results CRUD
        Route::get('/expected-results', [ExpectedResultController::class, 'index'])->name('expected-results.index');
        Route::post('/expected-results', [ExpectedResultController::class, 'store'])->name('expected-results.store');
        Route::get('/expected-results/{expectedResult}', [ExpectedResultController::class, 'show'])->name('expected-results.show');
        Route::post('/expected-results/{expectedResult}/update', [ExpectedResultController::class, 'update'])->name('expected-results.update');
        Route::post('/expected-results/{expectedResult}/delete', [ExpectedResultController::class, 'destroy'])->name('expected-results.destroy');

        // Achievements CRUD
        Route::get('/achievements', [AchievementController::class, 'index'])->name('achievements.index');
        Route::post('/achievements', [AchievementController::class, 'store'])->name('achievements.store');
        Route::get('/achievements/{achievement}', [AchievementController::class, 'show'])->name('achievements.show');
        Route::post('/achievements/{achievement}/update', [AchievementController::class, 'update'])->name('achievements.update');
        Route::post('/achievements/{achievement}/delete', [AchievementController::class, 'destroy'])->name('achievements.destroy');
    });
});

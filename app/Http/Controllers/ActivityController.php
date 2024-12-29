<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ActivityController extends Controller
{
    public function index()
    {
        return Activity::with('project', 'audience')->get();
    }

    public function store(Request $request, Project $project)
    {
        // Validate request
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'report' => 'nullable|file|mimes:pdf,docx,jpeg,png', // Validate file type
            'audience_id' => 'required|exists:audiences,id',
        ]);

        // Handle file upload if provided
        if ($request->hasFile('report')) {
            $filePath = $request->file('report')->store('reports', 'public'); // Store the file in 'public' disk
        } else {
            $filePath = null;
        }

        // Create the activity and associate it with the project
        $activity = $project->activities()->create($request->only([
            'title',
            'description',
            'start_date',
            'end_date',
            'audience_id'
        ]) + ['report' => $filePath]); // Add file path to the activity

        return $activity;
    }

    public function show(Project $project,Activity $activity)
    {
        return $activity->load('project', 'audience');
    }

    public function update(Request $request, Project $project, Activity $activity)
    {
        // Validate request
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'report' => 'nullable|file|mimes:pdf,docx,jpeg,png', // Validate file type
            'audience_id' => 'required|exists:audiences,id',
        ]);

        // Handle file upload if provided
        if ($request->hasFile('report')) {
            // Delete the old report if exists
            if ($activity->report && Storage::exists($activity->report)) {
                Storage::delete($activity->report);
            }

            // Store the new file and update report path
            $filePath = $request->file('report')->store('reports', 'public');
        } else {
            // If no new file is uploaded, retain the current file path
            $filePath = $activity->report;
        }

        // Update the activity
        $activity->update($request->only([
            'title',
            'description',
            'start_date',
            'end_date',
            'audience_id'
        ]) + ['report' => $filePath]); // Only update report if there's a new file

        return $activity;
    }

    public function destroy(Project $project,Activity $activity)
    {
        // Delete the report file if it exists
        if ($activity->report && Storage::exists($activity->report)) {
            Storage::delete($activity->report);
        }

        $activity->delete();
        return response()->noContent();
    }

    // Separate method to handle report upload
    public function uploadReport(Request $request, Project $project, Activity $activity)
    {
        $request->validate([
            'report' => 'required|file|mimes:pdf,docx,jpeg,png',
        ]);

        // Delete the old report if exists
        if ($activity->report && Storage::exists($activity->report)) {
            Storage::delete($activity->report);
        }

        // Store the new report
        $filePath = $request->file('report')->store('reports', 'public');

        // Update the activity's report field
        $activity->update(['report' => $filePath]);

        return response()->json(['message' => 'Report uploaded successfully']);
    }
}

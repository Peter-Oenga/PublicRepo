<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\Project;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index(Project $project)
    {
        // Get achievements for the specific project
        return $project->achievements()->get();
    }

    public function store(Request $request, Project $project)
    {
        $request->validate([
            'description' => 'required|string',
            'category' => 'required|string|max:255|in:main,other',
        ]);

        // Create a new achievement for the specific project
        $achievement = $project->achievements()->create($request->all());

        return $achievement;
    }

    public function show(Project $project, Achievement $achievement)
    {
        // Load the achievement associated with the given project
        return $achievement->load('project');
    }

    public function update(Request $request, Project $project, Achievement $achievement)
    {
        $request->validate([
            'description' => 'required|string',
            'category' => 'required|string|max:255|in:main,other',
        ]);

        // Update the achievement for the specific project
        $achievement->update($request->all());

        return $achievement;
    }

    public function destroy(Project $project, Achievement $achievement)
    {
        // Delete the achievement for the specific project
        $achievement->delete();

        return response()->noContent();
    }
}

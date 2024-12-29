<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExpectedResult;
use App\Models\Project;

class ExpectedResultController extends Controller
{
    public function index(Project $project)
    {
        // Get expected results for the specific project
        return $project->expectedResults()->get();
    }

    public function store(Request $request, Project $project)
    {
        $request->validate([
            'description' => 'required|string',
        ]);

        // Create a new expected result for the specific project
        $expectedResult = $project->expectedResults()->create($request->all());

        return $expectedResult;
    }

    public function show(Project $project, ExpectedResult $expectedResult)
    {
        // Load the expected result associated with the given project
        return $expectedResult->load('project');
    }

    public function update(Request $request, Project $project, ExpectedResult $expectedResult)
    {
        $request->validate([
            'description' => 'required|string',
        ]);

        // Update the expected result for the specific project
        $expectedResult->update($request->all());

        return $expectedResult;
    }

    public function destroy(Project $project, ExpectedResult $expectedResult)
    {
        // Delete the expected result for the specific project
        $expectedResult->delete();

        return response()->noContent();
    }
}

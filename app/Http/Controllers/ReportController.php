<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Document;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reports = Report::with('document')->get();
        return response()->json($reports);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'document_id' => 'required|exists:documents,id',
            'municipality' => 'required|string|max:255',
            'participants' => 'required|integer|min:0',
            'workshops' => 'nullable|integer|min:0',
            'challenges' => 'nullable|array',
            'recommendations' => 'nullable|array',
        ]);

        $report = Report::create([
            'document_id' => $request->input('document_id'),
            'municipality' => $request->input('municipality'),
            'participants' => $request->input('participants'),
            'workshops' => $request->input('workshops'),
            // 'challenges' => $request->input('challenges') ? explode(',', $request->input('challenges')) : null,
            // 'recommendations' => $request->input('recommendations') ? explode(',', $request->input('recommendations')) : null,
        ]);

        return response()->json($report, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $report = Report::with('document')->findOrFail($id);
        return response()->json($report);
    }

    /**
     * Fetch report data linked to a specific document
     */

    public function getReportsByDocumentId($documentId)
    {
        // Fetch all reports linked to the given document ID
        $reports = Report::where('document_id', $documentId)->get();

        // Return the reports as a JSON response
        return response()->json($reports, 200);
    }




    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'municipality' => 'nullable|string|max:255',
            'participants' => 'nullable|integer|min:0',
            'workshops' => 'nullable|integer|min:0',
            'challenges' => 'nullable|array',
            'recommendations' => 'nullable|array',
        ]);

        $report = Report::findOrFail($id);
        $report->update($request->only(
            'municipality',
            'participants',
            'workshops',
            'challenges',
            'recommendations'
        ));

        return response()->json($report);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();

        return response()->json(['message' => 'Report deleted successfully']);
    }
}

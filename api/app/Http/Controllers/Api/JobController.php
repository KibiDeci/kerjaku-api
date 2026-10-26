<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lowongan;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = Lowongan::query();
        $search = $request->query('search');

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        return response()->json($query->orderBy('id')->get());
    }

    public function show($id)
    {
        $job = Lowongan::find($id);

        if (! $job) {
            return response()->json(['message' => 'Lowongan tidak ditemukan'], 404);
        }

        return response()->json($job);
    }
}

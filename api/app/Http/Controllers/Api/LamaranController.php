<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lamaran;
use App\Models\Lowongan;
use App\Models\User;
use Illuminate\Http\Request;

class LamaranController extends Controller
{
    public function index(Request $request)
    {
        $query = Lamaran::with('user');

        if ($request->filled('username')) {
            $query->whereHas('user', fn ($q) => $q->where('username', $request->username));
        }

        if ($request->filled('jobId')) {
            $query->where('lowongan_id', (int) $request->jobId);
        }

        $list = $query->orderBy('id')->get()->map(fn ($l) => $this->format($l));

        return response()->json($list);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'jobId' => 'required|integer',
            'username' => 'required|string',
            'cv' => 'required|string',
            'pesan' => 'nullable|string',
        ], [
            'cv.required' => 'Link CV wajib diisi',
        ]);

        $job = Lowongan::find($data['jobId']);
        $user = User::where('username', $data['username'])->first();

        if (! $job || ! $user) {
            return response()->json(['message' => 'Lowongan atau user tidak ditemukan'], 404);
        }

        $sudah = Lamaran::where('lowongan_id', $job->id)->where('user_id', $user->id)->exists();

        if ($sudah) {
            return response()->json(['message' => 'Kamu sudah melamar lowongan ini'], 422);
        }

        $lamaran = Lamaran::create([
            'lowongan_id' => $job->id,
            'user_id' => $user->id,
            'cv' => $data['cv'],
            'pesan' => $data['pesan'] ?? '',
        ]);

        return response()->json($this->format($lamaran->load('user')), 201);
    }

    private function format(Lamaran $lamaran)
    {
        return [
            'id' => $lamaran->id,
            'jobId' => $lamaran->lowongan_id,
            'username' => $lamaran->user->username,
            'nama' => $lamaran->user->name,
            'email' => $lamaran->user->email,
            'cv' => $lamaran->cv,
            'pesan' => $lamaran->pesan ?? '',
            'tanggal' => $lamaran->created_at->toDateTimeString(),
        ];
    }
}

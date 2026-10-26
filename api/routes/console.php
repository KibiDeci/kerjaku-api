<?php

use Illuminate\Foundation\Inspiring;
use App\Models\Lowongan;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Membuat API statis (file JSON) dari database SQLite ke folder docs/api untuk GitHub Pages
Artisan::command('api:static', function () {
    $out = base_path('../docs/api');
    $updatedAt = now()->toDateString();

    $tulis = function ($file, $data, $resource) use ($out, $updatedAt) {
        $lokasi = $out . '/' . $file;
        File::ensureDirectoryExists(dirname($lokasi));
        $isi = ['data' => $data, 'meta' => ['resource' => $resource, 'updated_at' => $updatedAt]];
        File::put($lokasi, json_encode($isi, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        $this->line("dibuat: docs/api/{$file}");
    };

    File::deleteDirectory($out);

    $jobs = Lowongan::orderBy('id')->get();

    // 1. Semua lowongan
    $tulis('jobs.json', $jobs->map->only(['id', 'title', 'company', 'location', 'salary'])->values(), 'jobs');

    // 2. Detail lowongan
    foreach ($jobs as $job) {
        $tulis("jobs/{$job->id}.json", $job, 'job');
    }

    // 3. Daftar lokasi dan lowongan per lokasi
    $lokasi = $jobs->groupBy('location');
    $tulis('locations.json', $lokasi->keys()->map(fn ($nama) => [
        'code' => Str::slug($nama),
        'name' => $nama,
        'total_jobs' => $lokasi[$nama]->count(),
    ])->values(), 'locations');

    foreach ($lokasi as $nama => $list) {
        $tulis('locations/' . Str::slug($nama) . '.json', $list->map->only(['id', 'title', 'company', 'location', 'salary'])->values(), 'jobs_by_location');
    }

    $this->info('Selesai. Total lowongan: ' . $jobs->count());
})->purpose('Export data SQLite ke JSON statis (docs/api)');

<?php

namespace App\Services;

use Illuminate\Support\Facades\File;

class JsonStore
{
    private static function path($name)
    {
        return storage_path("app/data/{$name}.json");
    }

    public static function get($name)
    {
        $path = self::path($name);

        if (! File::exists($path)) {
            return [];
        }

        return json_decode(File::get($path), true) ?? [];
    }

    public static function save($name, $data)
    {
        File::put(
            self::path($name),
            json_encode(array_values($data), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        );
    }
}
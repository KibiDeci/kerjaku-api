<?php

namespace Database\Seeders;

use App\Models\Lowongan;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'username' => 'admin',
            'name' => 'Admin',
            'email' => 'admin@kerjaku.com',
            'phone' => '081234567890',
            'password' => 'admin123',
        ]);

        User::create([
            'username' => 'anggia',
            'name' => 'Anggia',
            'email' => 'anggia@kerjaku.com',
            'phone' => '081298765432',
            'password' => 'kerja123',
        ]);

        $lowongan = [
            ['title' => 'Frontend Developer', 'company' => 'PT Teknologi Nusantara', 'location' => 'Jakarta', 'salary' => 'Rp8.000.000', 'description' => 'Membuat tampilan website menggunakan React.'],
            ['title' => 'Mobile Developer', 'company' => 'Aplikasi Kita', 'location' => 'Bandung', 'salary' => 'Rp7.000.000', 'description' => 'Membuat aplikasi Android dan iOS menggunakan Ionic.'],
            ['title' => 'UI/UX Designer', 'company' => 'Kreatif Digital', 'location' => 'Yogyakarta', 'salary' => 'Rp6.000.000', 'description' => 'Mendesain tampilan aplikasi menggunakan Figma.'],
            ['title' => 'Digital Marketing', 'company' => 'Toko Maju', 'location' => 'Surabaya', 'salary' => 'Rp5.500.000', 'description' => 'Mengelola iklan dan media sosial perusahaan.'],
            ['title' => 'Staff Admin', 'company' => 'PT Sinar Abadi', 'location' => 'Bekasi', 'salary' => 'Rp4.500.000', 'description' => 'Mengelola surat dan arsip kantor.'],
            ['title' => 'Data Analyst', 'company' => 'Analitika Data', 'location' => 'Jakarta', 'salary' => 'Rp9.000.000', 'description' => 'Mengolah data dan membuat laporan untuk tim bisnis.'],
        ];

        foreach ($lowongan as $data) {
            Lowongan::create($data);
        }
    }
}

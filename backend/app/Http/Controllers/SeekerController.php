<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\SeekerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SeekerController extends Controller
{
  // Lihat semua lamaran milik seeker yang login
  public function myApplications() {
    $applications = Application::with(['job.company', 'job.category'])
    ->where('user_id', Auth::id())
    ->latest()
    ->get();

    return response()->json($applications);
  }

  // Kirim lamaran ke sebuah lowongan
  public function apply(Request $request, $jobId) {
    // Validasi input
    $request->validate([
      'cv' => 'required|file|mimes:pdf|max:2048',
      'cover_letter' => 'nullable|string',
    ]);

    // Cegah apply dua kali ke job yang sama
    $alreadyApplied = Application::where('user_id', Auth::id())
    ->where('job_id', $jobId)
    ->exists();

    if ($alreadyApplied) {
      return response()->json([
        'message' => 'Kamu sudah melamar ke lowongan ini.'
      ], 409);
    }

    // Simpan file CV ke storage
    $cvPath = $request->file('cv')->store('cvs', 'public');

    // Buat record lamaran baru
    $application = Application::create([
      'job_id' => $jobId,
      'user_id' => Auth::id(),
      'cv_path' => $cvPath,
      'cover_letter' => $request->cover_letter,
    ]);

    return response()->json([
      'message' => 'Lamaran berhasil dikirim',
      'application' => $application,
    ], 201);
  }

  // Lihat profil seeker yang login
  public function profile() {
    $profile = SeekerProfile::firstOrCreate(
      ['user_id' => Auth::id()]
    );

    return response()->json($profile);
  }

  // Update profil seeker
  public function updateProfile(Request $request) {
    $request->validate([
      'bio' => 'nullable|string',
      'skills' => 'nullable|string',
      'portfolio_url' => 'nullable|url',
    ]);

    // Cari atau buat profil, lalu update
    $profile = SeekerProfile::updateOrCreate(
      ['user_id' => Auth::id()],
      $request->only(['bio', 'skills', 'portfolio_url'])
    );

    return response()->json([
      'message' => 'Profil berhasil diupdate',
      'profile' => $profile,
    ]);
  }
}
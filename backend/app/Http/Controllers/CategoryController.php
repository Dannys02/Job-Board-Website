<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    // Ambil semua kategori (public)
    public function index()
    {
        $categories = Category::latest()->get();

        return response()->json($categories);
    }

    // Buat kategori baru (admin only)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:categories,name',
        ]);

        $category = Category::create([
            'name' => $request->name,
            // Auto generate slug dari name
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'message'  => 'Kategori berhasil dibuat',
            'category' => $category,
        ], 201);
    }

    // Update kategori (admin only)
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|unique:categories,name,' . $id,
        ]);

        $category->update([
            'name' => $request->name,
            // Update slug sesuai name baru
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'message'  => 'Kategori berhasil diupdate',
            'category' => $category,
        ]);
    }

    // Hapus kategori (admin only)
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus',
        ]);
    }
}
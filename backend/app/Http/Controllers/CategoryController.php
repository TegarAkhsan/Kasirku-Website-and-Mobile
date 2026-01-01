<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return \App\Models\Category::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        return \App\Models\Category::create($validated);
    }

    public function show(\App\Models\Category $category)
    {
        return $category;
    }

    public function update(Request $request, \App\Models\Category $category)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'is_active' => 'boolean'
        ]);

        $category->update($validated);
        return $category;
    }

    public function destroy(\App\Models\Category $category)
    {
        $category->delete();
        return response()->noContent();
    }
}

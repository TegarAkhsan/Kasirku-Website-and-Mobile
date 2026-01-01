<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Cashiers only see active products
        if ($request->user()->role === 'kasir') {
            $query->where('is_active', true);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'ilike', '%' . $request->search . '%');
        }

        return response()->json($query->orderBy('name', 'asc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:2048'
        ]);

        $product = new Product($validated);
        $product->tenant_id = $request->user()->tenant_id;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->image = $path;
        }

        $product->save();

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        // Scope ensures we only update our own product
        $validated = $request->validate([
            'name' => 'string',
            'price' => 'numeric',
            'stock' => 'integer',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = $path;
        }

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}

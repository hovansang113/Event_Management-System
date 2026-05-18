<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    public function all(): Collection
    {
        return Category::withTrashed()->get();
    }

    public function getActive(): Collection
    {
        return Category::active()->get();
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function findOrFail($id): Category
    {
        return Category::findOrFail($id);
    }

    public function update($id, array $data): Category
    {
        $category = Category::findOrFail($id);
        $category->update($data);
        return $category;
    }

    public function delete($id): ?bool
    {
        $category = Category::findOrFail($id);
        return $category->delete();
    }

    public function restore($id): bool
    {
        $category = Category::withTrashed()->findOrFail($id);
        return $category->restore();
    }

    public function deactivate($id): Category
    {
        $category = Category::findOrFail($id);
        $category->update(['is_active' => false]);
        return $category;
    }

    public function activate($id): Category
    {
        $category = Category::findOrFail($id);
        $category->update(['is_active' => true]);
        return $category;
    }

    public function getTrashed(): Collection
    {
        return Category::onlyTrashed()->get();
    }
}

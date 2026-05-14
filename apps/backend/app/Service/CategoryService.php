<?php
namespace App\Service;
use App\Models\Category;
use Illuminate\Support\Str;



class CategoryService{
    public function getAllCategories(){
        return Category::all();
    }

    public function createCategory($data){
        return Category::create($data);
    }

    public function updateCategory($id, array $data){
        $category = Category::findOrFail($id);

        $category->update($data);

        return $category;
    }

    public function deleteCategory($id){
        $category = Category::findOrFail($id);

        return $category->delete();

        
    }
}


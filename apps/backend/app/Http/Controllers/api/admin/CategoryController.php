<?php
namespace App\Http\Controllers\api\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\Category\CategoryResource;
use App\Service\CategoryService;
use App\Traits\ApiResponse;

class CategoryController extends Controller
{
    use ApiResponse;
    protected $categoryService;
    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(){
        $categories = $this->categoryService->getAllCategories();
        return $this->success(CategoryResource::collection($categories), 'Categories retrieved successfully');
    }
    public function store(StoreCategoryRequest $request){
        $category = $this->categoryService->createCategory($request->validated());

        return $this->success(new CategoryResource($category), 'Category created successfully', 201);
    }
    
    public function update(UpdateCategoryRequest $request, $id){
        $category = $this->categoryService->updateCategory($id, $request->validated());

        return $this->success(new CategoryResource($category), 'Category updated successfully');
    }

    public function destroy($id){
        $this->categoryService->deleteCategory($id);

        return $this->success(null, 'Category deleted successfully');
    }
}

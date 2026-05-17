<?php
namespace App\Http\Controllers\api\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\Category\CategoryResource;
use App\Repositories\CategoryRepository;
use App\Traits\ApiResponse;

class CategoryController extends Controller
{
    use ApiResponse;
    protected $categoryRepository;
    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function index(){
        $categories = $this->categoryRepository->all();
        return $this->success(CategoryResource::collection($categories), 'Categories retrieved successfully');
    }
    public function store(StoreCategoryRequest $request){
        $category = $this->categoryRepository->create($request->validated());

        return $this->success(new CategoryResource($category), 'Category created successfully', 201);
    }
    
    public function update(UpdateCategoryRequest $request, $id){
        $category = $this->categoryRepository->update($id, $request->validated());

        return $this->success(new CategoryResource($category), 'Category updated successfully');
    }

    public function destroy($id){
        $this->categoryRepository->delete($id);

        return $this->success(null, 'Category deleted successfully');
    }
}

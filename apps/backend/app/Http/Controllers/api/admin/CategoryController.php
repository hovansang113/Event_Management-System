<?php

namespace App\Http\Controllers\api\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\Category\CategoryResource;
use App\Services\CategoryService;
use App\Traits\ApiResponse;
use Exception;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    use ApiResponse;

    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(): JsonResponse
    {
        try {
            $categories = $this->categoryService->all();
            return $this->success(CategoryResource::collection($categories), 'Categories retrieved successfully');
        } catch (Exception $e) {
            return $this->error('Failed to retrieve categories: ' . $e->getMessage(), 500);
        }
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        try {
            $category = $this->categoryService->create($request->validated());
            return $this->success(new CategoryResource($category), 'Category created successfully', 201);
        } catch (Exception $e) {
            return $this->error('Failed to create category: ' . $e->getMessage(), 500);
        }
    }

    public function update(UpdateCategoryRequest $request, $id): JsonResponse
    {
        try {
            $this->categoryService->update($id, $request->validated());
            $category = $this->categoryService->findById($id);
            return $this->success(new CategoryResource($category), 'Category updated successfully');
        } catch (Exception $e) {
            return $this->error('Failed to update category: ' . $e->getMessage(), 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $this->categoryService->deleteById($id);
            return $this->success(null, 'Category deleted successfully');
        } catch (Exception $e) {
            return $this->error('Failed to delete category: ' . $e->getMessage(), 500);
        }
    }

    public function restore($id): JsonResponse
    {
        try {
            $this->categoryService->restore($id);
            return $this->success(null, 'Category restored successfully');
        } catch (Exception $e) {
            return $this->error('Failed to restore category: ' . $e->getMessage(), 500);
        }
    }

    public function deactivate($id): JsonResponse
    {
        try {
            $this->categoryService->deactivate($id);
            $category = $this->categoryService->findById($id);
            return $this->success(new CategoryResource($category), 'Category deactivated successfully');
        } catch (Exception $e) {
            return $this->error('Failed to deactivate category: ' . $e->getMessage(), 500);
        }
    }

    public function activate($id): JsonResponse
    {
        try {
            $this->categoryService->activate($id);
            $category = $this->categoryService->findById($id);
            return $this->success(new CategoryResource($category), 'Category activated successfully');
        } catch (Exception $e) {
            return $this->error('Failed to activate category: ' . $e->getMessage(), 500);
        }
    }
}

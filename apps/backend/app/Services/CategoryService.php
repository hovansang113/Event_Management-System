<?php

namespace App\Services;

use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Category;

class CategoryService extends BaseService
{
    protected CategoryRepositoryInterface $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        parent::__construct($categoryRepository);
        $this->categoryRepository = $categoryRepository;
    }

    public function getActive(): Collection
    {
        return $this->categoryRepository->getActive();
    }

    public function restore(int|string $id): bool
    {
        return $this->categoryRepository->restore($id);
    }

    public function deactivate(int|string $id): bool
    {
        return $this->categoryRepository->deactivate($id);
    }

    public function activate(int|string $id): bool
    {
        return $this->categoryRepository->activate($id);
    }
}

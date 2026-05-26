<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    public function all(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->model->withTrashed()->with($relations)->get($columns);
    }

    public function getActive(): Collection
    {
        return $this->model->active()->get();
    }

    public function restore(int|string $id): bool
    {
        return $this->model->withTrashed()->find($id)?->restore() ?? false;
    }

    public function deactivate(int|string $id): bool
    {
        return $this->update($id, ['is_active' => false]);
    }

    public function activate(int|string $id): bool
    {
        return $this->update($id, ['is_active' => true]);
    }

    public function getTrashed(): Collection
    {
        return $this->model->onlyTrashed()->get();
    }
}

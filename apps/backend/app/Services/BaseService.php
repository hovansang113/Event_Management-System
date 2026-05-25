<?php

namespace App\Services;

use App\Repositories\Interfaces\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseService
{
    protected BaseRepositoryInterface $repository;

    public function __construct(BaseRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function all(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->repository->all($columns, $relations);
    }

    public function paginate(int $perPage = 15, array $columns = ['*'], array $relations = []): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage, $columns, $relations);
    }

    public function findById(int|string $id, array $columns = ['*'], array $relations = [], array $appends = []): ?Model
    {
        return $this->repository->findById($id, $columns, $relations, $appends);
    }

    public function create(array $payload): Model
    {
        return $this->repository->create($payload);
    }

    public function update(int|string $id, array $payload): bool
    {
        return $this->repository->update($id, $payload);
    }

    public function deleteById(int|string $id): bool
    {
        return $this->repository->deleteById($id);
    }
}

<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface BaseRepositoryInterface
{
    public function all(array $columns = ['*'], array $relations = []): Collection;

    public function paginate(int $perPage = 15, array $columns = ['*'], array $relations = []): LengthAwarePaginator;

    public function findById(int|string $id, array $columns = ['*'], array $relations = [], array $appends = []): ?Model;

    public function create(array $payload): Model;

    public function update(int|string $id, array $payload): bool;

    public function deleteById(int|string $id): bool;
}

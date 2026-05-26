<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface extends BaseRepositoryInterface
{
    public function getActive(): Collection;
    public function restore(int|string $id): bool;
    public function deactivate(int|string $id): bool;
    public function activate(int|string $id): bool;
    public function getTrashed(): Collection;
}

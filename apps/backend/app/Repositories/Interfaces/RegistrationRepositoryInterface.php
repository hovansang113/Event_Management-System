<?php

namespace App\Repositories\Interfaces;

interface RegistrationRepositoryInterface
{
    public function getConfirmedCount(int $eventId): int;
    public function createRegistration(array $data);
    public function getNextInWaitlist(int $eventId);
    public function findById(int $id);
    public function update(int $id, array $data);
    public function getByUser(int $userId);
}

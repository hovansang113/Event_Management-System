<?php
// app/Exceptions/ApiException.php

namespace App\Exceptions;

use Exception;

class ApiException extends Exception
{
    protected array $errors;

    public function __construct(
        string $message = 'Đã xảy ra lỗi.',
        int $code = 400,
        array $errors = []
    ) {
        parent::__construct($message, $code);
        $this->errors = $errors;
    }

    public function render($request)
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'errors'  => $this->errors,
        ], $this->getCode());
    }
}
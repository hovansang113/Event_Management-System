<?php

namespace App\Http\Requests\Category;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:categories,name,' . $this->route('id'),
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $this->route('id'),
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ];
    }
}

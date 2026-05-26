<?php

namespace App\Http\Requests\Event;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "title" => "sometimes|required|string|max:255",
            "description" => "sometimes|required|string",
            "location" => "sometimes|required|string|max:255",
            "event_date" => "sometimes|date|after_or_equal:today",
            "event_time" => "sometimes",
            "capacity" => "sometimes|integer|min:1",
            "category_id" => "sometimes|required|exists:categories,id",
            "image" => "nullable|string"
        
        ];
    }
}

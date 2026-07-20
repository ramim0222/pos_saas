<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerGroup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CustomerGroupController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateGroup($request);

        CustomerGroup::create($validated);

        return back()->with('status', 'group-created');
    }

    public function update(Request $request, CustomerGroup $group): RedirectResponse
    {
        $validated = $this->validateGroup($request);

        $group->update($validated);

        return back()->with('status', 'group-updated');
    }

    private function validateGroup(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'discount_percent' => ['required', 'numeric', 'min:0', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);
    }
}

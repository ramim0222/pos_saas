<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Display the contact page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Front/Contact', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'status' => session('status'),
        ]);
    }

    /**
     * Store a new contact inquiry.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'store_name' => ['nullable', 'string', 'max:255'],
            'subject' => ['required', 'string', 'in:general,sales,support,demo'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        ContactMessage::create($validated);

        return Redirect::route('contact')->with('status', 'message-sent');
    }
}

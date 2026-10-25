<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Client\ConnectionException;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect(): RedirectResponse
    {
        $clientId = config('services.google.client_id');

        if (!$clientId) {
            return redirect()->away(config('app.frontend_url') . '/signin?error=google_oauth_not_configured');
        }

        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');

        if (!$clientId || !$clientSecret) {
            return redirect()->away(config('app.frontend_url') . '/signin?error=google_oauth_not_configured');
        }

        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->user();
        } catch (ConnectionException $e) {
            return redirect()->away(config('app.frontend_url') . '/signin?error=google_connection_failed');
        } catch (\Exception $e) {
            return redirect()->away(config('app.frontend_url') . '/signin?error=google_callback_failed');
        }

        $existingUser = User::where('google_id', $googleUser->getId())->first();

        if ($existingUser) {
            Auth::login($existingUser);
            $request->session()->regenerate();
            return redirect()->away(config('app.frontend_url') . '/library');
        }

        $userByEmail = User::where('email', $googleUser->getEmail())->first();

        if ($userByEmail) {
            return redirect()->away(config('app.frontend_url') . '/signin?error=email_exists_use_password');
        }

        $user = User::create([
            'name' => $googleUser->getName() ?? $googleUser->getEmail(),
            'email' => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
            'password' => null,
            'email_verified_at' => now(),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->away(config('app.frontend_url') . '/library');
    }
}
<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Leave;
use App\Models\User;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'role' => $request->user()?->getRoleNames()->first(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'notifications' => [
                'pendingLeavesCount' => function() use ($request) {
                    $user = $request->user();
                    if (!$user) return 0;
                    
                    if ($user->hasRole('admin')) {
                        $supervisors = User::role('supervisor')->pluck('id');
                        return Leave::whereIn('user_id', $supervisors)->where('status', 'pending')->count();
                    }
                    
                    if ($user->hasRole('supervisor')) {
                        $subordinateIds = $user->subordinates()->pluck('id');
                        return Leave::whereIn('user_id', $subordinateIds)->where('status', 'pending')->count();
                    }
                    
                    return 0;
                }
            ],
        ];
    }
}

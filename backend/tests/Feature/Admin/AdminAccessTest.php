<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Database\Seeders\CategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CategorySeeder::class);
    }

    public function test_guests_cannot_reach_admin_endpoints(): void
    {
        $this->getJson('/api/admin/stats')->assertStatus(401);
        $this->getJson('/api/admin/books')->assertStatus(401);
    }

    public function test_non_admin_users_are_forbidden(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->getJson('/api/admin/stats')->assertStatus(403);
        $this->actingAs($user)->getJson('/api/admin/books')->assertStatus(403);
    }

    public function test_admin_can_read_dashboard_stats(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->getJson('/api/admin/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'stats' => [
                        'total',
                        'published',
                        'draft',
                        'review',
                        'categories',
                        'featured',
                    ],
                    'recent_books',
                ],
            ]);
    }

    public function test_login_payload_exposes_admin_flag(): void
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $this->postJson('/api/login', [
            'email' => $admin->email,
            'password' => 'password123',
        ])->assertStatus(200)
            ->assertJsonPath('user.is_admin', true);
    }
}

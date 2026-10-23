<?php

namespace Tests\Feature;

use App\Models\BudgetItem;
use App\Models\Guest;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WeddingPlannerTest extends TestCase
{
    use RefreshDatabase;

    private function user(): User
    {
        return User::factory()->create();
    }

    public function test_all_module_pages_load_for_an_authenticated_user(): void
    {
        $this->actingAs($this->user());

        foreach ([
            'dashboard',
            'budget.index',
            'vendors.index',
            'inspiration.index',
            'guests.index',
            'checklist.index',
            'timeline.index',
            'seating.index',
            'drinks.index',
            'wedding.edit',
        ] as $route) {
            $this->get(route($route))->assertOk();
        }
    }

    public function test_root_redirects_guests_to_login_and_users_to_dashboard(): void
    {
        $this->get('/')->assertRedirect(route('login'));

        $this->actingAs($this->user());
        $this->get('/')->assertRedirect(route('dashboard'));
    }

    public function test_module_pages_require_authentication(): void
    {
        $this->get(route('budget.index'))->assertRedirect(route('login'));
        $this->get(route('guests.index'))->assertRedirect(route('login'));
    }

    public function test_budget_item_store_converts_pesos_to_centavos(): void
    {
        $this->actingAs($this->user());

        $this->post(route('budget.store'), [
            'title' => 'Venue deposit',
            'estimated_amount' => '1500.50',
            'actual_amount' => '1600',
            'status' => 'committed',
        ])->assertRedirect();

        $item = BudgetItem::firstOrFail();
        $this->assertSame(150050, $item->estimated_amount);
        $this->assertSame(160000, $item->actual_amount);
    }

    public function test_budget_index_summary_excludes_considering_from_actual(): void
    {
        $this->actingAs($this->user());

        BudgetItem::factory()->create(['estimated_amount' => 100000, 'status' => 'committed']);
        BudgetItem::factory()->considering()->create(['estimated_amount' => 50000]);

        $this->get(route('budget.index'))->assertInertia(
            fn ($page) => $page
                ->where('summary.actualTotal', 100000)
                ->where('summary.projectedTotal', 150000),
        );
    }

    public function test_confirmed_guest_with_plus_one_counts_as_two(): void
    {
        $this->actingAs($this->user());

        Guest::factory()->confirmed()->create(['plus_one' => true]);
        Guest::factory()->confirmed()->create(['plus_one' => false]);
        Guest::factory()->create(); // pending — excluded

        $this->assertSame(3, Guest::confirmedHeadcount());
    }

    public function test_a_guest_can_be_assigned_to_a_table(): void
    {
        $this->actingAs($this->user());

        $guest = Guest::factory()->confirmed()->create();
        $table = Table::factory()->create();

        $this->patch(route('guests.seat', $guest), ['table_id' => $table->id])
            ->assertRedirect(route('seating.index'));

        $this->assertSame($table->id, $guest->refresh()->table_id);
    }

    public function test_budget_advisor_is_unavailable_without_an_api_key(): void
    {
        config()->set('services.anthropic.key', null);
        $this->actingAs($this->user());

        // No crash, redirects back with an error toast rather than calling the API.
        $this->post(route('budget.advisor'))->assertRedirect(route('budget.index'));
    }
}

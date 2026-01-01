<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(['in', 'out']),
            'quantity' => $this->faker->numberBetween(1, 20),
            'description' => $this->faker->sentence,
        ];
    }
}

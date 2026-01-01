<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'price' => $this->faker->numberBetween(10000, 50000),
            'stock' => $this->faker->numberBetween(10, 100),
            'is_active' => true,
        ];
    }
}

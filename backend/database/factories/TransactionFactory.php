<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'total_amount' => $this->faker->numberBetween(50000, 200000),
            'payment_method' => $this->faker->randomElement(['cash', 'qris']),
            'payment_status' => $this->faker->randomElement(['pending', 'success']),
            'created_at' => $this->faker->dateTimeBetween('-2 days', 'now'),
        ];
    }
}

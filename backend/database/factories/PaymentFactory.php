<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'provider' => 'midtrans',
            'reference' => 'REF-' . $this->faker->uuid,
            'amount' => 0, // Set in seeder
            'status' => 'success',
            'payload' => json_encode(['mock' => 'data']),
        ];
    }
}

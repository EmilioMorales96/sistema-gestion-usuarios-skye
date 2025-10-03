<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Crear usuarios de prueba para CatWare Systems
     * Incluye usuario admin y usuarios de ejemplo
     */
    public function run(): void
    {
        // Usuario administrador para login
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@test.com',
            'password' => Hash::make('123456'),
            'created_at' => now()->subDays(30),
        ]);
        
        // Usuarios de ejemplo (mismo que el frontend mockup)
        $users = [
            [
                'name' => 'Juan Pérez',
                'email' => 'juan.perez@ejemplo.com',
                'created_at' => '2024-01-15 08:30:00'
            ],
            [
                'name' => 'María García',
                'email' => 'maria.garcia@ejemplo.com',
                'created_at' => '2024-02-20 14:22:00'
            ],
            [
                'name' => 'Carlos López',
                'email' => 'carlos.lopez@ejemplo.com',
                'created_at' => '2024-03-10 09:15:00'
            ],
            [
                'name' => 'Ana Martínez',
                'email' => 'ana.martinez@ejemplo.com',
                'created_at' => '2024-03-25 16:45:00'
            ],
            [
                'name' => 'Luis Rodríguez',
                'email' => 'luis.rodriguez@ejemplo.com',
                'created_at' => '2024-04-02 11:30:00'
            ],
            [
                'name' => 'Elena Fernández',
                'email' => 'elena.fernandez@ejemplo.com',
                'created_at' => '2024-04-18 13:20:00'
            ]
        ];

        foreach ($users as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password123'),
                'created_at' => $userData['created_at'],
                'updated_at' => $userData['created_at'],
            ]);
        }
    }
}

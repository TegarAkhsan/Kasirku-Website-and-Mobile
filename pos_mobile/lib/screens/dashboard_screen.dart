import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../features/auth/providers/auth_provider.dart';
import '../features/pos/screens/pos_screen.dart';
import '../features/reports/screens/reports_screen.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;

    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: const Color(0xFF1F2937),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => ref.read(authProvider.notifier).logout(),
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Welcome, ${user?.name ?? "User"}',
              style: const TextStyle(color: Colors.white, fontSize: 24),
            ),
            if (user?.role == 'owner') ...[
              const Text('Owner Mode', style: TextStyle(color: Colors.green)),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                icon: const Icon(Icons.bar_chart),
                label: const Text('View Reports'),
                onPressed:
                    () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const ReportsScreen()),
                    ),
              ),
            ] else ...[
              const Text(
                'Cashier Mode',
                style: TextStyle(color: Colors.orange),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                icon: const Icon(Icons.point_of_sale),
                label: const Text('Open POS'),
                onPressed:
                    () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const PosScreen()),
                    ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

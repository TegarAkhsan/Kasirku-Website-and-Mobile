import 'package:flutter/material.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sales Reports')),
      body: ListView.builder(
        itemCount: 5,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(
              'Transaction #$index',
              style: const TextStyle(color: Colors.white),
            ),
            subtitle: const Text(
              'Rp 150.000 - Success',
              style: TextStyle(color: Colors.grey),
            ),
            trailing: const Icon(Icons.chevron_right, color: Colors.grey),
          );
        },
      ),
    );
  }
}

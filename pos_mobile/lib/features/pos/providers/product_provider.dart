import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api_client.dart';

class Product {
  final int id;
  final String name;
  final int price;
  final String? image;

  Product({
    required this.id,
    required this.name,
    required this.price,
    this.image,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      price: json['price'],
      image: json['image'],
    );
  }
}

final productsProvider = FutureProvider<List<Product>>((ref) async {
  final dio = ref.watch(dioProvider);
  final response = await dio.get('/pos/products');
  final List data = response.data['data'] ?? [];
  return data.map((e) => Product.fromJson(e)).toList();
});

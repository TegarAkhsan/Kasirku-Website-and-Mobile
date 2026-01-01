import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'product_provider.dart';

class CartItem {
  final Product product;
  final int quantity;

  CartItem({required this.product, required this.quantity});

  int get total => product.price * quantity;
}

class CartNotifier extends StateNotifier<List<CartItem>> {
  CartNotifier() : super([]);

  void addToCart(Product product) {
    state = [
      ...state,
      CartItem(
        product: product,
        quantity: 1,
      ), // Simple add, can optimize to merge duplicates
    ];
  }

  void clear() {
    state = [];
  }

  int get totalAmount => state.fold(0, (sum, item) => sum + item.total);
}

final cartProvider = StateNotifierProvider<CartNotifier, List<CartItem>>((ref) {
  return CartNotifier();
});

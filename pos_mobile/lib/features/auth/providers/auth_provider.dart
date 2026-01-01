import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../../../core/api_client.dart';

// User Model
class User {
  final int id;
  final String name;
  final String email;
  final String role;
  final String? tenantName;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.tenantName,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      role: json['role'] ?? 'cashier', // Default to cashier if not owner
      tenantName: json['tenant']?['name'],
    );
  }
}

// Auth State
class AuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final User? user;
  final String? error;

  AuthState({
    this.isLoading = false,
    this.isAuthenticated = false,
    this.user,
    this.error,
  });

  AuthState copyWith({
    bool? isLoading,
    bool? isAuthenticated,
    User? user,
    String? error,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      user: user ?? this.user,
      error: error,
    );
  }
}

// Auth Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final Dio _dio;
  final _storage;

  AuthNotifier(this._dio, this._storage) : super(AuthState()) {
    checkLoginStatus();
  }

  Future<void> checkLoginStatus() async {
    state = state.copyWith(isLoading: true);
    final token = await _storage.read(key: 'auth_token');

    if (token != null) {
      try {
        final response = await _dio.get('/user');
        final user = User.fromJson(response.data);
        state = AuthState(isAuthenticated: true, user: user);
      } catch (e) {
        await logout();
      }
    } else {
      state = AuthState(isAuthenticated: false);
    }
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );

      final token = response.data['token'];
      final user = User.fromJson(response.data['user']);

      await _storage.write(key: 'auth_token', value: token);
      state = AuthState(isAuthenticated: true, user: user);
    } on DioException catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.response?.data['message'] ?? 'Login failed',
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'An unexpected error occurred',
      );
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post('/auth/logout');
    } catch (_) {}
    await _storage.delete(key: 'auth_token');
    state = AuthState(isAuthenticated: false);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final dio = ref.watch(dioProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthNotifier(dio, storage);
});

import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConfig {
  // Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator
  static String get baseUrl =>
      dotenv.env['BASE_URL'] ?? 'http://10.0.2.2:8000/api';
}

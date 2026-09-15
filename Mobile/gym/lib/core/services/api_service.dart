import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';
import '../../models/user_model.dart';
import 'auth_storage.dart';

class ApiService {
  // Register new customer account directly into MongoDB
  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    String phone = '',
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConstants.registerEndpoint),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name.trim(),
          'email': email.trim().toLowerCase(),
          'phone': phone.trim(),
          'password': password.trim(),
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201 && data['status'] == 'success') {
        final userData = data['data']['user'];
        final token = data['data']['token'];

        final user = UserModel.fromJson(userData);
        await AuthStorage.saveToken(token);
        await AuthStorage.saveUser(user);

        return {'success': true, 'user': user, 'message': data['message'] ?? 'Registered successfully'};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Registration failed. Please check your details.',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: Cannot reach backend ($e)'};
    }
  }

  // Login existing account and authenticate with MongoDB JWT
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConstants.loginEndpoint),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email.trim().toLowerCase(),
          'password': password.trim(),
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['status'] == 'success') {
        final userData = data['data']['user'];
        final token = data['data']['token'];

        final user = UserModel.fromJson(userData);
        await AuthStorage.saveToken(token);
        await AuthStorage.saveUser(user);

        return {'success': true, 'user': user, 'message': data['message'] ?? 'Logged in successfully'};
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Invalid email or password',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: Cannot reach backend ($e)'};
    }
  }

  // Sync latest user profile with database
  static Future<UserModel?> getFreshProfile() async {
    try {
      final token = await AuthStorage.getToken();
      if (token == null) return null;

      final response = await http.get(
        Uri.parse(ApiConstants.meEndpoint),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final userData = data['data']?['user'] ?? data['user'];
        if (userData != null) {
          final user = UserModel.fromJson(userData);
          await AuthStorage.saveUser(user);
          return user;
        }
      }
      return null;
    } catch (_) {
      return null;
    }
  }

}

import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiConstants {
  // Default fallback API URLs
  static const String localHostUrl = 'http://localhost:5050';
  static const String androidEmulatorUrl = 'http://10.0.2.2:5050';
  static const String productionUrl = 'https://gym.speshway.site';

  // Dynamic Base URL detection
  static String get baseUrl {
    if (kIsWeb) {
      return localHostUrl;
    }
    try {
      if (Platform.isAndroid) {
        return androidEmulatorUrl;
      } else {
        return localHostUrl;
      }
    } catch (_) {
      return localHostUrl;
    }
  }

  // Endpoints
  static String get registerEndpoint => '$baseUrl/api/auth/register';
  static String get loginEndpoint => '$baseUrl/api/auth/login';
  static String get meEndpoint => '$baseUrl/api/auth/me';
  static String get cmsEndpoint => '$baseUrl/api/cms';
  static String get productsEndpoint => '$baseUrl/api/products';
  static String get attendanceEndpoint => '$baseUrl/api/attendance/my-history';
  static String get workoutPlanEndpoint => '$baseUrl/api/customer/workout-plan';
}

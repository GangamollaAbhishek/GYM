class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String role;
  final String membershipPlan;
  final String membershipDuration;
  final String membershipStatus;
  final String membershipStartDate;
  final String membershipExpiry;
  final double amountPaid;
  final String assignedTrainerName;
  final String avatar;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    this.membershipPlan = 'No Active Plan',
    this.membershipDuration = '',
    this.membershipStatus = 'No Membership',
    this.membershipStartDate = '',
    this.membershipExpiry = '',
    this.amountPaid = 0.0,
    this.assignedTrainerName = '',
    this.avatar = '',
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? json['_id']?.toString() ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? 'customer',
      membershipPlan: json['membershipPlan'] ?? 'No Active Plan',
      membershipDuration: json['membershipDuration'] ?? '',
      membershipStatus: json['membershipStatus'] ?? 'No Membership',
      membershipStartDate: json['membershipStartDate'] ?? '',
      membershipExpiry: json['membershipExpiry'] ?? '',
      amountPaid: (json['amountPaid'] is num) ? (json['amountPaid'] as num).toDouble() : 0.0,
      assignedTrainerName: json['assignedTrainerName'] ?? '',
      avatar: json['avatar'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'membershipPlan': membershipPlan,
      'membershipDuration': membershipDuration,
      'membershipStatus': membershipStatus,
      'membershipStartDate': membershipStartDate,
      'membershipExpiry': membershipExpiry,
      'amountPaid': amountPaid,
      'assignedTrainerName': assignedTrainerName,
      'avatar': avatar,
    };
  }
}

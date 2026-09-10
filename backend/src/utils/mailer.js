const nodemailer = require('nodemailer');

/**
 * Creates and returns a Nodemailer transporter instance using environment variables.
 * Supports various naming conventions for SMTP variables.
 */
const createTransporter = () => {
  const host = (process.env.SMTP_HOST || process.env.EMAIL_HOST || process.env.MAIL_HOST || 'smtp.gmail.com').trim().replace(/^['"]|['"]$/g, '');
  const port = parseInt((process.env.SMTP_PORT || process.env.EMAIL_PORT || process.env.MAIL_PORT || '587').toString().trim(), 10);
  const secure = process.env.SMTP_SECURE === 'true' || process.env.EMAIL_SECURE === 'true' || port === 465;
  
  let user = (process.env.SMTP_USER || process.env.EMAIL_USER || process.env.MAIL_USER || process.env.GMAIL_USER || process.env.SMTP_EMAIL || process.env.EMAIL || '').trim().replace(/^['"]|['"]$/g, '');
  let pass = (process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || process.env.MAIL_PASS || process.env.MAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || '').trim().replace(/^['"]|['"]$/g, '');
  const service = (process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE || '').trim().replace(/^['"]|['"]$/g, '');

  if (!user || !pass) {
    console.warn('⚠️ [Mailer] SMTP credentials (SMTP_USER/SMTP_PASS) are not set in backend/.env.');
    return null;
  }

  // If host is gmail or service is gmail, use service: 'gmail' for best reliability
  const isGmail = host.toLowerCase().includes('gmail') || service.toLowerCase().includes('gmail');

  const transportOptions = isGmail
    ? {
        service: 'gmail',
        auth: {
          user,
          pass: pass.replace(/\s+/g, '') // remove spaces from Google app passwords
        }
      }
    : service
    ? {
        service,
        auth: { user, pass }
      }
    : {
        host,
        port,
        secure,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false
        }
      };

  return nodemailer.createTransport(transportOptions);
};

/**
 * Sends a welcome email to the newly registered customer containing their login credentials.
 */
const sendWelcomeCredentialsEmail = async ({
  to,
  name,
  email,
  password,
  plan,
  duration,
  membershipExpiry,
  amountPaid,
  paymentMethod,
  portalUrl = process.env.PORTAL_URL || process.env.FRONTEND_URL || 'https://gym.speshway.site/'
}) => {
  try {
    const transporter = createTransporter();
    const recipientEmail = to || email;
    const userName = name || 'Valued Athlete';
    const userPlan = plan && plan !== 'No Active Plan' ? plan : 'Standard Access';
    const userDuration = duration || 'Monthly';

    if (!recipientEmail) {
      console.error('❌ [Mailer] Recipient email is missing.');
      return { success: false, error: 'Recipient email missing' };
    }

    if (!transporter) {
      console.log(`\n=============================================================`);
      console.log(`📧 [SIMULATED EMAIL - SMTP CREDENTIALS NOT SET IN .ENV]`);
      console.log(`To: ${recipientEmail}`);
      console.log(`Athlete: ${userName}`);
      console.log(`Login Email: ${email}`);
      console.log(`Assigned Password: ${password}`);
      console.log(`Plan: ${userPlan} (${userDuration})`);
      console.log(`Expiry: ${membershipExpiry || 'N/A'}`);
      console.log(`=============================================================\n`);
      return { success: false, simulated: true, reason: 'SMTP credentials missing in .env' };
    }

    const fromSender =
      process.env.SMTP_FROM ||
      process.env.EMAIL_FROM ||
      `"TITAN PULSE 3D FITNESS" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Titan Pulse 3D Fitness</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0A0A0D;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #E2E8F0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0A0A0D;
      padding: 40px 0;
    }
    .main-table {
      max-width: 600px;
      width: 100%;
      margin: 0 auto;
      background-color: #121318;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .hero-banner {
      background: linear-gradient(135deg, #FF2E4C 0%, #B8001F 100%);
      padding: 36px 28px;
      text-align: center;
    }
    .hero-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #FFFFFF;
      margin: 0;
      text-transform: uppercase;
    }
    .hero-subtitle {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      margin: 8px 0 0 0;
      letter-spacing: 0.5px;
    }
    .content-body {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 12px;
    }
    .intro-text {
      font-size: 14px;
      line-height: 1.6;
      color: #94A3B8;
      margin-bottom: 24px;
    }
    .cred-card {
      background: #171821;
      border: 1px solid rgba(255, 46, 76, 0.25);
      border-radius: 14px;
      padding: 22px;
      margin-bottom: 24px;
    }
    .cred-header {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #FF2E4C;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 8px;
    }
    .cred-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      font-size: 13px;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
    }
    .cred-row:last-child {
      border-bottom: none;
    }
    .cred-label {
      color: #64748B;
      font-weight: 600;
    }
    .cred-value {
      color: #F8FAFC;
      font-weight: 700;
    }
    .cred-password {
      color: #FF2E4C;
      font-family: 'Courier New', Courier, monospace;
      font-size: 16px;
      font-weight: 900;
      background: rgba(255, 46, 76, 0.1);
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid rgba(255, 46, 76, 0.3);
    }
    .btn-container {
      text-align: center;
      margin: 30px 0 16px 0;
    }
    .cta-btn {
      display: inline-block;
      background: #FF2E4C;
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
      padding: 14px 36px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(255, 46, 76, 0.35);
    }
    .security-notice {
      background: rgba(255, 255, 255, 0.03);
      border-left: 3px solid #F59E0B;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin-top: 20px;
      font-size: 12px;
      color: #CBD5E1;
      line-height: 1.5;
    }
    .footer {
      background: #0D0E13;
      padding: 24px;
      text-align: center;
      font-size: 11px;
      color: #64748B;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-table" cellpadding="0" cellspacing="0">
      <tr>
        <td class="hero-banner">
          <h1 class="hero-title">⚡ TITAN PULSE 3D FITNESS</h1>
          <p class="hero-subtitle">ELITE ATHLETIC ONBOARDING & PASS CREDENTIALS</p>
        </td>
      </tr>
      <tr>
        <td class="content-body">
          <div class="greeting">Welcome to the Tribe, ${userName}! 👋</div>
          <p class="intro-text">
            Your athlete membership profile has been officially created at our Front Desk Concierge. Below are your private account credentials to log in to the <strong>Titan Pulse Member Portal</strong>.
          </p>

          <div class="cred-card">
            <div class="cred-header">🔒 YOUR ACCESS CREDENTIALS</div>
            <table style="width:100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">PORTAL URL</td>
                <td style="padding: 6px 0; text-align: right; color: #38BDF8; font-size: 13px; font-weight: 700;">
                  <a href="${portalUrl}" style="color:#38BDF8; text-decoration:none;">${portalUrl}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">LOGIN EMAIL</td>
                <td style="padding: 6px 0; text-align: right; color: #F8FAFC; font-size: 13px; font-weight: 700;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">ACCOUNT PASSWORD</td>
                <td style="padding: 6px 0; text-align: right;">
                  <span class="cred-password">${password}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">MEMBERSHIP PLAN</td>
                <td style="padding: 6px 0; text-align: right; color: #10B981; font-size: 13px; font-weight: 700;">${userPlan} (${userDuration})</td>
              </tr>
              ${membershipExpiry ? `
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">VALID UNTIL</td>
                <td style="padding: 6px 0; text-align: right; color: #CBD5E1; font-size: 13px; font-weight: 600;">${membershipExpiry}</td>
              </tr>` : ''}
              ${amountPaid ? `
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">AMOUNT PAID</td>
                <td style="padding: 6px 0; text-align: right; color: #F59E0B; font-size: 13px; font-weight: 700;">₹${Number(amountPaid).toLocaleString()} (${paymentMethod || 'Settled'})</td>
              </tr>` : ''}
            </table>
          </div>

          <div class="btn-container">
            <a href="${portalUrl}" class="cta-btn">ACCESS ATHLETE PORTAL →</a>
          </div>

          <div class="security-notice">
            <strong>🛡️ Security Recommendation:</strong> You can update your password at any time inside the <em>Settings & Security</em> section once you log in. Please do not share these credentials with anyone.
          </div>
        </td>
      </tr>
      <tr>
        <td class="footer">
          &copy; ${new Date().getFullYear()} <strong>TITAN PULSE FITNESS HUB</strong>. All rights reserved.<br>
          Front Desk Concierge &bull; Arena Floor &bull; Biometric Access Hub<br>
          If you did not initiate this registration, please notify our reception team immediately.
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
    `;

    const info = await transporter.sendMail({
      from: fromSender,
      to: recipientEmail,
      subject: `⚡ Welcome to Titan Pulse Fitness - Your Account Credentials`,
      text: `Welcome to Titan Pulse 3D Fitness, ${userName}!\n\nYour athlete account has been registered by the receptionist.\n\nLogin Portal: ${portalUrl}\nEmail: ${email}\nPassword: ${password}\nMembership Plan: ${userPlan} (${userDuration})\nExpiry Date: ${membershipExpiry || 'N/A'}\n\nPlease sign in and update your password if desired.`,
      html
    });

    console.log(`✅ [Mailer] Welcome email sent successfully to ${recipientEmail}. (MsgId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ [Mailer] Error sending welcome email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Sends an onboarding email to newly created staff (receptionist, trainer, admin) with their temporary credentials.
 */
const sendStaffCredentialsEmail = async ({
  to,
  name,
  email,
  password,
  role,
  shift,
  assignedRoom,
  portalUrl = process.env.PORTAL_URL || process.env.FRONTEND_URL || 'https://gym.speshway.site/'
}) => {
  try {
    const transporter = createTransporter();
    const recipientEmail = to || email;
    const staffName = name || 'Staff Member';
    const normalizedRole = (role || 'staff').toLowerCase();
    const roleTitle =
      normalizedRole === 'trainer'
        ? 'Fitness Coach & Trainer'
        : normalizedRole === 'receptionist'
        ? 'Front Desk Receptionist'
        : normalizedRole === 'admin'
        ? 'Gym Administrator'
        : 'Staff Faculty';

    if (!recipientEmail) {
      console.error('❌ [Mailer] Staff recipient email is missing.');
      return { success: false, error: 'Recipient email missing' };
    }

    if (!transporter) {
      console.log(`\n=============================================================`);
      console.log(`📧 [SIMULATED EMAIL - STAFF CREDENTIALS]`);
      console.log(`To: ${recipientEmail}`);
      console.log(`Staff Name: ${staffName}`);
      console.log(`Assigned Role: ${roleTitle}`);
      console.log(`Login Email: ${email}`);
      console.log(`Temporary Password: ${password}`);
      console.log(`Shift: ${shift || 'Default Shift Window'}`);
      console.log(`=============================================================\n`);
      return { success: false, simulated: true, reason: 'SMTP credentials missing in .env' };
    }

    const fromSender =
      process.env.SMTP_FROM ||
      process.env.EMAIL_FROM ||
      `"TITAN PULSE 3D FITNESS" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Staff Account Credentials - Titan Pulse Fitness</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0A0A0D;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #E2E8F0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0A0A0D;
      padding: 40px 0;
    }
    .main-table {
      max-width: 600px;
      width: 100%;
      margin: 0 auto;
      background-color: #121318;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .hero-banner {
      background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #FF2E4C 100%);
      padding: 36px 28px;
      text-align: center;
    }
    .hero-title {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #FFFFFF;
      margin: 0;
      text-transform: uppercase;
    }
    .hero-subtitle {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      margin: 8px 0 0 0;
      letter-spacing: 0.5px;
    }
    .content-body {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 12px;
    }
    .intro-text {
      font-size: 14px;
      line-height: 1.6;
      color: #94A3B8;
      margin-bottom: 24px;
    }
    .cred-card {
      background: #171821;
      border: 1px solid rgba(124, 58, 237, 0.3);
      border-radius: 14px;
      padding: 22px;
      margin-bottom: 24px;
    }
    .cred-header {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #A78BFA;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 8px;
    }
    .cred-password {
      color: #A78BFA;
      font-family: 'Courier New', Courier, monospace;
      font-size: 16px;
      font-weight: 900;
      background: rgba(124, 58, 237, 0.15);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid rgba(124, 58, 237, 0.4);
    }
    .btn-container {
      text-align: center;
      margin: 30px 0 16px 0;
    }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
      padding: 14px 36px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(124, 58, 237, 0.35);
    }
    .security-notice {
      background: rgba(255, 255, 255, 0.03);
      border-left: 3px solid #7C3AED;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin-top: 20px;
      font-size: 12px;
      color: #CBD5E1;
      line-height: 1.5;
    }
    .footer {
      background: #0D0E13;
      padding: 24px;
      text-align: center;
      font-size: 11px;
      color: #64748B;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-table" cellpadding="0" cellspacing="0">
      <tr>
        <td class="hero-banner">
          <h1 class="hero-title">⚡ TITAN PULSE FITNESS</h1>
          <p class="hero-subtitle">STAFF ONBOARDING & PORTAL CREDENTIALS</p>
        </td>
      </tr>
      <tr>
        <td class="content-body">
          <div class="greeting">Welcome to the Team, ${staffName}! 🏆</div>
          <p class="intro-text">
            You have been provisioned as a <strong>${roleTitle}</strong> by the Gym Administration. Below are your official staff credentials to log in to your portal.
          </p>

          <div class="cred-card">
            <div class="cred-header">🔒 YOUR STAFF LOGIN CREDENTIALS</div>
            <table style="width:100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">PORTAL URL</td>
                <td style="padding: 6px 0; text-align: right; color: #38BDF8; font-size: 13px; font-weight: 700;">
                  <a href="${portalUrl}" style="color:#38BDF8; text-decoration:none;">${portalUrl}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">ROLE ASSIGNMENT</td>
                <td style="padding: 6px 0; text-align: right; color: #A78BFA; font-size: 13px; font-weight: 700;">${roleTitle}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">LOGIN EMAIL</td>
                <td style="padding: 6px 0; text-align: right; color: #F8FAFC; font-size: 13px; font-weight: 700;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">TEMPORARY PASSWORD</td>
                <td style="padding: 6px 0; text-align: right;">
                  <span class="cred-password">${password}</span>
                </td>
              </tr>
              ${shift ? `
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">DUTY SHIFT</td>
                <td style="padding: 6px 0; text-align: right; color: #CBD5E1; font-size: 13px; font-weight: 600;">${shift}</td>
              </tr>` : ''}
              ${assignedRoom ? `
              <tr>
                <td style="padding: 6px 0; color: #64748B; font-size: 12px; font-weight: 600;">ASSIGNED ARENA</td>
                <td style="padding: 6px 0; text-align: right; color: #CBD5E1; font-size: 13px; font-weight: 600;">${assignedRoom}</td>
              </tr>` : ''}
            </table>
          </div>

          <div class="btn-container">
            <a href="${portalUrl}" class="cta-btn">ACCESS STAFF PORTAL →</a>
          </div>

          <div class="security-notice">
            <strong>🛡️ Important Security Notice:</strong> This is an automatically generated temporary password. Please log into your portal and navigate to your <em>Profile &rarr; Account Security & Password</em> section to set your personal permanent password immediately.
          </div>
        </td>
      </tr>
      <tr>
        <td class="footer">
          &copy; ${new Date().getFullYear()} <strong>TITAN PULSE FITNESS HUB</strong>. All rights reserved.<br>
          Administration HQ &bull; Staff Faculty Management<br>
          If you believe this account was created in error, please contact the Gym Management immediately.
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
    `;

    const info = await transporter.sendMail({
      from: fromSender,
      to: recipientEmail,
      subject: `⚡ Welcome to Titan Pulse Staff Faculty - Your Account Credentials (${roleTitle})`,
      text: `Welcome to the Team, ${staffName}!\n\nYou have been registered as a ${roleTitle} by the Gym Administration.\n\nPortal: ${portalUrl}\nEmail: ${email}\nTemporary Password: ${password}\n\nPlease sign in and change your password in your profile settings immediately.`,
      html
    });

    console.log(`✅ [Mailer] Staff credentials email sent successfully to ${recipientEmail}. (MsgId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ [Mailer] Error sending staff email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  createTransporter,
  sendWelcomeCredentialsEmail,
  sendStaffCredentialsEmail
};

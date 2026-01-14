import { Request, Response } from "express";
import { users } from "../services/userStore";
import { generateOTP, isOtpValid } from "../services/otpService";
import { generateToken } from "../services/jwtService";
import { sendOTPEmail } from "../services/emailService";

export const requestOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = generateOTP();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

  user.otp = otp;
  user.otpExpiry = expiry;

  try {
    // 🔁 DEMO MODE SUPPORT
    if (process.env.DEMO_MODE === "true") {
      console.log(`[DEMO MODE] OTP for ${email}: ${otp}`);

      return res.json({
        message: "Demo OTP generated",
        demoOtp: otp
      });
    }

    // 📧 REAL MODE (Email sending)
    await sendOTPEmail(email, otp);
    console.log(`OTP sent to ${email}`);

    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
};

export const verifyOtp = (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = users.find(u => u.email === email);

  if (!user || !user.otp || !user.otpExpiry) {
    return res.status(400).json({ message: "Invalid request" });
  }

  if (!isOtpValid(otp, user.otp, user.otpExpiry)) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  // Clear OTP after success
  user.otp = undefined;
  user.otpExpiry = undefined;

  const token = generateToken({
    email: user.email,
    role: user.role,
  });

  res.json({
    message: "Login successful",
    token,
    role: user.role,
  });
};

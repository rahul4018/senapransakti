"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.requestOtp = void 0;
const userStore_1 = require("../services/userStore");
const otpService_1 = require("../services/otpService");
const jwtService_1 = require("../services/jwtService");
const emailService_1 = require("../services/emailService");
const requestOtp = async (req, res) => {
    const { email } = req.body;
    const user = userStore_1.users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const otp = (0, otpService_1.generateOTP)();
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
        await (0, emailService_1.sendOTPEmail)(email, otp);
        console.log(`OTP sent to ${email}`);
        res.json({ message: "OTP sent to your email" });
    }
    catch (error) {
        console.error("Email sending failed:", error);
        res.status(500).json({ message: "Failed to send OTP email" });
    }
};
exports.requestOtp = requestOtp;
const verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    const user = userStore_1.users.find(u => u.email === email);
    if (!user || !user.otp || !user.otpExpiry) {
        return res.status(400).json({ message: "Invalid request" });
    }
    if (!(0, otpService_1.isOtpValid)(otp, user.otp, user.otpExpiry)) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
    }
    // Clear OTP after success
    user.otp = undefined;
    user.otpExpiry = undefined;
    const token = (0, jwtService_1.generateToken)({
        email: user.email,
        role: user.role,
    });
    res.json({
        message: "Login successful",
        token,
        role: user.role,
    });
};
exports.verifyOtp = verifyOtp;

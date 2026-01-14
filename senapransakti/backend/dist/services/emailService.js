"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendOTPEmail = async (to, otp) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: `"Senapransakti Security" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your OTP for Senapransakti Login",
        html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Senapransakti Secure Login</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="letter-spacing: 3px;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendOTPEmail = sendOTPEmail;

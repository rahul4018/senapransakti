"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.isOtpValid = isOtpValid;
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function isOtpValid(userOtp, realOtp, expiry) {
    return userOtp === realOtp && Date.now() < expiry;
}

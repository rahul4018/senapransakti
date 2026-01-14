"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
exports.findUserByEmail = findUserByEmail;
// IMPORTANT: explicitly type this as User[]
exports.users = [
    { email: "admin@test.com", role: "ADMIN" },
    { email: "commander@test.com", role: "COMMANDER" },
    { email: "medic@test.com", role: "MEDIC" },
];
function findUserByEmail(email) {
    return exports.users.find((u) => u.email === email);
}

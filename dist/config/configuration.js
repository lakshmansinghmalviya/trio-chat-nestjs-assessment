"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    MONGODB_URI: process.env.MONGODB_URI,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SMTP_SECURE: process.env.SMTP_SECURE === 'true',
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    PORT: parseInt(process.env.PORT || '3000', 10),
    DEFAULT_FROM: process.env.DEFAULT_FROM || 'noreply@example.com',
});
//# sourceMappingURL=configuration.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const nodemailer = __importStar(require("nodemailer"));
const config_1 = require("@nestjs/config");
const email_schema_1 = require("./schemas/email.schema");
let EmailService = class EmailService {
    constructor(configService, emailModel) {
        this.configService = configService;
        this.emailModel = emailModel;
        const host = this.configService.get('SMTP_HOST');
        const port = Number(this.configService.get('SMTP_PORT')) || 587;
        const secure = this.configService.get('SMTP_SECURE') === true;
        const user = this.configService.get('SMTP_USER');
        const pass = this.configService.get('SMTP_PASS');
        this.defaultFrom = this.configService.get('DEFAULT_FROM') || '"No Reply" <lslakshman@gmail.com>';
        //  Use SMTPOptions directly for type safety
        const smtpOptions = { host, port, secure, auth: user && pass ? { user, pass } : undefined, };
        this.transporter = nodemailer.createTransport(smtpOptions);
    }
    async sendEmail(payload) {
        console.log("The payload coming liek this " + JSON.stringify(payload));
        const mailOptions = {
            from: payload.from || this.defaultFrom,
            to: payload.to,
            subject: payload.subject,
            text: payload.text,
            html: payload.html,
        };
        const log = new this.emailModel({
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html,
            status: 'sent',
            from: mailOptions.from
        });
        try {
            const info = await this.transporter.sendMail(mailOptions);
            log.status = 'sent';
            log.meta = { messageId: info.messageId, response: info.response, };
            // throw new Error(" Custorm error thrown ");   // uncomment to check the failed status and logs store in the db
            const saved = await log.save();
            common_1.Logger.log(`✅ Email sent successfully: ${info.messageId}`);
            return { success: true, id: saved._id, status: 'sent' };
        }
        catch (err) {
            log.status = 'failed';
            log.error = err?.message || String(err);
            const saved = await log.save();
            common_1.Logger.error(`❌ Email failed: ${log.error}`);
            return {
                success: false,
                id: saved._id,
                status: 'failed',
                error: log.error,
            };
        }
    }
    async listLogs(options) {
        const { page = 1, limit = 10, status } = options;
        const filter = {};
        if (status)
            filter.status = status;
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.emailModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.emailModel.countDocuments(filter),
        ]);
        return {
            meta: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            items,
        };
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(email_schema_1.Email.name)),
    __metadata("design:paramtypes", [config_1.ConfigService, mongoose_2.Model])
], EmailService);
//# sourceMappingURL=email.service.js.map
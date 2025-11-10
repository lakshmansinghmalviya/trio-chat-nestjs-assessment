"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const singup_service_1 = require("./singup.service");
describe('SingupService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [singup_service_1.SingupService],
        }).compile();
        service = module.get(singup_service_1.SingupService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=singup.service.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const singup_controller_1 = require("./singup.controller");
describe('SingupController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [singup_controller_1.SingupController],
        }).compile();
        controller = module.get(singup_controller_1.SingupController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=singup.controller.spec.js.map
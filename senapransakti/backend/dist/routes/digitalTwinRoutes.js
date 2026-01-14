"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const digitalTwinController_1 = require("../controllers/digitalTwinController");
const router = express_1.default.Router();
router.get("/:id", digitalTwinController_1.getDigitalTwin);
exports.default = router;

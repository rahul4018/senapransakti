"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const soldierController_1 = require("../controllers/soldierController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" });
/*
  RESTful structure:

  POST   /soldiers        -> Add single soldier (Medic/Admin)
  GET    /soldiers        -> Get all soldiers
  POST   /soldiers/upload -> Bulk upload via CSV (Admin)
*/
// ✅ Add Soldier (Medic / Admin)
router.post("/", soldierController_1.addSoldier);
// ✅ Get all soldiers
router.get("/", soldierController_1.getAllSoldiers);
// ✅ Upload CSV (Admin only feature)
router.post("/upload", upload.single("file"), soldierController_1.uploadSoldiersCSV);
exports.default = router;

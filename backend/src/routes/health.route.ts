import express from "express";
import healthController from "../controllers/health.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"; // 💡 미들웨어 import

const router = express.Router();

// 1. FE 요청: 로그 저장 (로그인 필요)
router.post("/log", authMiddleware, healthController.createLog);

// 2. FE 요청: 대시보드 데이터 조회 (로그인 필요)
router.get("/summary", authMiddleware, healthController.getSummary);

// 3. AI 서버 전용: 분석 결과 수신 (내부 WebHook, 토큰 검사 대신 API Key 검사 필요)
router.post("/internal/ai/result", healthController.handleAiResult);

export default router;

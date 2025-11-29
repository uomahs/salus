import { Request, Response } from "express";
import healthService from "../services/health.service";

class HealthController {
  // Arrow Function을 써야 this 바인딩 문제가 발생하지 않음
  createLog = async (req: Request, res: Response) => {
    try {
      const score = await healthService.recordHealthLog(req.body);
      res.status(201).json({
        success: true,
        score,
        message: "오늘의 상태 저장 완료",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "상태 저장 실패" });
    }
  };

  getSummary = async (req: Request, res: Response) => {
    try {
      // Query 파라미터는 기본적으로 string | undefined 등임
      const userId = req.query.userId as string;
      const date = req.query.date as string;

      if (!userId || !date) {
        res.status(400).json({ error: "userId와 date는 필수입니다." });
        return;
      }

      const data = await healthService.getHealthSummary(userId, date);

      if (!data) {
        res.status(200).json({ message: "해당 날짜의 기록이 없습니다." });
        return;
      }

      res.status(200).json(data);
    } catch (error: any) {
      console.error(error);
      if (error.message === "USER_NOT_FOUND") {
        res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
        return;
      }
      res.status(500).json({ error: "데이터 조회 실패" });
    }
  };
}

export default new HealthController();

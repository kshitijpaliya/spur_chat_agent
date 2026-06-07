import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";

const router = Router();

const chatController = new ChatController();

router.post("/message", chatController.sendMessage.bind(chatController));

router.get("/:sessionId", chatController.getHistory.bind(chatController));

export default router;

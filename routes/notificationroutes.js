const express = require("express");

const router = express.Router();

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

// ==========================================
// GET ALL MY NOTIFICATIONS
// ==========================================
router.get(
  "/",
  protect,
  getMyNotifications
);

// ==========================================
// GET UNREAD NOTIFICATION COUNT
// ==========================================
router.get(
  "/unread-count",
  protect,
  getUnreadCount
);

// ==========================================
// MARK ALL AS READ
// ==========================================
router.put(
  "/read-all",
  protect,
  markAllAsRead
);

// ==========================================
// MARK ONE AS READ
// ==========================================
router.put(
  "/:id/read",
  protect,
  markAsRead
);

// ==========================================
// DELETE ONE NOTIFICATION
// ==========================================
router.delete(
  "/:id",
  protect,
  deleteNotification
);

module.exports = router;
// services/chatEngine.js
import db from "@/lib/db";

export const chatEngine = {
  // Get all rooms for a user
  async getUserRooms(userId) {
    return await db.execute(
      "SELECT * FROM chat_rooms WHERE participant_one = ? OR participant_two = ?",
      [userId, userId],
    );
  },

  // Send a message
  async sendMessage(roomId, senderId, content) {
    return await db.execute(
      "INSERT INTO messages (room_id, sender_id, content) VALUES (?, ?, ?)",
      [roomId, senderId, content],
    );
  },

  // Get messages for a specific room
  async getMessages(roomId) {
    return await db.execute(
      "SELECT * FROM messages WHERE room_id = ? ORDER BY created_at ASC",
      [roomId],
    );
  },
};

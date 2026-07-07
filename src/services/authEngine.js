import crypto from "crypto";
import * as mysqlUserRepo from "./mysql/userService";
// import * as firebaseUserRepo from "./firebase/storageService";

const DRIVER_TOKEN = process.env.DATABASE_PROVIDER || "MYSQL";

export const authEngine = {
  getUserForLogin: async (email) => {
    return await mysqlUserRepo.findMysqlUserByEmail(email);
  },

  registerUser: async ({ name, email, hashedPassword }) => {
    // 🚀 Generate the single UUID right here upfront!
    const generatedUserId = crypto.randomUUID();

    if (DRIVER_TOKEN === "DUAL_WRITE") {
      await mysqlUserRepo.insertMysqlUser({
        id: generatedUserId,
        name,
        email,
        hashedPassword,
      });
      try {
        await firebaseUserRepo.insertFirebaseUser(generatedUserId, {
          name,
          email,
        });
        console.log(
          `🟢 AuthEngine: Synced user ID ${generatedUserId} to Firebase.`,
        );
      } catch (err) {
        console.error("❌ AuthEngine: Firebase sync dropped:", err.message);
      }
      return generatedUserId;
    }

    if (DRIVER_TOKEN === "FIREBASE") {
      await firebaseUserRepo.insertFirebaseUser(generatedUserId, {
        name,
        email,
      });
      return generatedUserId;
    }

    // Default to MYSQL standalone
    await mysqlUserRepo.insertMysqlUser({
      id: generatedUserId,
      name,
      email,
      hashedPassword,
    });
    return generatedUserId;
  },

  updateUserProfile: async (userId, userData) => {
    // 🔍 DEBUG: Confirm the engine received the call
    console.log("Engine: Routing update for user:", userId);

    if (DRIVER_TOKEN === "MYSQL" || DRIVER_TOKEN === "DUAL_WRITE") {
      const result = await mysqlUserRepo.updateMysqlUser(userId, userData);
      // 🔍 DEBUG: See if the service returned a result
      console.log("Engine: Service result:", result);
      return result;
    }
  },

  async getUserPassword(userId) {
    const user = await mysqlUserRepo.getUserPassword(userId);
    if (!user) throw new Error("User not found.");

    return user.password;
  },

  async updatePassword(userId, newPassword) {
    // 3. Hash and save via the mysqlService

    await mysqlUserRepo.updatePassword(userId, newPassword);

    return true;
  },
};

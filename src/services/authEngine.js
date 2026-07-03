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
};

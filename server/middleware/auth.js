import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const auth = req.auth(); // ✅ call as function
    const userId = auth.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID" });
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user || user.privateMetadata.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }

    next(); // ✅ user is admin
  } catch (error) {
    console.error("protectAdmin middleware error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

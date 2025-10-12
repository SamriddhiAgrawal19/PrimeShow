import { clerkClient } from "@clerk/express";

export const protectAdmin = async(req, res, next) => {
    try {
        const {userId} = req.auth;
        const user = await clerkClient.users.getUser(userId);
        if (!user || !user.privateMetadata.isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    } catch (error) {
        console.error("Error in protectAdmin middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

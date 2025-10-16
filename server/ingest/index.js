import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "prime-show" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      image: image_url,
    };
    try {
      await User.create(userData);
      console.log("User created:", userData);
    } catch (err) {
      console.error("Error creating user:", err);
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    try {
      const deleted = await User.findByIdAndDelete(id);
      if (deleted) console.log("User deleted:", id);
      else console.log("User not found for deletion:", id);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-update-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      image: image_url,
    };
    try {
      const updated = await User.findByIdAndUpdate(id, userData, { new: true });
      if (updated) console.log("User updated:", updated);
      else console.log("User not found for update:", id);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  }
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];

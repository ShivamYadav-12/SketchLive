import { z } from "zod";

export const CreateUserSignup = z.object({
  userName: z.string().min(2).max(20),
  password: z.string(),
  name: z.string(),
});

export const CreatedUserSignin = z.object({
  userName: z.string().min(2).max(20),
  password: z.string(),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(2).max(20),
});

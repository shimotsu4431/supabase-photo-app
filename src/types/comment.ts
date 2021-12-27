import { Profile } from "../hooks/useUser";

export type Comment = {
  id: number,
  userId: string,
  created_at: string,
  updated_at: string,
  body: string,
  is_edited: boolean,
  photoId: number
  users: Profile
}
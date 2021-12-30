import { Profile } from "../hooks/useUser";
import { Comment } from "./comment";
import { Like } from "./likes";

export type PublicPhoto = {
  id: number,
  title: string,
  src: string
  is_published: boolean
  updated_at: string | null
  created_at: string
  key?: string
  comments?: Comment[] | null
  likes?: Like[]
  user?: Profile
}
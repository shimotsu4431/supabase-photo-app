import { Profile } from "../hooks/useUser";
import { Comment } from "./comment";
import { Like } from "./likes";

export type PublicPhoto = {
  id: number,
  key: string
  title: string,
  src: string
  isPublished: boolean
  updated_at: string | null
  created_at: string
  comments?: Comment[] | null
  likes?: Like[]
  user?: Profile
}
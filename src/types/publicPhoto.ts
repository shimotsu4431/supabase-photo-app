import { Comment } from "./comment";

export type PublicPhoto = {
  id: number,
  key: string
  title: string,
  src: string
  isPublished: boolean
  comments?: Comment[] | null
  updated_at?: string
  created_at?: string
}
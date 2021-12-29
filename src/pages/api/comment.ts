import { NextApiRequest, NextApiResponse } from "next";
import { SUPABASE_BUCKET_COMMENTS_PATH } from "../../utils/const";
import { supabase } from "../../utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method

  if (method === "POST") {
    const sendData = req.body.value
    const { data, error } = await supabase.from(SUPABASE_BUCKET_COMMENTS_PATH).insert([sendData])

    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json(data)
  }

  if (method === "DELETE") {
    const commentId = req.body.commentId
    const { data, error } = await supabase.from(SUPABASE_BUCKET_COMMENTS_PATH).delete().eq('id', commentId)

    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json(data)
  }
}
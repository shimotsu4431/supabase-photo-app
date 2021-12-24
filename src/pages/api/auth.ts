import { supabase } from "../../utils/supabaseClient";

export default function handler(req: { body: any; }, res: any) {
  supabase.auth.api.setAuthCookie(req, res);
}
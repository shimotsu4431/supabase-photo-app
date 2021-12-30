import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserDetail } from '../../../components/page/User';
import { Layout } from '../../../components/ui/Layout'
import { Profile } from '../../../hooks/useUser';
import { PublicPhoto } from '../../../types/publicPhoto';
import { supabase } from '../../../utils/supabaseClient';
import { SUPABASE_BUCKET_PHOTOS_PATH, SUPABASE_BUCKET_USERS_PATH } from '../../../utils/const';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { data: user } = await supabase
    .from(SUPABASE_BUCKET_USERS_PATH)
    .select("*")
    .eq("id", params?.userName)
    .single();

  const { data: publicPhotos } = await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`*, comments(*), likes(*)`)
    .eq("userId", user.id)
    .order("created_at", { ascending: false })

  if (!user) {
    return { notFound: true }
  }

  return { props: { user, publicPhotos } };
}

type props = {
  user: Profile
  publicPhotos: PublicPhoto[]
}

const UserPage: NextPage<props> = ({ user, publicPhotos }) => {
  return (
    <Layout>
      <UserDetail user={user} publicPhotos={publicPhotos} />
    </Layout>
  )
}

export default UserPage

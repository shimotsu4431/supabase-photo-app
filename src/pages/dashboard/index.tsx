import { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextPage } from 'next'
import { Dashboard } from '../../components/page/Dashboard';
import { Layout } from '../../components/ui/Layout'
import { PublicPhoto } from '../../types/publicPhoto';
import { SUPABASE_BUCKET_PHOTOS_PATH } from '../../utils/const';
import { supabase } from '../../utils/supabaseClient'

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  const { data: publicPhotos } = await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`*`)
    .eq("userId", user?.id)
    .order("created_at", { ascending: false })

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  // If there is a user, return it.
  return { props: { user, publicPhotos } };
}

type props = {
  user: User
  publicPhotos: PublicPhoto[]
}

const DashboardPage: NextPage<props> = ({ user, publicPhotos }) => {
  return (
    <Layout>
      <Dashboard user={user} publicPhotos={publicPhotos} />
    </Layout>
  )
}

export default DashboardPage

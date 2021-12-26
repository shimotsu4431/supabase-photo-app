import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserPhotoNew } from '../../../components/page/UserPhotoNew';
import { Layout } from '../../../components/ui/Layout';
import { Profile } from '../../../hooks/useUser';
import { SUPABASE_BUCKET_USERS_PATH } from '../../../utils/const';
import { supabase } from '../../../utils/supabaseClient';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { token } = await supabase.auth.api.getUserByCookie(req);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { data: user } = await supabase
    .from(SUPABASE_BUCKET_USERS_PATH)
    .select("*")
    .eq("fullname", params?.userName)
    .single();

  if (!user) {
    return { notFound: true }
  }
  return { props: { user } };
}

type props = {
  user: Profile
}

const UserPhotoNewPage: NextPage<props> = ({ user }) => {
  return (
    <Layout>
      <UserPhotoNew user={user} />
    </Layout>
  )
}

export default UserPhotoNewPage

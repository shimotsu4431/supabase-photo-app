import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserPhotoNew } from '../../../components/page/UserPhotoNew';
import { Layout } from '../../../components/ui/Layout';
import { Profile } from '../../../hooks/useUser';
import { supabase } from '../../../utils/supabaseClient';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { data: user } = await supabase
    .from("users")
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

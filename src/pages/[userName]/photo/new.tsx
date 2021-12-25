import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserDetail } from '../../../components/page/User';
import { UserPhotoNew } from '../../../components/page/UserPhotoNew';
import { Layout } from '../../../components/ui/Layout';
import { Profile } from '../../../hooks/useUser';
import { supabase } from '../../../utils/supabaseClient';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  console.log("params", params)

  const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("fullname", params?.userName)
          .single();

  if (!user) {
    return { notFound: true }
  }

  // Todo: ここで photos も return したい
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

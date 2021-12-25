import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserDetail } from '../../components/page/User';
import { Layout } from '../../components/ui/Layout'
import { Profile } from '../../hooks/useUser';
import { supabase } from '../../utils/supabaseClient';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
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

const UserPage: NextPage<props> = ({ user }) => {
  return (
    <Layout>
      <UserDetail user={user} />
    </Layout>
  )
}

export default UserPage

import type { GetServerSidePropsContext, NextPage } from 'next'
import { AccountEdit } from '../../../components/page/AccountEdit'
import { Layout } from '../../../components/ui/Layout'
import { supabase } from '../../../utils/supabaseClient'

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  // If there is a user, return it.
  return { props: { user } };
}

const AccountEditPage: NextPage = () => {
  return (
    <Layout>
      <AccountEdit />
    </Layout>
  )
}

export default AccountEditPage

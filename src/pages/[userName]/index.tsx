import superjson from 'superjson';
import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserDetail } from '../../components/page/User';
import { Layout } from '../../components/ui/Layout'
import { Profile } from '../../hooks/useUser';
import { PublicPhoto } from '../../types/publicPhoto';
import { supabase } from '../../utils/supabaseClient';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("fullname", params?.userName)
    .single();

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("userId", user.id)
    .eq('is_published', true)

  const publicPhotos: PublicPhoto[] = []

  async function setPublicPhotos() {
    if (photos) {
      for (const photo of photos) {
        const { publicURL, error } = supabase.storage.from("photos").getPublicUrl(`${photo.url.slice(7)}`) //FIXME
        if (error || !publicURL) {
          throw error
        }

        publicPhotos.push({
          id: photo.id,
          key: photo.url.split('/')[2],
          title: photo.title,
          src: publicURL
        })
      }
    }
  }
  await setPublicPhotos()

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

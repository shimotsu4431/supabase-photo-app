import { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextPage } from 'next'
import { Dashboard } from '../../components/page/Dashboard';
import { Layout } from '../../components/ui/Layout'
import { PublicPhoto } from '../../types/publicPhoto';
import { SUPABASE_BUCKET_PHOTOS_PATH } from '../../utils/const';
import { getPhotoKeyFromBucketPath } from '../../utils/getPhotoKeyFromBucketPath';
import { removeBucketPath } from '../../utils/removeBucketPath';
import { supabase } from '../../utils/supabaseClient'

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  const { data: photos } = await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`*`)
    .eq("userId", user?.id)
    .order("created_at", { ascending: false })

  const publicPhotos: PublicPhoto[] = []

  async function setPublicPhotos() {
    if (photos) {
      for (const photo of photos) {
        const { publicURL, error } = supabase.storage.from(SUPABASE_BUCKET_PHOTOS_PATH).getPublicUrl(removeBucketPath(photo.url, SUPABASE_BUCKET_PHOTOS_PATH))
        if (error || !publicURL) {
          throw error
        }

        publicPhotos.push({
          id: photo.id,
          key: getPhotoKeyFromBucketPath(photo.url),
          title: photo.title,
          src: publicURL,
          isPublished: photo.is_published,
          updated_at: photo.updated_at,
          created_at: photo.created_at
        })
      }
    }
  }
  await setPublicPhotos()

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

import { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextPage } from 'next'
import { DashboardLikes } from '../../../components/page/DashboardLikes';
import { Layout } from '../../../components/ui/Layout';
import { PublicPhoto } from '../../../types/publicPhoto';
import { SUPABASE_BUCKET_LIKES_PATH, SUPABASE_BUCKET_PHOTOS_PATH } from '../../../utils/const';
import { getPhotoKeyFromBucketPath } from '../../../utils/getPhotoKeyFromBucketPath';
import { removeBucketPath } from '../../../utils/removeBucketPath';
import { supabase } from '../../../utils/supabaseClient';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  const { data: likes } = await supabase
    .from(SUPABASE_BUCKET_LIKES_PATH)
    .select(`*, photo: photos(*), user: userId(*)`)
    .eq("userId", user?.id)
    .order("created_at", { ascending: false })

  const publicPhotos: PublicPhoto[] = []

  async function setPublicPhotos() {
    if (likes) {
      for (const like of likes) {
        const { publicURL, error } = supabase.storage.from(SUPABASE_BUCKET_PHOTOS_PATH).getPublicUrl(removeBucketPath(like.photo.url, SUPABASE_BUCKET_PHOTOS_PATH))
        if (error || !publicURL) {
          throw error
        }

        publicPhotos.push({
          id: like.photo.id,
          key: getPhotoKeyFromBucketPath(like.photo.url),
          title: like.photo.title,
          src: publicURL,
          isPublished: like.photo.is_published,
          updated_at: like.photo.updated_at,
          created_at: like.photo.created_at,
          user: like.user
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

const DashboardLikesPage: NextPage<props> = ({ user, publicPhotos }) => {
  return (
    <Layout>
      <DashboardLikes user={user} publicPhotos={publicPhotos} />
    </Layout>
  )
}

export default DashboardLikesPage

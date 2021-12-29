import { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextPage } from 'next'
import { DashboardLikes } from '../../../components/page/DashboardLikes';
import { Layout } from '../../../components/ui/Layout';
import { PublicPhoto } from '../../../types/publicPhoto';
import { SUPABASE_BUCKET_PHOTOS_PATH } from '../../../utils/const';
import { getPhotoKeyFromBucketPath } from '../../../utils/getPhotoKeyFromBucketPath';
import { removeBucketPath } from '../../../utils/removeBucketPath';
import { supabase } from '../../../utils/supabaseClient';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  const { data: likes } = await supabase
    .from("likes")
    .select(`*, photos(*)`)
    .eq("userId", user?.id)
    .order("created_at", { ascending: false })

  console.log("likes",likes)
  const publicPhotos: PublicPhoto[] = []

  async function setPublicPhotos() {
    if (likes) {
      for (const like of likes) {
        const { publicURL, error } = supabase.storage.from(SUPABASE_BUCKET_PHOTOS_PATH).getPublicUrl(removeBucketPath(like.photos.url, SUPABASE_BUCKET_PHOTOS_PATH))
        if (error || !publicURL) {
          throw error
        }

        publicPhotos.push({
          id: like.photos.id,
          key: getPhotoKeyFromBucketPath(like.photos.url),
          title: like.photos.title,
          src: publicURL,
          isPublished: like.photos.is_published,
          updated_at: like.photos.updated_at,
          created_at: like.photos.created_at
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

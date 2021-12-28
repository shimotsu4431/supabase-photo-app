import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserDetail } from '../../components/page/User';
import { Layout } from '../../components/ui/Layout'
import { Profile } from '../../hooks/useUser';
import { PublicPhoto } from '../../types/publicPhoto';
import { supabase } from '../../utils/supabaseClient';
import { removeBucketPath } from '../../utils/removeBucketPath';
import { SUPABASE_BUCKET_PHOTOS_PATH, SUPABASE_BUCKET_USERS_PATH } from '../../utils/const';
import { getPhotoKeyFromBucketPath } from '../../utils/getPhotoKeyFromBucketPath';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { data: user } = await supabase
    .from(SUPABASE_BUCKET_USERS_PATH)
    .select("*")
    .eq("fullname", params?.userName)
    .single();

  const { data: photos } = await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`*, comments (*)`)
    .eq("userId", user.id)
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
          comments: photo.comments,
          updated_at: photo.updated_at,
          created_at: photo.created_at
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

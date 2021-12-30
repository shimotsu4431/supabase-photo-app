import type { GetServerSidePropsContext, NextPage } from 'next'
import { Top } from '../components/page/Top'
import { Layout } from '../components/ui/Layout'
import { PublicPhoto } from '../types/publicPhoto'
import { SUPABASE_BUCKET_PHOTOS_PATH } from '../utils/const'
import { getPhotoKeyFromBucketPath } from '../utils/getPhotoKeyFromBucketPath'
import { removeBucketPath } from '../utils/removeBucketPath'
import { supabase } from '../utils/supabaseClient'

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { data: photos } = await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`
      *,
      comments(*),
      user: userId(*),
      likes(*)
    `)
    .eq('is_published', true)
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
          user: photo.user,
          key: getPhotoKeyFromBucketPath(photo.url),
          title: photo.title,
          src: publicURL,
          isPublished: photo.is_published,
          comments: photo.comments,
          updated_at: photo.updated_at,
          created_at: photo.created_at,
          likes: photo.likes
        })
      }
    }
  }
  await setPublicPhotos()

  return { props: { publicPhotos } };
}

type props = {
  publicPhotos: PublicPhoto[]
}

const Home: NextPage<props> = ({ publicPhotos }) => {
  return (
    <Layout>
      <Top publicPhotos={publicPhotos} />
    </Layout>
  )
}

export default Home

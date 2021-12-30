import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserPhoto } from '../../../../../components/page/UserPhoto';
import { Layout } from '../../../../../components/ui/Layout';
import { PublicPhoto } from '../../../../../types/publicPhoto';
import { SUPABASE_BUCKET_PHOTOS_PATH } from '../../../../../utils/const';
import { getPhotoKeyFromBucketPath } from '../../../../../utils/getPhotoKeyFromBucketPath';
import { removeBucketPath } from '../../../../../utils/removeBucketPath';
import { supabase } from '../../../../../utils/supabaseClient';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { data: photo } = await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`*, user: userId(*), likes(*), comments(*, user: userId(*))`)
    .eq("id", params?.id)
    .single()

  async function setPublicPhotos() {
    if (photo) {
      const { publicURL, error } = supabase.storage.from(SUPABASE_BUCKET_PHOTOS_PATH).getPublicUrl(removeBucketPath(photo.url, SUPABASE_BUCKET_PHOTOS_PATH))
        if (error || !publicURL) {
          throw error
        }

      return {
        id: photo.id,
        key: getPhotoKeyFromBucketPath(photo.url),
        title: photo.title,
        src: publicURL,
        isPublished: photo.is_published,
        comments: photo.comments,
        likes: photo.likes,
        created_at: photo.created_at,
        updated_at: photo.updated_at,
        user: photo.user,
      }
    }
  }

  const photoData: PublicPhoto | undefined = await setPublicPhotos()

  if (!photoData || !photoData.isPublished) {
    return { notFound: true }
  }
  return { props: { photoData } };
}

type props = {
  photoData: PublicPhoto
}

const UserPhotoPage: NextPage<props> = ({ photoData}) => {
  return (
    <Layout>
      <UserPhoto photoData={photoData}/>
    </Layout>
  )
}

export default UserPhotoPage

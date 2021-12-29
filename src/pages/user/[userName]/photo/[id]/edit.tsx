import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserPhotoEdit } from '../../../../../components/page/UserPhotoEdit';
import { Layout } from '../../../../../components/ui/Layout';
import { PublicPhoto } from '../../../../../types/publicPhoto';
import { SUPABASE_BUCKET_PHOTOS_PATH, SUPABASE_BUCKET_USERS_PATH } from '../../../../../utils/const';
import { getPhotoKeyFromBucketPath } from '../../../../../utils/getPhotoKeyFromBucketPath';
import { removeBucketPath } from '../../../../../utils/removeBucketPath';
import { supabase } from '../../../../../utils/supabaseClient';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { token } = await supabase.auth.api.getUserByCookie(req);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { data: photo } = await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select("*, user: userId!inner(*)")
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
        updated_at: photo.updated_at,
        created_at: photo.created_at,
        user: photo.user
      }
    }
  }

  const photoData: PublicPhoto | undefined = await setPublicPhotos()
  if (!photoData) {
    return { notFound: true }
  }
  return { props: { photoData } };
}

type props = {
  photoData: PublicPhoto
}

const UserPhotoEditPage: NextPage<props> = ({ photoData }) => {
  return (
    <Layout>
      <UserPhotoEdit photoData={photoData} />
    </Layout>
  )
}

export default UserPhotoEditPage

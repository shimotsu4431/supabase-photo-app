import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserPhotoEdit } from '../../../../../components/page/UserPhotoEdit';
import { Layout } from '../../../../../components/ui/Layout';
import { Profile } from '../../../../../hooks/useUser';
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

  const { data: user } = await supabase
    .from(SUPABASE_BUCKET_USERS_PATH)
    .select("*")
    .eq("id", params?.userName)
    .single();

  const { data: photo } = await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select("*")
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
        created_at: photo.created_at
      }
    }
  }

  const photoData: PublicPhoto | undefined = await setPublicPhotos()
  if (!user || !photoData) {
    return { notFound: true }
  }
  return { props: { user, photoData } };
}

type props = {
  user: Profile
  photoData: PublicPhoto
}

const UserPhotoEditPage: NextPage<props> = ({ user, photoData }) => {
  return (
    <Layout>
      <UserPhotoEdit user={user} photoData={photoData} />
    </Layout>
  )
}

export default UserPhotoEditPage

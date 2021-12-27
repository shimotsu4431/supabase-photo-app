import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserPhoto } from '../../../../components/page/UserPhoto';
import { Layout } from '../../../../components/ui/Layout';
import { Profile } from '../../../../hooks/useUser';
import { Comment } from '../../../../types/comment';
import { PublicPhoto } from '../../../../types/publicPhoto';
import { SUPABASE_BUCKET_COMMENTS_PATH, SUPABASE_BUCKET_PHOTOS_PATH, SUPABASE_BUCKET_USERS_PATH } from '../../../../utils/const';
import { getPhotoKeyFromBucketPath } from '../../../../utils/getPhotoKeyFromBucketPath';
import { removeBucketPath } from '../../../../utils/removeBucketPath';
import { supabase } from '../../../../utils/supabaseClient';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { data: user } = await supabase
    .from(SUPABASE_BUCKET_USERS_PATH)
    .select("*")
    .eq("fullname", params?.userName)
    .single();

  const { data: photo } = await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`*, comments!inner (*, users!inner (*))`)
    // .select(`*`)
    .eq("id", params?.id)
    .single()

  // const { data: comments } = await supabase
  //   .from(SUPABASE_BUCKET_COMMENTS_PATH)
  //   .select(`*, users!inner (*)`)
  //   .eq("photoId", params?.id)

  // console.log("comments", comments)

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
        comments: photo.comments
      }
    }
  }

  const photoData: PublicPhoto | undefined = await setPublicPhotos()

  if (!user || !photoData || !photoData.isPublished) {
    return { notFound: true }
  }
  return { props: { user, photoData } };
}

type props = {
  user: Profile
  photoData: PublicPhoto
}

const UserPhotoPage: NextPage<props> = ({ user, photoData}) => {
  return (
    <Layout>
      <UserPhoto user={user} photoData={photoData}/>
    </Layout>
  )
}

export default UserPhotoPage

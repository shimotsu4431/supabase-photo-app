import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserPhotoEdit } from '../../../../components/page/UserPhotoEdit';
import { Layout } from '../../../../components/ui/Layout';
import { Profile } from '../../../../hooks/useUser';
import { PublicPhoto } from '../../../../types/PublicPhoto';
import { removeBucketPath } from '../../../../utils/removeBucketPath';
import { supabase } from '../../../../utils/supabaseClient';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  console.log("params", params)

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("fullname", params?.userName)
    .single();

  const { data: photo } = await supabase
    .from("photos")
    .select("*")
    .eq("id", params?.id)
    .single()

  async function setPublicPhotos() {
    if (photo) {
      const { publicURL, error } = supabase.storage.from("photos").getPublicUrl(removeBucketPath(photo.url, "photos"))
        if (error || !publicURL) {
          throw error
        }

      return {
        id: photo.id,
        key: photo.url.split('/')[2],
        title: photo.title,
        src: publicURL,
        isPublished: photo.is_published
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

const setPubUserPhotoEditPagelicPhotos: NextPage<props> = ({ user, photoData }) => {
  return (
    <Layout>
      <UserPhotoEdit user={user} photoData={photoData} />
    </Layout>
  )
}

export default setPubUserPhotoEditPagelicPhotos

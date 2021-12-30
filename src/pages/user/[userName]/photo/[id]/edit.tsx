import type { GetServerSidePropsContext, NextPage } from 'next'
import { UserPhotoEdit } from '../../../../../components/page/UserPhotoEdit';
import { Layout } from '../../../../../components/ui/Layout';
import { PublicPhoto } from '../../../../../types/publicPhoto';
import { SUPABASE_BUCKET_PHOTOS_PATH } from '../../../../../utils/const';
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

  const { data: photoData } = await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select("*, user: userId(*)")
    .eq("id", params?.id)
    .single()

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

import type { GetServerSidePropsContext, NextPage } from 'next'
import { Top } from '../components/page/Top'
import { Layout } from '../components/ui/Layout'
import { PublicPhoto } from '../types/publicPhoto'
import { SUPABASE_BUCKET_PHOTOS_PATH } from '../utils/const'
import { supabase } from '../utils/supabaseClient'

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { data: publicPhotos } = await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`
      *,
      comments(*),
      user: userId(*),
      likes(*)
    `)
    .eq('is_published', true)
    .order("created_at", { ascending: false })

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

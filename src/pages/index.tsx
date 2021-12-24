import type { NextPage } from 'next'
import { Top } from '../components/page/Top'
import { Layout } from '../components/ui/Layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <Top />
    </Layout>
  )
}

export default Home

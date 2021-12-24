import type { NextPage } from 'next'
import Router from 'next/router'
import { useEffect } from 'react'
import { Account } from '../components/page/Account'
import { Layout } from '../components/ui/Layout'
import { useUser } from '../hooks/useUser'

const AccountPage: NextPage = () => {
  const {
    session,
  } = useUser()

  useEffect(() => {
    if (!session) Router.push('/login')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Layout>
      <Account />
    </Layout>
  )
}

export default AccountPage

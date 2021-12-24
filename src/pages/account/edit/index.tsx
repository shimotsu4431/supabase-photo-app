import type { NextPage } from 'next'
import Router from 'next/router'
import { useEffect } from 'react'
import { AccountEdit } from '../../../components/page/AccountEdit'
import { Layout } from '../../../components/ui/Layout'
import { useUser } from '../../../hooks/useUser'

const AccountEditPage: NextPage = () => {
  const {
    session,
  } = useUser()

  useEffect(() => {
    if (!session) Router.push('/login')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Layout>
      <AccountEdit />
    </Layout>
  )
}

export default AccountEditPage

import type { NextPage } from 'next'
import Router from 'next/router'
import { useEffect } from 'react'
import { Login } from '../components/page/Login'
import { Signin } from '../components/page/Signin'
import { Layout } from '../components/ui/Layout'
import { useUser } from '../hooks/useUser'

const SigninPage: NextPage = () => {
  const {
    session,
  } = useUser()

  useEffect(() => {
    if (session) Router.push('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Layout>
      <Signin />
    </Layout>
  )
}

export default SigninPage

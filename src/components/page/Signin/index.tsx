import Link from 'next/link';
import Router from 'next/router';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useUser } from '../../../hooks/useUser'
import { supabase } from '../../../utils/supabaseClient';
import { Main } from '../../ui/Main'

type Inputs = {
  email: string,
  password: string
};

export const Signin: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const {
    session,
    signOut,
    signInWithGoogle
  } = useUser()

  const onSubmit: SubmitHandler<Inputs> = async (data, event): Promise<void> => {
    const { email, password } = data

    try {
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })
      toast.success('アカウントを作成しました！ メールアドレスを確認してください。')
      Router.push('/')
    } catch(error) {
      console.log(error)
      toast.error("エラーが発生しました。")
    }
  }

  return (
    <Main>
      <h2 className="text-xl mb-4">Signin</h2>
      <div>
        <>
          <button onClick={signInWithGoogle} className='border-gray-300 border-2 rounded p-1 mb-4'>Googleでサインイン</button>
          <div className='mt-4'>
            <h2 className='text-lg font-bold mb-2'>メールアドレスでサインイン</h2>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
              <label htmlFor="email">メールアドレス</label>
              <input id="email" className='py-1 px-2 border-2 w-4/12' {...register("email", { required: true })} />
              {errors.email && <span>This field is required</span>}

              <label htmlFor="password">パスワード</label>
              <input id="password" className='py-1 px-2 border-2 w-4/12' {...register("password", { required: true })} />
              {errors.password && <span>This field is required</span>}

              <input className='border-gray-300 border-2 rounded p-1 w-16 mt-4' type="submit" />
            </form>
          </div>
        </>
      </div>
    </Main>
  )
}

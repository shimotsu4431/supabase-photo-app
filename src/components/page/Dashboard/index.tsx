import React from 'react'
import Image from 'next/image'
import { Main } from '../../ui/Main'
import { PublicPhoto } from '../../../types/publicPhoto'
import { User } from '@supabase/supabase-js'
import { DateTime } from 'luxon'
import Router from 'next/router'
import { useUser } from '../../../hooks/useUser'

type props = {
  user: User
  publicPhotos: PublicPhoto[]
}

export const Dashboard: React.FC<props> = ({ user, publicPhotos }) => {
  const {
    session,
    profile,
  } = useUser()

  return (
    <Main>
      <div className='mb-6'>
        <h2 className="text-xl mb-4">投稿画像一覧</h2>
      </div>
      <div className='py-2'>
        <ul className='flex flex-wrap'>
          {publicPhotos.map((photo) => {
            return (
              <li key={photo.id} className='mb-6 w-1/2'>
                <div className='flex'>
                  <div>
                    <Image
                      src={photo.src ?? ""}
                      width={120}
                      height={120}
                      alt={photo.title ?? ""}
                    />
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-xl mb-1'>{photo.title}</h3>
                    <p className='text-xs mb-1'>投稿日: {DateTime.fromISO(photo.updated_at ?? photo.created_at).toFormat('yyyy.MM.dd')}</p>
                    <p className='text-xs'>isPublished: {photo.isPublished ? "true" : "false"}</p>
                    <button onClick={() => Router.push(`/${profile?.fullname}/photo/${photo.id}/edit`)} className='border-gray-300 border-2 rounded w-12 mt-2 text-sm'>編集</button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </Main>
  )
}

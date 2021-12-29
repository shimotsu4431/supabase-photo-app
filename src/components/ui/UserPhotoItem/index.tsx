import React, { useCallback } from 'react'
import { DateTime } from 'luxon'
import Image from 'next/image'
import { Profile, useUser } from '../../../hooks/useUser'
import { PublicPhoto } from '../../../types/publicPhoto'
import Link from 'next/link'
import { supabase } from '../../../utils/supabaseClient'
import { toast } from 'react-toastify'
import Router from 'next/router'
import { SUPABASE_BUCKET_PHOTOS_PATH } from '../../../utils/const'

type props = {
  user: Profile
  publicPhoto: PublicPhoto
}

export const UserPhotoItem: React.FC<props> = ({ user, publicPhoto }) => {
  const { user: sessionUser } = useUser()

  return (
    <li key={publicPhoto.id} className='mb-10 flex flex-col'>
      {publicPhoto.updated_at && <p className='text-sm'>{DateTime.fromISO(publicPhoto.updated_at).toFormat('yyyy.MM.dd')}</p>}
      <h3 className='text-2xl mb-2'>{publicPhoto.title}</h3>
      <div>
        <Link href={`/user/${user.id}/photo/${publicPhoto.id}`}>
          <a className='inline-block'>
            <Image src={publicPhoto.src} width={200} height={200 * 2 / 3} alt={publicPhoto.title} loading='lazy'></Image>
          </a>
        </Link>
      </div>
      <div>
        コメント: <Link href={`/user/${user.id}/photo/${publicPhoto.id}#comments`}><a className='px-1 underline'>{publicPhoto.comments?.length ?? 0}</a></Link>件
      </div>
      {sessionUser?.id === user.id && (
        <div className='flex flex-col pt-2'>
          <div className='inline-block mb-1'>
            isPublished: {publicPhoto.isPublished ? "true" : "false"}
          </div>
          <div className='flex'>
            <div>
              <button onClick={() => Router.push(`/user/${user.id}/photo/${publicPhoto.id}/edit`)} className='border-gray-300 border-2 rounded p-1 w-12 mr-2'>編集</button>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

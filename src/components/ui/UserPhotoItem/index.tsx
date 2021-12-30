import React, { useCallback } from 'react'
import { DateTime } from 'luxon'
import Image from 'next/image'
import { Profile, useUser } from '../../../hooks/useUser'
import { PublicPhoto } from '../../../types/publicPhoto'
import Link from 'next/link'
import Router from 'next/router'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

type props = {
  user: Profile
  publicPhoto: PublicPhoto
}

export const UserPhotoItem: React.FC<props> = ({ user, publicPhoto }) => {
  const { user: sessionUser } = useUser()

  return (
    <li key={publicPhoto.id} className='mb-10 flex flex-col w-1/2'>
      {publicPhoto.updated_at && <p className='text-sm'>{DateTime.fromISO(publicPhoto.updated_at).toFormat('yyyy.MM.dd')}</p>}
      <h3 className='text-2xl mb-2'>{publicPhoto.title}</h3>
      <div>
        <Link href={`/user/${user.id}/photo/${publicPhoto.id}`}>
          <a className='inline-block'>
            <Image src={publicPhoto.src} width={300} height={200} alt={publicPhoto.title} loading='lazy'></Image>
          </a>
        </Link>
      </div>
      <div className='flex'>
        <div className='flex items-center mr-2'>
          {publicPhoto.likes && publicPhoto.likes?.length > 0 ? (<AiFillHeart size={18} />) : (<AiOutlineHeart size={18} />)}<span className='ml-1'>{publicPhoto.likes?.length}</span>
        </div>
        <span>/</span>
        <div className='ml-2'>
          コメント: <Link href={`/user/${user.id}/photo/${publicPhoto.id}#comments`}><a className='px-1 underline'>{publicPhoto.comments?.length ?? 0}</a></Link>件
        </div>
      </div>
      {sessionUser?.id === user.id && (
        <div className='flex flex-col pt-2'>
          <div className='inline-block mb-1'>
            is_published: {publicPhoto.is_published ? "true" : "false"}
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

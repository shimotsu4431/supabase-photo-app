import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { PublicPhoto } from '../../../types/publicPhoto'
import { Main } from '../../ui/Main'
import { DateTime } from 'luxon'
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"

type props = {
  publicPhotos: PublicPhoto[]
}

export const Top: React.FC<props> = ({ publicPhotos }) => {
  return (
    <Main>
      <h2 className="text-xl mb-4">Home</h2>
      <div>
        <ul className='flex flex-wrap'>
          {publicPhotos.map((photo) => {
            return (
              <li key={photo.id} className='w-1/2 mb-6'>
                <div className='flex'>
                  <div>
                    <Link href={`/user/${photo.user?.id}/photo/${photo.id}`}>
                      <a>
                      <Image
                        src={photo.src ?? ""}
                        width={300}
                        height={200}
                        alt={photo.title ?? ""}
                        objectFit={"cover"}
                      />
                      </a>
                    </Link>
                  </div>
                  <div className='ml-4'>
                    <Link href={`/user/${photo.user?.id}`}>
                      <a className='underline'>
                        <p className='text-xs'>{photo.user?.nickname ?? '名無し'}</p>
                      </a>
                    </Link>
                    <h3 className='text-2xl mb-1'>{photo.title}</h3>
                    <p className='text-xs mb-1'>投稿日: {DateTime.fromISO(photo.updated_at ?? photo.created_at).toFormat('yyyy.MM.dd')}</p>
                    <div className='flex items-center'>
                      <div className='flex items-center'>
                        {photo.likes && photo.likes?.length > 0 ? (<AiFillHeart size={18} />) : (<AiOutlineHeart size={18} />)}<span className='ml-1 text-xs'>{photo.likes?.length}</span>
                      </div>
                      <span className='mx-2'>/</span>
                      <p className='text-xs'>コメント: {photo.comments?.length ?? 0}件</p>
                    </div>
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

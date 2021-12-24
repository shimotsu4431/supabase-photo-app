import React, { useEffect, useState } from 'react'
import { useUser } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'

export const AccountEdit: React.FC = () => {
  const [nickName, setNickName] = useState<string>('')

  const {
    profile,
    updateNickname
  } = useUser()

  useEffect(() => {
    if (profile) setNickName(profile?.nickname ?? '')
  },[profile])

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      updateNickname(nickName);
    } catch (err) {
      console.log("エラーが発生しました");
    }
  }

  return (
    <Main>
      <h2 className="text-xl mb-4">アカウント情報 - 編集</h2>
      {profile && (
        <>
          <form onSubmit={handleUpdate}>
            <label htmlFor="nickname" className='block mb-2'>ニックネーム</label>
            <input
              id="nickname"
              type="text"
              required
              value={nickName ?? ''}
              onChange={(e) => setNickName(e.target.value)}
              placeholder=""
              className='border-gray-300 border-2 rounded p-1 mr-2'
            />
            <button type="submit" className='border-gray-300 border-2 rounded p-1'>設定</button>
          </form>
        </>
      )}
    </Main>
  )
}

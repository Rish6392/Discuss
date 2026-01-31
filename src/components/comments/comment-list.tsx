import React from 'react'
import CommentShow from './comment-show'

type CommentListProps = {
    postId:string
}

const CommentList :React.FC<CommentListProps>= ({postId}) => {
  return (
    <div>
      <h1 className='font-bold text-lg'>All 0 comments</h1>
      <CommentShow/>
    </div>
  )
}

export default CommentList

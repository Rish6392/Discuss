import PostShow from '@/components/posts/post-show';
import React from 'react'

type PostShowPageProps= {
  params:Promise<{slug:string;postId:string}>
}

const PostShowPage:React.FC<PostShowPageProps> = async ({params}) => {
  const {slug,postId} = (await params);
  return (
    <div>
      <PostShow postId= {postId} />
    </div>
  )
}

export default PostShowPage

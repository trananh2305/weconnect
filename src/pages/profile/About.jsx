import PostCreation from '@components/PostCreation'
import PostList from '@components/PostList'
import { useOutletContext, useParams } from 'react-router-dom';


const About = () => {
    const { userId } = useParams();
    const {data, isMyProfile} = useOutletContext();
  return (
    <div className="flex gap-4">
    <div className=" flex-[2] space-y-4 hidden sm:block">
      <div className="card">
        <p className="font-bold mb-3 text-lg">Introduction</p>
        <p>{data?.about}</p>
      </div>
      <div className="card">
        <p className="font-bold">Photos</p>
      </div>
    </div>
    <div className=" flex-[3]">
      <div className="flex-1 flex flex-col gap-4">
        {isMyProfile && <PostCreation />}
        {/* key dùng để cho react biết lúc nào thay đổi thì sẽ rerender lại tất cả state của component này */}
        <PostList userId={userId} key={userId} />
      </div>
    </div>
  </div>
  )
}

export default About
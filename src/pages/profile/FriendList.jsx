import Loading from '@components/Loading';
import UserCard from '@components/UserCard';
import { useGetFriendsQuery } from '@services/friendApi'
import { useParams } from 'react-router-dom';


const FriendList = () => {
    const {userId} = useParams()
    const {data, isFetching} = useGetFriendsQuery(userId);

    if (isFetching){
        return <Loading/>
    }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(data?.friends || []).map((user) => (
          <UserCard
            key={user._id}
            id={user._id}
            fullName={user.fullName}
            isShowAcctionBtn={false}
           imageUrl={user.image} 
          />
        ))}
      </div>
  )
}

export default FriendList
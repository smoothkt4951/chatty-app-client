import {Dispatch, FC, SetStateAction, useState} from 'react';
import { toast, Toaster } from 'react-hot-toast';
import {BiBlock, BiCheckCircle, BiLockOpen, BiMessageDots} from 'react-icons/bi';
import { BsCheck2 } from 'react-icons/bs';
import { RxCross2 } from 'react-icons/rx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import IconButton from '../../../../components/buttons/IconButton';
import useBlockStatus from '../../../../hooks/useBlockStatus';
import useFriendStatus from '../../../../hooks/useFriendStatus';
import { RootState } from '../../../../redux/store';
import { setRequest } from '../../../../services/userService';
import checkIsChannelExist from "../../../../utils/checkIsChannelExist";
import {createChannel} from "../../../../services/channelService";
import {setRefresh} from "../../../../redux/features/channelSlice";

type Props = {
    request: User;
    setTrigger: Dispatch<SetStateAction<boolean>>;
}

const RequestBox: FC<Props> = ({ request, setTrigger }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate();
    const { isPending, isBlocked, addBlock, removeBlock } = useBlockStatus(request.id);
    const { addFriend } = useFriendStatus(request.id);
    const [requestHandled, setRequestHandled] = useState(false);
    const [isFriend, setIsFriend] = useState(false);

    const handleAccept = async () => {
        const { statusCode, message } = await setRequest(user?.id!, request.id, false);

        if (statusCode === '200') {
            addFriend();
            toast.success('Friend added successfully.', {
                duration: 3000,
                position: 'bottom-center',
                style: {
                    backgroundColor: '#353535',
                    color: '#fff'
                }
            });
            setRequestHandled(true);
            setIsFriend(true);
            return setTrigger(prev => !prev);
        }

        setRequestHandled(true);
        setIsFriend(false);
        return toast.error(message, {
            duration: 3000,
            position: 'bottom-center',
            style: {
                backgroundColor: '#353535',
                color: '#fff'
            }
        });
    };

    const handleDecline = async () => {
        await setRequest(user?.id!, request.id, false);
        setRequestHandled(true);
        setIsFriend(false);
        return setTrigger(prev => !prev);
    };

    const handleBlock = () => {
        addBlock();
        setRequestHandled(true);
        setIsFriend(false);
        return toast.success('User blocked successfully.', {
            duration: 3000,
            position: 'bottom-center',
            style: {
                backgroundColor: '#353535',
                color: '#fff'
            }
        });
    };

    const handleUnblock = () => {
        removeBlock();
        return toast.success('User unblocked successfully.', {
            duration: 3000,
            position: 'bottom-center',
            style: {
                backgroundColor: '#353535',
                color: '#fff'
            }
        });
    }

    const handleClickMessage = async () => {
        const channelId = await checkIsChannelExist(user?.id!, request.id);

        if (channelId) return navigate('/chat', { state: { channelId } });
    };

    return (
        <>
            <div className="flex p-3 items-center">
                <LazyLoadImage
                    onClick={() => navigate('/profile', { state: { userId: request.id } })}
                    src={request.image}
                    alt='request'
                    effect="blur"
                    className="w-20 h-20 rounded-full object-cover cursor-pointer md:block hidden"
                />
                <p
                    onClick={() => navigate('/profile', { state: { userId: request.id } })}
                    className="ml-3 text-xl font-semibold cursor-pointer">
                    {request.username}
                </p>
                <div className="w-1/2 flex ml-auto">

                    {
                        !requestHandled
                            ? (
                                <>
                                    {isFriend && (
                                        <button
                                            onClick={handleClickMessage}
                                            className="font-semibold text-xl px-3 py-2 bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 hover:bg-neutral-400 duration-200 rounded-md mt-3 mr-3"
                                        >
                                            <BiMessageDots className="mx-auto text-3xl" />
                                        </button>
                                    )}
                                    <IconButton isTextCanClosed Icon={BsCheck2} text='Accept' type="button" handleClick={handleAccept} />
                                    <IconButton isTextCanClosed Icon={RxCross2} text='Decline' type="button" handleClick={handleDecline} />
                                </>
                            )
                            : null
                    }
                    {
                        isBlocked
                            ?
                            <IconButton isTextCanClosed Icon={BiLockOpen} text='Unblock' type="button" handleClick={handleUnblock} isPending={isPending} />
                            :
                            <IconButton isTextCanClosed Icon={BiBlock} text='Block' type="button" handleClick={handleBlock} isPending={isPending} />
                    }
                </div>
            </div>
            <Toaster />
        </>
    )
}

export default RequestBox

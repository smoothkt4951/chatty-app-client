import {Dispatch, FC, SetStateAction, useRef, useState} from 'react'
import { toast, Toaster } from 'react-hot-toast';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch } from 'react-redux';

import BasicButton from '../../../components/buttons/BasicButton';
import { uploadUserImage } from '../../../services/userService';
import Participants from './Participants';
import { updateChannel } from '../../../services/channelService';
import { setRefresh } from '../../../redux/features/channelSlice';
import Spinner from "../../../components/loading/Spinner";


type Props = {
    channel: Channel;
    participants: string[];
    setParticipants: Dispatch<SetStateAction<string[]>>;
    admins: string[];
    setAdmins: Dispatch<SetStateAction<string[]>>;
    image: any;
    setImage: Dispatch<SetStateAction<any>>;
}

const EditForm: FC<Props> = ({ channel, participants, setParticipants, admins, setAdmins, image, setImage }) => {
    const dispatch = useDispatch();
    const inputRef = useRef<any>(null);
    const [isPending, setIsPending] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
        setIsPending(true);
        e.preventDefault();
        let imageUrl = image;

        if (image !== channel.image) {
            imageUrl = await uploadUserImage(e.target.image.files[0]);
        }

        if (!e.target.image.files || !e.target.name.value) return;

        const { statusCode, message } = await updateChannel(channel.id, {
            name: e.target.name.value,
            participants,
            admins,
            description: e.target.description.value,
            image: imageUrl
        });

        if (statusCode === '200') {
            dispatch(setRefresh());
            setIsPending(false);
            return toast.success(message, {
                duration: 3000,
                position: 'bottom-center',
                style: {
                    backgroundColor: '#353535',
                    color: '#fff'
                }
            });
        }
        setIsPending(false);
        toast.error(message, {
            duration: 3000,
            position: 'bottom-center',
            style: {
                backgroundColor: '#353535',
                color: '#fff'
            }
        });
    }

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: any) => {
        const imageFile = e.target.files[0];

        if (imageFile && FileReader) {
            const fr = new FileReader();
            fr.onload = () => {
                setImage(fr.result);
            }
            fr.readAsDataURL(imageFile);
        }
    }

    return (
        <>
            {
                !isPending
                    ? (
                        <form action='POST' className='max-w-[800px] px-3 mx-auto overflow-y-auto overflow-x-hidden' onSubmit={handleSubmit}>
                            <div className='flex items-center justify-center w-full lg:flex-row flex-col py-5 border-b dark:border-neutral-600 border-neutral-400'>
                                <LazyLoadImage
                                    className={`rounded-full w-52 h-52 object-cover cursor-pointer duration-200 ${!image && 'border-2 dark:border-neutral-600 border-neutral-400'}`}
                                    src={image}
                                    alt='ch'
                                    onClick={handleClick}
                                />
                                <input onChange={handleChange} ref={inputRef} type="file" hidden name="image" accept='image/png, image/jpeg' />
                                <div className='md:pl-3 lg:pl-5 md:w-[350px]'>
                                    <div className='flex flex-col mb-3'>
                                        <label htmlFor="name">Name</label>
                                        <input
                                            defaultValue={channel?.name}
                                            className='dark:bg-neutral-700 bg-neutral-300 rounded-md p-2 outline-none'
                                            placeholder='Channel Name'
                                            maxLength={50}
                                            type="text"
                                            name='name'
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            defaultValue={channel?.description}
                                            name='description'
                                            placeholder='Channel Description'
                                            className='dark:bg-neutral-700 bg-neutral-300 p-2 resize-none rounded-md outline-none'
                                            maxLength={255}
                                            cols={20}
                                            rows={5}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Participants
                                participants={participants}
                                setParticipants={setParticipants}
                                admins={admins}
                                setAdmins={setAdmins}
                            />
                            <div className='p-3 lg:p-0'>
                                <BasicButton type='submit'>Save</BasicButton>
                            </div>
                            <Toaster />
                        </form>

                    ) : <Spinner size="lg"/>
            }
        </>
    )
}

export default EditForm;

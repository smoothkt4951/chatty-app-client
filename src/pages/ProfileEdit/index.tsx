import { LazyLoadImage } from 'react-lazy-load-image-component'
import {useDispatch, useSelector} from 'react-redux'

import { RootState } from '../../redux/store'
import PageInfo from '../../components/layout/ContentArea/PageInfo'
import { useEffect, useRef, useState } from 'react'
import { getUser, updateUser, uploadUserImage } from '../../services/userService'
import BasicButton from '../../components/buttons/BasicButton'
import { toast, Toaster } from 'react-hot-toast'
import {updateUserAvatar} from "../../redux/features/userSlice";
import Spinner from "../../components/loading/Spinner";

const ProfileEdit = () => {
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.auth.user);
    const [details, setDetails] = useState<User>();
    const [image, setImage] = useState<any>();
    const [name, setName] = useState<string>('');
    const inputRef = useRef<any>(null);
    const [isPending, setIsPending] = useState<boolean>(false);

    useEffect(() => {
        setIsPending(true);

        const fetchUser = async () => {
            const result = await getUser(user?.id!);
            setDetails(result.user);
            setIsPending(false);
        };

        fetchUser();

    }, [user?.id]);

    const handleAvatarChange = (newAvatarUrl: string) => {
        dispatch(updateUserAvatar(newAvatarUrl));
    };

    const handleSubmit = async (e: any) => {
        setIsPending(true);
        e.preventDefault();

        const username = e.target.username.value;
        const about = e.target.about.value;
        
        if (!username) return;
        if (image) {
            const secureUrl = await uploadUserImage(image);
            var { statusCode, message } = await updateUser(user?.id!, { username, about, image: secureUrl });
        } else {
            var { statusCode, message } = await updateUser(user?.id!, { username, about });
        }

        if (statusCode === '200') {
            handleAvatarChange(image);
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
        return toast.error(message, {
            duration: 3000,
            position: 'bottom-center',
            style: {
                backgroundColor: '#353535',
                color: '#fff'
            }
        });
    };

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleChange = (e: any) => {
        const imageFile = e.target.files[0];
        setName(imageFile.name);

        if (imageFile && FileReader) {
            const fr = new FileReader();
            fr.onload = () => {
                setImage(fr.result)
            }
            fr.readAsDataURL(imageFile);
        }
    };

    return (
        <section>
            <PageInfo isChannel={false} name='Edit Profile' />
            {
                !isPending
                    ? (
                        <form className='w-full flex flex-col items-center justify-around py-5' onSubmit={handleSubmit} action='POST'>
                            <div className='flex md:flex-row flex-col'>
                                <LazyLoadImage
                                    className='rounded-full w-52 h-52 object-cover cursor-pointer'
                                    onClick={handleClick}
                                    src={image ? image : details?.image}
                                    alt='user'
                                    effect='blur'
                                />
                                <div className='md:pl-5 flex flex-col justify-center md:mt-0 mt-5'>
                                    <p className='md:text-start text-center'>{name ? name.slice(0, 20) + '...' : 'No image selected.'}</p>
                                    <button
                                        className='dark:bg-neutral-800 bg-neutral-200 p-3 w-full mt-3 rounded-md hover:bg-neutral-600 duration-200'
                                        onClick={handleClick}
                                        type='button'
                                    >
                                        Change Image
                                    </button>
                                </div>
                                <input onChange={handleChange} ref={inputRef} type="file" name="image" hidden accept='image/png, image/jpeg' />
                            </div>
                            <div className='mt-10 flex flex-col md:w-[400px]'>
                                <label className='text-xl font-semibold' htmlFor="username">Username:</label>
                                <input
                                    minLength={5}
                                    maxLength={20}
                                    placeholder='Username'
                                    className='dark:bg-neutral-900 bg-neutral-100 text-black dark:text-white outline-none rounded-md p-2'
                                    type="text"
                                    name='username'
                                    defaultValue={details?.username}
                                />
                                <label className='text-xl font-semibold mt-5' htmlFor="about">About:</label>
                                <textarea
                                    spellCheck={false}
                                    maxLength={250}
                                    placeholder='Write about yourself...'
                                    className='dark:bg-neutral-900 bg-neutral-100 text-black dark:text-white outline-none rounded-md p-2 mb-5 resize-none'
                                    name="about"
                                    cols={30}
                                    rows={10}
                                    defaultValue={details?.about}
                                ></textarea>
                                <BasicButton type='submit'>Save</BasicButton>
                            </div>
                        </form>
                    ) : <Spinner size='lg' />

            }
            <Toaster />
        </section>
    )
}

export default ProfileEdit

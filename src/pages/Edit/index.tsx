import { useLocation } from 'react-router-dom';
import PageInfo from '../../components/layout/ContentArea/PageInfo';
import EditForm from './components/EditForm';
import { useEffect, useState } from 'react';
import { getChannel } from '../../services/channelService';
import Spinner from "../../components/loading/Spinner";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

const Create = () => {
    const { state } = useLocation();
    const [channel, setChannel] = useState<Channel>();
    const [participants, setParticipants] = useState<string[]>([]);
    const [admins, setAdmins] = useState<string[]>([]);
    const [image, setImage] = useState();
    const [isPending, setIsPending] = useState<boolean>(false);
    const { refresh } = useSelector((state: RootState) => state.channel);

    useEffect(() => {
        setIsPending(true);
        const fetchChannel = async () => {
            const result = await getChannel(state.channelId);
            setImage(result.channel.image);
            setChannel(result.channel);
            setAdmins(result.channel.admins)
            setParticipants(result.participants);
            setIsPending(false);
        }

        fetchChannel();
    }, [state, refresh]);

    return (
        <>
            {
                !isPending
                    ? (
                        <section>
                            <PageInfo isChannel={false} name='Edit Channel' />
                            <EditForm
                                channel={channel!}
                                participants={participants}
                                setParticipants={setParticipants}
                                admins={admins}
                                setAdmins={setAdmins}
                                image={image}
                                setImage={setImage}
                            />
                        </section>
                    ) : <Spinner size='lg' />
            }
        </>
    )
}

export default Create;

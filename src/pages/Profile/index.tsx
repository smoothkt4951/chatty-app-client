import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageInfo from "../../components/layout/ContentArea/PageInfo";
import { getUser } from "../../services/userService";
import Info from "./components/Info";
import Tabs from "./components/Tabs";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

const Profile = () => {
    const location = useLocation();
    const [profileInfo, setProfileInfo] = useState<User>();
    const loggedUser = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        const fetchDetails = async () => {
            const result = await getUser(location.state.userId);
            setProfileInfo(result.user);
        }
        fetchDetails();
    }, [location.state.userId]);

    return (
        <section>
            <PageInfo
                isChannel={false}
                name={`${loggedUser ? loggedUser?.username : profileInfo?.username}'s Profile`}
            />
            <Info details={profileInfo!} />
            <Tabs profileId={location.state.userId} />
        </section>
    )
}

export default Profile;

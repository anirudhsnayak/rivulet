import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../stores/store";

//TODO: add an are you sure on this page
export function Invite() {
    const { inviteId } = useParams();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => state.RivuletState.loggedIn); // Adjust based on your state structure

    useEffect(() => {
        if (inviteId) {
            sessionStorage.setItem('pendingInvite', inviteId);
        }
        if (isLoggedIn) {
            navigate('/app');
        } else {
            navigate('/login');
        }
    }, [inviteId, isLoggedIn, navigate]);

    return null;
}
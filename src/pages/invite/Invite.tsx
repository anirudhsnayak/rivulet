import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../stores/store";
import { setPendingInvite } from "../../stores/slices/RivuletSlice";

export function Invite() {
    const { inviteId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => state.RivuletState.loggedIn);

    useEffect(() => {
        if (inviteId) {
            dispatch(setPendingInvite(inviteId));
        }
        if (isLoggedIn) {
            navigate('/app');
        } else {
            navigate('/login');
        }
    }, [inviteId, isLoggedIn, dispatch, navigate]);

    return null;
}
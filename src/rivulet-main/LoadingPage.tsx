import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAppLoaded } from '../core/stores/RivuletState';
import { updateUserModel } from '../core/server-interface/UserModelLoader';

function LoadingPage() {
    const dispatch = useDispatch()
    useEffect(()=>{
        updateUserModel()
        setTimeout(() => {
            dispatch(setAppLoaded(true));
        }, 2000);
    });
    return (
        <div className="loading-page">
            <h1>Loading...</h1>
            <p>Please wait while we load the application.</p>
            <div className="spinner"></div>
        </div>
    );
}

export { LoadingPage };
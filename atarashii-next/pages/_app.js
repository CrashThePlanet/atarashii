import '../styles/globals.css'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import Searchbar from './../components/searchbar';
import AppContext from './../miscellaneous/appContext';
import Alert from './../components/alert';
import Fab from './../components/fab';
import ShortcutDialog from './../components/newShortcutDialog';
import EnterCodeDialog from './../components/enterCodeDialog';
import SettingsSpeedDial from './../components/speedDial';

import { CookiesProvider, useCookies } from 'react-cookie';

import { faPlus, faEllipsisVertical, faQrcode } from '@fortawesome/free-solid-svg-icons';

import React from 'react';

import { useRouter } from 'next/router'; 

function MyApp({ Component, pageProps }) {
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertData, setAlertData] = React.useState({});
    const [DialogIsOpen, setDialogIsOpen] = React.useState(false);
    const [enterDialogOpen, setEnterDialogOpen] = React.useState(false);
    const [cookies, setCookie] = useCookies(['token']);
    const router = useRouter();
    let usableRouter = undefined;

    const specialRoutes = [
        '/',
        '/folder/[folderPath]'
    ]
    const speedDialElements = [
        {title: 'create Shortcut', icon: faPlus, onClick: () => {setDialogIsOpen(true);}},
        {title: 'enter code', icon: faQrcode, onClick: () => {setEnterDialogOpen(true);}}
    ]

    React.useEffect(() => {
        if (!router.isReady) return;
        usableRouter = router;
    }, [router.isReady])

    function openAlert(data) {
        setAlertData(data);
        setAlertOpen(true);
    }
    function closeAlert() {
        setAlertOpen(false);
        setAlertData({});
    }

    return (
        <AppContext.Provider
            value={{
                openAlert : openAlert,
                token: cookies.token,
                router: usableRouter,
                updateToken: (token) => setCookie('token', token, {
                    path: "/",
                    secure: true,
                    maxAge: 2592000
                })
            }}
        >   
            <CookiesProvider>
                {specialRoutes.includes(router.pathname) ? (
                    <div className="h-screen">
                        <div className="searchbarWrapper grid place-items-center h-2/6 w-full">
                            <Searchbar/>
                        </div>
                        <div className="contentWrapper h-3/6">
                            <Component {...pageProps} />
                        </div>
                        <div className="absolute top-2 right-2 flex flex-row">
                            <SettingsSpeedDial actions={speedDialElements} />
                        </div>
                    </div>
                ) : (
                    <Component {...pageProps} />
                    )}
                <Alert data={alertData} closeAlert={() => closeAlert()} open={alertOpen} />
                {DialogIsOpen && (<ShortcutDialog closeDialog={() => setDialogIsOpen(false)} />)}
                {enterDialogOpen && <EnterCodeDialog closeDialog={() => setEnterDialogOpen(false)} /> }
            </CookiesProvider>
        </AppContext.Provider>
    );
}

export default MyApp

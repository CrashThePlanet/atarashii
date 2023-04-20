import {
    Grid
} from '@mui/material';

import Search from '@/components/Search';

export default function CardsLayout({children}: any) {
    return (
        <Grid 
            container
            sx={{
                height: "calc(100vh - 64px)"
            }}
        >
            <Grid 
                item
                xs={12}
                sx={{
                display: "grid",
                placeItems: "center"
                }}
            >
                <Search />
            </Grid>
            {children}
        </Grid>
    )
}
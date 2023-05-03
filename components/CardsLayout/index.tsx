import {
    Grid
} from '@mui/material';

import Search from '@/components/Search';

export default function CardsLayout({children}: any) {
    return (
        <Grid 
            container
            sx={{
                minHeight: "calc(100vh - 64px)",
                height: "min-content",
                placeItems: "flex-start"
            }}
        >
            <Grid 
                item
                xs={12}
                sx={{
                    display: "grid",
                    placeItems: "center",
                    height: "300px"
                }}
            >
                <Search />
            </Grid>
            <Grid
                item={true}
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                    rowGap: "20px"
                }}
            >
                {children}
            </Grid>
        </Grid>
    )
}
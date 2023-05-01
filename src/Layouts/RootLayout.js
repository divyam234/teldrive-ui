import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import NavDrawer from "@/components/Drawer";
import Header from "@/components/Header";
import { useSession } from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import dynamic from "next/dynamic";

const drawerWidth = 250;

const ChonkywithStore = dynamic(() => import("@bhunter179/chonky")
    .then((mod) => mod.ChonkywithStore), {
    ssr: false,
    loading: () => <Loader />
});

const RootLayout = ({ children }) => {

    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const { session } = useSession();
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <ChonkywithStore>
            <Box sx={{ display: 'flex', minHeight: 'cal(100vh-3px)' }}>
                {session && (
                    <Box
                        component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                        {isSmUp ? null : (
                            <NavDrawer
                                PaperProps={{ style: { width: drawerWidth }, sx: { bgcolor: 'background.default' } }}
                                variant="temporary"
                                open={mobileOpen}
                                onClose={handleDrawerToggle}
                                sx={{ background: "palette.background.default" }}
                            />
                        )}
                        <NavDrawer
                            PaperProps={{ style: { width: drawerWidth }, sx: { bgcolor: 'background.default' } }}
                            sx={{ display: { md: 'block', sm: 'none', xs: 'none' } }}
                        />
                    </Box>
                )}

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Header session={session} onDrawerToggle={handleDrawerToggle} />
                    <Container maxWidth="xl" sx={{ py: 2, flex: 1 }}>
                        {children}
                    </Container>
                </Box>
            </Box>
        </ChonkywithStore>
    );
}

export default RootLayout;
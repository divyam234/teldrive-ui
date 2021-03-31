import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import NavDrawer from "@/components/Drawer";
import Header from "@/components/Header";
import { QueryBoundaries } from "@/components/QueryBoundaries";
import { useRouter } from "next/router";
import { allowedPaths } from "@/utils/common";

const drawerWidth = 250;


const RootLayout = ({ children }) => {

    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();
    const { pathname } = router


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <Box sx={{ display: 'flex', minHeight: 'cal(100vh-3px)' }}>
            {allowedPaths.find((path) => path === pathname) && (
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
                <Header onDrawerToggle={handleDrawerToggle} />
                <Container maxWidth="xl" sx={{ py: 2, flex: 1 }}>
                    <QueryBoundaries>
                        {children}
                    </QueryBoundaries>
                </Container>
            </Box>
        </Box>
    );
}

export default RootLayout;
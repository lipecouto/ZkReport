import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import {
    Avatar,
    Box,
    Button,
    Grid,
    Menu,
    MenuItem,
    IconButton,
    Toolbar,     
    Tooltip,
    Typography,
    Container
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogoSection from '../Logo';
import SideDrawer from '../SideMenu';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const navBarTheme = createTheme({
    palette: {
        zkgreen:{
            main: '#7ac142',
            contrastText: '#fff',
        } 
        
    }
})

function NavBar() {

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={navBarTheme}>
        <AppBar position="static" color='zkgreen'>
        <Container maxWidth="xl">
            <Toolbar disableGutters>
            <Grid sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <LogoSection />                
            </Grid>
            <SideDrawer />
            <Box sx={{ flexGrow: 0 }}>
            
                <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
                </Tooltip>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                    {settings.map((setting) => (
                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                        </MenuItem>
                    ))}
                </Menu>               
            </Box>
            </Toolbar>
        </Container>
        </AppBar>
       
    </ThemeProvider>
  );
}

export default NavBar;
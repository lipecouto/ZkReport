import * as React from 'react';
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function SideDrawer() {

  const navigate = useNavigate();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleClick = (el) => {
        if(el === 'Personalizar'){
            navigate('/builder');
        }
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Personalizar', 'Favoritos', 'Relatório X', 'Relatório Y'].map((text, index) => (
            <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => handleClick(text)} id={text}>
                    <ListItemIcon id={text}>
                        {index === 0 ? < EditIcon id={text}/> : index === 1 ? < BookmarkIcon id={text}/> : <InsertDriveFileIcon  id={text}/>}
                    </ListItemIcon>
                    <ListItemText primary={text} id={text}/>
                </ListItemButton>
            </ListItem>
        ))}
      </List>       
    </Box>
  );

  return (
    <div>      
        <React.Fragment key={'left'}>
            <Button onClick={toggleDrawer('left', true)}><FormatListBulletedIcon sx={{ color: 'white' }} /></Button>
            <SwipeableDrawer
                anchor={'left'}
                open={state['left']}
                onClose={toggleDrawer('left', false)}
                onOpen={toggleDrawer('left', true)}
            >
            {list('left')}
            </SwipeableDrawer>
        </React.Fragment>
      
    </div>
  );
}
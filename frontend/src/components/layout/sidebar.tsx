import { useState } from "react";

import "../../App.css";

import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import Psychology from "@mui/icons-material/Psychology";
import Language from "@mui/icons-material/Language";
import Chalet from "@mui/icons-material/Chalet";
import Settings from "@mui/icons-material/Settings";
import AccountBalance from "@mui/icons-material/AccountBalance";
import HikingIcon from "@mui/icons-material/Hiking";

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  //sidebarOpen: () => void;
  sidebarOpen: boolean
}


export default function Sidebar(props: Props)
{
    //const { window } = props;
    const [open, setOpen] = useState(props.sidebarOpen);

    const handleDrawerToggle = () => {
      setOpen((prevState) => !prevState);
    };

    let navigate = useNavigate();
    const menuItems = [
        {
          text: "Memories of Yesterday",
          icon: <Chalet color="secondary" />,
          path: "/",
        },
        {
          text: "What's Going Through Your Mind",
          icon: <AddCircleOutlineOutlined color="secondary" />,
          path: "/add-thought",
        },
        {
          text: "Short Term Memory",
          icon: <AccountBalance color="secondary" />,
          path: "/recent-thoughts",
        },
        {
          text: "Thought Closet",
          icon: <Psychology color="secondary" />,
          path: "/organize-thoughts",
        },
        {
          text: "Outdoor Adventures",
          icon: <HikingIcon color="secondary" />,
          path: "/outdoor-activity-logs",
        },
        {
          text: "Spanish Words",
          icon: <Language color="secondary" />,
          path: "/words",
        },
    
        {
          text: "Settings",
          icon: <Settings color="secondary" />,
          path: "/settings",
        },
      ];

    return (<>
    <nav>
        
     <Drawer
            className="drawer"
          variant="temporary"  
          open={open}
          onClose={handleDrawerToggle}
            anchor="left"
            classes={{ paper: "drawer" }}
           
          > <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' }, marginRight: "15px" }}
        >
          Bucket Of Thoughts <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2,}}
            onClick={handleDrawerToggle}
          >
            <CloseIcon />
          </IconButton> 
        </Typography> 
          
          {/* */}
          <Divider />
            <List>
              {menuItems.map((item) => (
                <ListItem 
                  key={item.text}
                  onClick={() => navigate(item.path)}
                //   className={
                //     location.pathname === item.path ? "active-drawer" : null
                //   }
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Drawer></nav>
          </>)
}
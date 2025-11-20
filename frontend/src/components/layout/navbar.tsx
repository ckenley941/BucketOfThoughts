import "../../App.css";

import {useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import Search from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import MenuIcon from '@mui/icons-material/Menu'; 
import Sidebar from "./sidebar";


export default function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    console.log(sidebarOpen);
    let navigate = useNavigate();
    let location = useLocation();  

    const handleAddThought = () => {
        navigate("add-thought");
      }

      const handleDrawerToggle = () => {
        setSidebarOpen((prevState) => !prevState);
    };
      
    
      const handleGlobalSearch = () => {
        navigate("organize-thoughts"); //TODO figure out how to handle already being on the page
      }
    return (
      <Box sx={{ flexGrow: 1 }}>
        {/* <Grid container> */}
          {/* <Grid.Row className="no-margin"> */}
            {/* <Navbar></Navbar> */}
            <AppBar
              position="fixed"
              className="appBar"
              elevation={0}
              color="primary"
            >
              <Toolbar>
              <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          {sidebarOpen && <Sidebar sidebarOpen={true}></Sidebar>}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, marginRight: "15px" }}
          >
            Bucket Of Thoughts
          </Typography>
            
                {/* <Grid.Col xs={3}> */}
                 
                {/* </Grid.Col> */}
                {/* <Grid.Col xs={6}> */}
                  <FormControl sx={{ width: "12%" }}>
                    <Select
                      labelId="global-search-select-label"
                      id="global-search-select"
                      name="globalSearchSelect"
                      variant="filled"
                      value={1}
                      sx={{ color: "white", textAlign: "left", background:"blue" }}
                    >
                      <MenuItem key={1} value={1}>
                        All
                      </MenuItem>
                      <MenuItem key={2} value={2}>
                        Thought
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    sx={{ width: "58%", input: { color: "white" }, label: {color: "white"} }}
                    name="global-search"
                    label="Search Thoughts"
                    variant="filled"
                    //onChange={props.globalSearchChange}
                  />
                  <IconButton color="secondary" aria-label="Search">
                    <Tooltip title="Search">
                      <Search sx={{ marginTop:"10px"}} onClick={handleGlobalSearch}></Search>
                    </Tooltip>
                  </IconButton>
                  <IconButton color="secondary" aria-label="Add" onClick={handleAddThought}>
                    <Tooltip title="Add Thought">
                      <AddCircleOutlineOutlined sx={{ marginTop:"10px"}}></AddCircleOutlineOutlined>
                    </Tooltip>
                  </IconButton>
                {/* </Grid.Col> */}
              </Toolbar>
            </AppBar>
          {/* </Grid.Row> */}
          {/* <Grid.Row className="no-margin"> */}
           
           {/* </Grid.Row> */}
         {/* </Grid> */}
        <div className="page">
          {/* <div className="toolBar">{props.children}</div> */}
        </div>
      </Box>
    )
};
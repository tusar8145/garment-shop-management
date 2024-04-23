

import { Avatar, Hidden, Icon, IconButton, MenuItem, useMediaQuery } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { MatxMenu, MatxSearchBox } from 'app/components';
import { themeShadows } from 'app/components/MatxTheme/themeColors';
import { NotificationProvider } from 'app/contexts/NotificationContext';
import { AuthProvider } from 'app/contexts/JWTAuthContext';

import useAuth from 'app/hooks/useAuth';

import useSettings from 'app/hooks/useSettings';
import { topBarHeight } from 'app/utils/constant';
import axios from "axios";
import React, { useEffect } from 'react';
import Select from 'react-select';
import { Span } from '../../../components/Typography';
import NotificationBar from '../../NotificationBar/NotificationBar';


const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const TopbarRoot = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 96,
  transition: 'all 0.3s ease',
  boxShadow: themeShadows[8],
  height: topBarHeight,
}));

const filterItemsequal = (arr, field, value) => { try { if (field != null) { return arr.filter((item) => { return item[field] == value }) } } catch (error) { console.error(error); } }


const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: '8px',
  paddingLeft: 18,
  paddingRight: 20,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.primary.main,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: 14,
    paddingRight: 16,
  },
}));

const UserMenu = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  borderRadius: 24,
  padding: 4,
  '& span': { margin: '0 8px' },
}));

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: 185,
  '& a': {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  '& span': { marginRight: '10px', color: theme.palette.text.primary },
}));

const IconBox = styled('div')(({ theme }) => ({
  display: 'inherit',
  [theme.breakpoints.down('md')]: { display: 'none !important' },
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { logout, user } = useAuth();






  // const my_ = [];
  // const branchs_id = [];
  // json.map((temp) => {
  //   branchs_id.push(temp.branch_id)
  //   return my_.push({ value: temp.branch_id, label: temp.branch });
  // });
  // const options = my_



  const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } },
    });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === 'close' ? 'mobile' : 'close';
    } else {
      mode = layout1Settings.leftSidebar.mode === 'full' ? 'close' : 'full';
    }
    updateSidebarMode({ mode });
  };





  // var filter = filterItemsequal(options, 'value', parseInt(user.branch_id));
  // console.log(filter);

  const [checked, setChecked] = React.useState(true);
  const [allaccess_txt, setallaccess_txt] = React.useState(0);

  const handleChangeb = (event) => {
    const all_access = localStorage.getItem('all_access');
    if (all_access != 1) {
      localStorage.setItem('all_access', '1');
      setallaccess_txt(1)
    } else {
      localStorage.setItem('all_access', '0');
      setallaccess_txt(0)
    }
    console.log(all_access)
  };

  useEffect(() => {
    const all_access = localStorage.getItem('all_access');
    if (all_access != 1) {
      setallaccess_txt(0)
    } else {
      setallaccess_txt(1)
    }
  }, []);

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Icon>menu</Icon>
          </StyledIconButton>

          <IconBox>
  

            &nbsp;


            {/*<FullScreenDialog />*/}

            {user.is_all_branch == 0 && user.is_marchant == 0 &&
              <StyledIconButton disabled>  <Icon color="secondary">insert_chart</Icon>  </StyledIconButton>
            }


          </IconBox>



          &nbsp;&nbsp;



        </Box>

        <Box display="flex" alignItems="center">
 

          {/*<ShoppingCart /> */}

          <MatxMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                  <Span>
                    Hi <strong>{user.name}</strong>
                  </Span>
                </Hidden>
                <Avatar src={user.avatar} sx={{ cursor: 'pointer' }} />
              </UserMenu>
            }
          >

            <StyledItem onClick={logout}>
              <Icon> power_settings_new </Icon>
              <Span> Logout </Span>
            </StyledItem>
          </MatxMenu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default React.memo(Layout1Topbar);

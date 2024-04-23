import { Badge, Button, Card, Drawer, Icon, IconButton, ThemeProvider } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import useNotification from 'app/hooks/useNotification';
import useSettings from 'app/hooks/useSettings';
import { sideNavWidth, topBarHeight } from 'app/utils/constant';
import { getTimeDifference } from 'app/utils/utils.js';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { themeShadows } from '../MatxTheme/themeColors';
import { Paragraph, Small } from '../Typography';
import useAuth from 'app/hooks/useAuth';

const Notification = styled('div')(() => ({
  padding: '16px',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  height: topBarHeight,
  boxShadow: themeShadows[6],
  '& h5': {
    marginLeft: '8px',
    marginTop: 0,
    marginBottom: 0,
    fontWeight: '500',
  },
}));

const NotificationCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&:hover': {
    '& .messageTime': {
      display: 'none',
    },
    '& .deleteButton': {
      opacity: '1',
    },
  },
  '& .messageTime': {
    color: theme.palette.text.secondary,
  },
  '& .icon': { fontSize: '1.25rem' },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  opacity: '0',
  position: 'absolute',
  right: 5,
  marginTop: 9,
  marginRight: '24px',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const CardLeftContent = styled('div')(({ theme }) => ({
  padding: '12px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'rgba(0, 0, 0, 0.01)',
  '& small': {
    fontWeight: '500',
    marginLeft: '16px',
    color: theme.palette.text.secondary,
  },
}));

const Heading = styled('span')(({ theme }) => ({
  fontWeight: '500',
  marginLeft: '16px',
  color: theme.palette.text.secondary,
}));

const NotificationBar = ({ container }) => {
  const { logout, user } = useAuth();
  const { settings } = useSettings();
  const theme = useTheme();
  const secondary = theme.palette.text.secondary;
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [currentNotice, setCurrentNotice] = React.useState(null);
  const { deleteNotification, clearNotifications, notifications, seenNotification, getNotifications } = useNotification();

  console.log("notifications", notifications);

  console.log("user", user);

  // Boolean field to check (e.g., 'status' field)
const booleanField = 'seen';

// Count the number of objects where the boolean field is true
const countNotice =notifications && notifications.reduce((count, obj) => {
  console.log("obj", obj);
  if (obj[booleanField] === 0) {
    return count + 1;
  }
  return count;
}, 0);

  const handleDrawerToggle = () => {
    setPanelOpen(!panelOpen);
    seenNotification()
    getNotifications()
    
  };

  const { palette } = useTheme();
  const textColor = palette.text.primary;

  return (
    <Fragment>
 
    </Fragment>
  );
};

export default NotificationBar;

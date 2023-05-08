
import { Box, Avatar, Typography } from "@mui/material";

const Message = ({ message }) => {
  return (
    <Box sx={{padding:1, display:'flex', alignItems:'center'}}>
      <Avatar sx={{ width: '30px', height: '30px' }} src={message.user.photoURL} alt="User avatar" />
      <Typography sx={{ml:2}}>{message.message}</Typography>
    </Box>
  );
};

export default Message;

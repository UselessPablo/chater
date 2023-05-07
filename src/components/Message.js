
import { Box, Avatar } from "@mui/material";

const Message = ({ message }) => {
  return (
    <Box className="chat__message">
      <Avatar sx={{ width: '30px', height: '30px' }} src={message.user.photoURL} alt="User avatar" />
      <p>{message.message}</p>
    </Box>
  );
};

export default Message;

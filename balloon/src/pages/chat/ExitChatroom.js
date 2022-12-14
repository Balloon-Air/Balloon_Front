import styles from '../../css/chat/Chat.module.css';
import { sendExit } from '../../utils/ChatUtils';
import { onExitRoom, onHCupdate } from '../../context/ChatAxios';
import ChatStomp from './ChatStomp';
import Button from '@mui/material/Button';
import { Box, Modal } from '@mui/material';

const styleBox = {
  position: 'absolute',
  top: '80%',
  left: '97%',
  transform: 'translate(-90%, -90%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  textAlign: 'center',
  padding: 4,
};

export default function ExitChatroom({
  openExitChat,
  setOpenExitChat,
  chatroomId,
  chatroomName,
  headCount,
  empInfo,
  setChatStatus,
}) {
  //모달닫기
  const handleClose = () => setOpenExitChat(false);
  //socket연결
  const client = ChatStomp();

  return (
    <Modal open={openExitChat} close={handleClose}>
      <Box sx={styleBox}>
        <h3 className={styles.inBox}>정말 채팅방을 나가시겠습니까?</h3>
        <div>
          <div>
            <Button
              variant="contained"
              onClick={(e) => {
                const close = () => {
                  e.preventDefault();
                  handleClose();
                };
                return close();
              }}>
              <div>취소</div>
            </Button>{' '}
            <Button
              variant="contained"
              onClick={(e) => {
                const roomDelete = () => {
                  e.preventDefault();
                  onExitRoom(
                    chatroomId,
                    empInfo.empId,
                    sendExit(client, chatroomId, empInfo),
                    onHCupdate(chatroomId, chatroomName, headCount)
                  );
                  setChatStatus('chatEmpList');
                  handleClose();
                };
                return roomDelete();
              }}>
              삭제
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

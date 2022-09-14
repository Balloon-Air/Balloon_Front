import React, { useEffect, useState } from 'react';
import styles from '../../css/Component.module.css';
import { Avatar, Button, Card, Typography } from 'antd';
import { Box, CardContent, Modal } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { uploadProfile } from '../../context/EmployeeAxios';

const style = {
  position: 'absolute',
  marginTop: '1%',
  maxWidth: 'lg',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  margin: '30px 0px 30px 0px',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function UpdateProfileModal({ open, setOpen, empId, photo }) {
  const [file, setFile] = useState('');
  const handleClose = () => setOpen(false);

  const upload = () => {
    console.log('file', file);
    if (file.length !== 0) {
      uploadProfile(file, empId);
    } else {
      alert('사진을 넣어주세요!!');
    }
  };

  const handleFileInput = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    setFile(formData);
  };
  console.log(photo);
  return (
    <div>
      {empId && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box component="form" encType="multipart/form-data" sx={style}>
            <Card>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  color: '#00AAFF',
                  fontFamily: '"Roboto","Helvetica","Arial","sans-serif"',
                  fontSize: '2rem',
                  fontWeight: 100,
                }}>
                <Typography
                  id="modal-modal-title"
                  variant="h4"
                  component="h4"
                  sx={{ mb: 2, mt: 2, color: '#00AAFF' }}>
                  <AddPhotoAlternateIcon className={styles.icon} />
                  <span>사진 수정</span>
                  <hr />
                </Typography>
              </div>
              <CardContent
                sx={{
                  margin: '15px',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}>
                {!!photo ? (
                  <div>
                    <Avatar
                      style={{
                        margin: '10px 10px 20px 10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        // textAlign: 'center',
                        borderRadius: '100px',
                      }}
                      size={100}
                      src={
                        <img
                          src={`${photo}`}
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '100px',
                          }}
                        />
                      }
                    />
                    <p>사진을 변경해주세요</p>
                  </div>
                ) : (
                  <div>
                    <Avatar
                      style={{
                        margin: '10px 10px 20px 10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        // textAlign: 'center',
                        // background: '#bdbdbd',
                        // color: '#fff',
                      }}
                      src={
                        <img
                          src={`${process.env.PUBLIC_URL}/asset/none_profile.png`}
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '100px',
                          }}
                        />
                      }
                    />
                    <p>사진을 추가해주세요</p>
                  </div>
                )}
              </CardContent>

              <div>
                <input
                  id="getFile"
                  type="file"
                  onChange={handleFileInput}
                  accept="image/*"
                />
                <Button
                  onClick={handleClose}
                  sx={{ fontSize: 30, mr: 3, border: 1, mt: 1 }}>
                  취소
                </Button>
                <Button
                  // type="submit"
                  onClick={() => upload()}
                  sx={{ fontSize: 30, border: 1, mt: 1 }}>
                  수정
                </Button>
              </div>
            </Card>
          </Box>
        </Modal>
      )}
    </div>
  );
}

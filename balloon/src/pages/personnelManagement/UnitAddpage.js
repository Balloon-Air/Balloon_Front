import React, { forwardRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { findHigherOrganization, insertUnit } from '../../context/UnitAxios';
import styles from './unit.module.css';
import { Container, Button, Typography, Box, Modal } from '@mui/material';

const Select = forwardRef(({ onChange, name, label, higher }, ref) => (
  <div>
    <label className={styles.label}>{label}</label>
    <select className={styles.input} name={name} ref={ref} onChange={onChange}>
      {higher.length !== 0 &&
        higher.map((data, index) => (
          <option key={index} value={data.unitCode}>
            {data.unitName + ' (' + data.unitCode + ')'}
          </option>
        ))}
    </select>
  </div>
));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

function UnitAddpage({ openInsert, setOpenInsert }) {
  const [higher, setHigher] = useState([]);

  const {
    register,
    // watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleClose = () => {
    setOpenInsert(false);
  };

  const onSubmit = (value) => {
    const parentUnit = value.parentUnit ? value.parentUnit : '00000000';
    const priors = higher.filter((high) => high.unitCode === parentUnit);

    const unitInfo = {
      unitName: value.unitName,
      bell: value.bell,
      prior: priors[0].prior + 1,
      parentUnit: { unitCode: parentUnit },
    };

    insertUnit(unitInfo);

    handleClose();

    window.location.href = '/management/unit';
  };

  useEffect(() => {
    higher.length === 0 && findHigherOrganization(setHigher);
  }, [higher.length]);

  return (
    <Modal
      open={openInsert}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Container component="main" sx={{ marginBottom: 25 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={style}>
          {/* <Box
        sx={{
          marginTop: 9,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}> */}
          <Typography component="h1" variant="h5">
            ????????????
          </Typography>

          <label className={styles.label}>????????????</label>
          <input
            className={styles.input}
            {...register('unitName', { required: true, maxLength: 10 })}
          />
          {errors.unitName &&
            errors.unitName.type === 'required' &&
            alert('???????????? ??????????????????.')}
          {errors.unitName &&
            errors.unitName.type === 'maxLength' &&
            alert('?????? ?????? ?????? ???????????????.')}
          <label className={styles.label}>?????? ????????????</label>
          <input
            className={styles.input}
            {...register('bell', {
              required: true,
              maxLength: 15,
              pattern: /^\d{3}-\d{3}-\d{4}$/,
            })}
          />
          {errors.bell &&
            errors.bell.type === 'required' &&
            alert('?????? ??????????????? ??????????????????.')}
          {errors.bell &&
            errors.bell.type === 'maxLength' &&
            alert('?????? ?????? ?????? ???????????????.')}
          {errors.bell &&
            errors.bell.type === 'pattern' &&
            alert('???????????? ????????? ?????? ????????????.(XXX-XXX-XXXX)')}
          <Select
            label="????????????"
            {...register('parentUnit')}
            higher={higher}
          />
          <input className={styles.submit} type="submit" value="??????" />
          <Button onClick={handleClose}> ?????? </Button>
        </Box>
      </Container>
    </Modal>
  );
}

export default UnitAddpage;

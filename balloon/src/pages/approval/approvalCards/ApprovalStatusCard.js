import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

export const StatusCard = ({ status, count, link }) => (
  <Link to={link}>
    <CardActionArea
      sx={{
        height: 200,
        display: 'flex',
        justifyContent: 'space-around',
      }}>
      <Card
        variant="outlined"
        sx={{ minWidth: 250, height: 200 }}
        style={{ backgroundColor: '#F1F9FF' }}>
        <React.Fragment>
          <CardContent>
            <Typography
              sx={{ fontSize: 25 }}
              color="#00AAFF"
              gutterBottom
              textAlign="center">
              {status}
            </Typography>
            <hr />
            <br />
            <Typography
              sx={{ fontSize: 20 }}
              variant="h5"
              component="div"
              textAlign="center">
              {count}
            </Typography>
          </CardContent>
        </React.Fragment>
      </Card>
    </CardActionArea>
  </Link>
);
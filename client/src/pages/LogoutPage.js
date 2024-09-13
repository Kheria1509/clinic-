import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authStores from '../stores/authStores';
import { Grid, Typography, Box } from '@mui/material';

export default function LogoutPage() {
    const store = authStores();
    const navigate = useNavigate();

    useEffect(() => {
        store.logout();
        returnToLogin();
    }, []);

    const returnToLogin = async () => {
        await new Promise(r => setTimeout(r, 2000));
        navigate("/login");
    };

    return (
        <Grid
            container
            className="Logout-container"
        >
            <Grid item xs={12} md={4}>
                <Box className="Logout-box">
                    <Typography variant="h4" className="Logout-title">
                        You have been logged out.
                    </Typography>
                    <Typography variant="body1" className="Logout-message">
                        Redirecting you to the login page...
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
}

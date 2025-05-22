import { Box, Typography } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import PrivacyIcon from '../../Icons/PrivacyIcon'

const Component = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    
    background-color:rgb(249, 244, 249);

`

const Component1 = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 500px;
    
    gap: 30px;
    
    

`
const Component2 = styled(Box)`
    margin-top: 80px;
    display: flex;
    gap: 10px;
`

const DownloadChat = () => {
    return (
        <Component>
            <Component1>
                <img src='https://static.whatsapp.net/rsrc.php/v4/y6/r/wa669aeJeom.png' alt="no image found" width={300} />
                <Typography sx={{ fontSize: '2.3rem' }}>Download WhatsApp for Windows</Typography>
                <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                    <Typography sx={{ fontSize:'0.9rem', color: '#7f7e7d' }}>Make calls, share your screen and get a faster experience when you download the </Typography>
                    <Typography sx={{ fontSize:'0.9rem', color: '#7f7e7d' }}>Windows app.</Typography>
                </Box>

            </Component1>
            <Component2>
                <PrivacyIcon size={20} color='#7f7e7d' />
                <Typography sx={{ fontSize:'0.9rem', color: '#7f7e7d' }} >Your personal messages are end-to-end encrypted</Typography>
            </Component2>
        </Component>
    )
}

export default DownloadChat

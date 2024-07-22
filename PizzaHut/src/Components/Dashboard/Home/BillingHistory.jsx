import React from 'react'
import { Box, Modal, Typography } from '@mui/material';
import './billingHistory.css'
import CloseIcon from '@mui/icons-material/Close';

function BillingHistory({ billHistoryOpen, billHistoryDetails }) {
    return (
        <div>
            <Modal open={billHistoryOpen} >
                <Box className='openBillHisttoryModal'>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Billing History

                        <button className='billingHistoryCloseButton' onClick={billHistoryDetails}><CloseIcon /></button>
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        <div>
                            <button>All Bills</button>
                            <button>todays bills</button>
                            <button>Filter by date</button>
                            <button>search Customer</button>
                        </div>

                    </Typography>


                </Box>
            </Modal>

        </div>
    )
}

export default BillingHistory

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
} from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';
import EditBillDialog from './EditBillDialog'; // Import the newly created dialog component

const BillList = ({ triggerMessage }) => {
    const [bills, setBills] = useState([]);
    const [editingBill, setEditingBill] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await axios.get('http://localhost:4000/billings/allbills');
                if (response.status === 200) {
                    setBills(response.data);
                } else {
                    triggerMessage('Error while fetching bills', 'error');
                }
            } catch (error) {
                console.error('Error fetching bills:', error);
                triggerMessage('Error while fetching bills', 'error');
            }
        };
        fetchBills();
    }, []);

    const handleEditClick = (bill) => {
        setEditingBill(bill);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveChanges = () => {
        // Handle save changes logic here
        // You can update state or perform API call here
        setOpenDialog(false);
        setEditingBill(null);
        triggerMessage('Bill updated successfully', 'success');
    };

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>Payment Mode</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bills.length > 0 ? (
                        bills.map((bill) => (
                            <TableRow key={bill._id}>
                                <TableCell>{bill.customerId.name}</TableCell>
                                <TableCell>{bill.customerId.contactNumber}</TableCell>
                                <TableCell>{new Date(bill.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{bill.totalAmount}</TableCell>
                                <TableCell>{bill.paymentMode}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEditClick(bill)}>
                                        <EditIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                No bills found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Edit Dialog */}
            <EditBillDialog
                open={openDialog}
                onClose={handleCloseDialog}
                bill={editingBill}
                onSave={handleSaveChanges}
                triggerMessage={triggerMessage}
            />
        </>
    );
};

export default BillList;

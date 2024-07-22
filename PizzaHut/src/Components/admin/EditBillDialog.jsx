import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';

const EditBillDialog = ({ open, onClose, bill, onSave, triggerMessage }) => {
    const [editingBill, setEditingBill] = useState(bill);

    const handleProductQuantityChange = (productId, quantity) => {
        const updatedProducts = editingBill.products.map((product) => {
            if (product.productId === productId) {
                return {
                    ...product,
                    quantity: quantity,
                };
            }
            return product;
        });
        setEditingBill({
            ...editingBill,
            products: updatedProducts,
        });
    };

    const handleSaveChanges = async () => {
        try {
            // Perform your update API call here
            // Example:
            // await axios.put(`http://localhost:4000/billings/${editingBill._id}`, editingBill);

            onClose();
            onSave(); // You may want to pass the updated bill back to parent for refreshing
            triggerMessage('Bill updated successfully', 'success');
        } catch (error) {
            console.error('Error updating bill:', error);
            triggerMessage('Error updating bill', 'error');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Bill</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    {/* Render fields for editing */}
                    {/* Example fields */}
                    <Grid item xs={3}>
                        <TextField margin="dense" label="Customer" fullWidth defaultValue={bill?.customerId.name}

                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField margin="dense" label="Contact Number" fullWidth defaultValue={bill?.customerId.contactNumber}

                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField margin="dense" label="Tax" fullWidth defaultValue={bill?.tax}

                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField margin="dense" label="Grand Total" fullWidth defaultValue={bill?.totalWithTax}

                        />
                    </Grid>
                    {bill?.items.map((product) => (
                        <Grid item xs={3} key={product.productId}>
                            <FormControl fullWidth>
                                <TextField
                                    label={product.name}
                                    defaultValue={product.quantity}
                                    onChange={(e) => handleProductQuantityChange(product.productId, e.target.value)}
                                />

                            </FormControl>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSaveChanges} color="primary">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditBillDialog;

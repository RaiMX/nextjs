import React from 'react';

/** MATERIAL */
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

export default function SimpleDialog({open, children, title, actions, onClose, maxWidth}) {

    const [open_dialog, setOpenDialog] = React.useState(open);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        onClose(true);
    }

    React.useEffect(() => {
        setOpenDialog(open);
    }, [open])

    return (
        <React.Fragment>
            <Dialog
                fullWidth
                maxWidth={maxWidth || 'xl'}
                onClose={handleCloseDialog}
                aria-labelledby="simple-dialog-title2"
                open={open_dialog}
                PaperProps={{style: {overflowY: 'visible'}}}
            >
                <DialogTitle id="simple-dialog-title2">{title}</DialogTitle>
                <DialogContent style={{overflowY: 'visible'}}>
                    {children}
                </DialogContent>
                <DialogActions>
                    {actions}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

import React from 'react';

/** THIRD PARTY */
import { observer } from "mobx-react-lite";
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';

/** HOOKS */
import { useStore } from 'store/store_provider'

/** UTILS */
import api from "utils/axios";

/** COMPONENTS */
import { AppContext } from 'providers/app_provider';

/** MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField, Button } from '@material-ui/core'



const useStyles = makeStyles((theme) => ({
	root: {},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}))

const Profile = observer(function Profile() {
	const classes = useStyles();
	const store = useStore();

	const { app_conf, user_info } = React.useContext(AppContext);

	const [user, setUser] = React.useState();
	const [new_password, setNewPassword] = React.useState();
	const [new_password2, setNewPassword2] = React.useState();


	const handleChangePassword = (e) => {
		e.preventDefault();

		api.post('/auth/change-password', {
			email: user.email,
			password: new_password
		}).then(response => {
			toast.success('Пароль успешно изменен!');
			setNewPassword(null);
			setNewPassword2(null);
		}).catch(error => {
			toast.error('Ошибка при изменении пароля!');
		})
	}

	React.useEffect(() => {
		if (user_info.user) {
			api.get(`/users/${user_info.user.id}/profile`)
				.then(response => {
					setUser(response.data)
				})
		}

	}, [])

	return user ? (
		<Grid
			container
			direction="row"
			justify="center"
			alignItems="flex-start"
			spacing={2}
		>
			<Grid item xs={12} md={8}>
				<Typography>{user.id}</Typography>
				<Typography>{user.username}</Typography>
			</Grid>
			<Grid item xs={12} md={8}>
				<Typography><FormattedMessage defaultMessage="Изменить пароль" /></Typography>
				<form className={classes.form} noValidate onSubmit={handleChangePassword}>
					<TextField
						type={'password'}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="new_password"
						label={<FormattedMessage defaultMessage={'Новый пароль'} />}
						name="new_password"
						autoFocus
						value={new_password || ''}
						onChange={e => setNewPassword(e.target.value)}
					/>
					<TextField
						type={'password'}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="new_password2"
						label={<FormattedMessage defaultMessage={'Повторите пароль'} />}
						name="new_password2"
						value={new_password2 || ''}
						error={new_password !== new_password2}
						helperText={new_password !== new_password2 ? <FormattedMessage defaultMessage={'Пароли не совпадают'} /> : null}
						onChange={e => setNewPassword2(e.target.value)}
					/>
					{new_password && new_password === new_password2 ? (
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							<FormattedMessage defaultMessage={'Изменить пароль'} />
						</Button>
					) : null}

				</form>
			</Grid>
		</Grid>
	) : null;
})

export default Profile;
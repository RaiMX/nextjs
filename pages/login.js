import React from 'react';
import Router from 'next/router';

/** THIRD PARTY */
import {FormattedMessage} from "react-intl";

/** COMPONENTS */
import {STATIC_ROUTES} from "../utils/CONSTANTS";
import Copyright from "components/common/Copyright";
import Link from 'components/mods/nextjs/Link';
import {forgotPassword, login} from "utils/auth";
import {AppContext, AppDispatchContext} from "providers/app_provider";

/** MATERIAL */
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {toast} from "react-toastify";


const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
	image: {
		backgroundImage: 'url(https://source.unsplash.com/random)',
		backgroundRepeat: 'no-repeat',
		backgroundColor:
			theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function Login() {
	const classes = useStyles();

	const {app_conf, user_info} = React.useContext(AppContext);
	const {setAppConf, setUserInfo} = React.useContext(AppDispatchContext);

	const [username, setUserName] = React.useState();
	const [password, setPassword] = React.useState();
	const [remember_me, setRememberMe] = React.useState();

	const [forgot_password, setForgotPassword] = React.useState(false);

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const {tokens, user} = await login({email: username, password});
			setUserInfo(old => ({...old, user: user}))
			await Router.push('/');
		} catch (error) {
			if (error.response?.data?.message) {
				toast.error(error.response.data.message)
			}
		}
	}

	const handleForgotPassword = async e => {
		e.preventDefault();
		try {
			const {tokens, user} = await forgotPassword(username);
			setUserInfo(old => ({...old, user: user}))
			await Router.push('/');
		} catch (error) {
			if (error.response?.data?.message) {
				toast.error(error.response.data.message)
			}
		}
	}

	React.useEffect(() => {
		Router.replace(STATIC_ROUTES.LOGIN)
	}, [])

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline/>
			<Grid item xs={false} sm={4} md={7} className={classes.image}/>
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon/>
					</Avatar>
					<Typography component="h1" variant="h5">
						{forgot_password ? <FormattedMessage defaultMessage={'Восстановление пароля'}/> : <FormattedMessage defaultMessage={'Войти'}/>}
					</Typography>
					{!forgot_password ? (
						<form className={classes.form} noValidate onSubmit={handleSubmit}>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="email"
								label="Email"
								name="email"
								autoComplete="email"
								autoFocus
								onChange={e => setUserName(e.target.value)}
							/>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								name="password"
								label={<FormattedMessage defaultMessage={'Пароль'}/>}
								type="password"
								id="password"
								autoComplete="current-password"
								onChange={e => setPassword(e.target.value)}
							/>
							{/*<FormControlLabel*/}
							{/*	control={<Checkbox value="remember" color="primary" onChange={e => setRememberMe(e.target.checked)} />}*/}
							{/*	label={<FormattedMessage defaultMessage={'Запомнить меня'}/>}*/}
							{/*/>*/}
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								<FormattedMessage defaultMessage={'Войти'}/>
							</Button>
							<Grid container>
								<Grid item xs>
									<Link href="#" onClick={() => setForgotPassword(true)}>
										<FormattedMessage defaultMessage={'Забыли пароль?'}/>
									</Link>
								</Grid>
								<Grid item>
									<Link href={STATIC_ROUTES.REGISTER}>
										<FormattedMessage defaultMessage={'Регистрация'}/>
									</Link>
								</Grid>
							</Grid>
							<Box mt={5}>
								<Copyright/>
							</Box>
						</form>
					) : (
						<form className={classes.form} noValidate onSubmit={handleForgotPassword}>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="email"
								label="Email"
								name="email"
								autoComplete="email"
								autoFocus
								onChange={e => setUserName(e.target.value)}
							/>
							<Grid container>
								<Grid item xs>
									<Link href="#" onClick={() => setForgotPassword(false)}>
										<FormattedMessage defaultMessage={'Вспомнили пароль?'}/>
									</Link>
								</Grid>
							</Grid>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								<FormattedMessage defaultMessage={'Отправить пароль'}/>
							</Button>
						</form>
					)}
				</div>
			</Grid>
		</Grid>
	);
}
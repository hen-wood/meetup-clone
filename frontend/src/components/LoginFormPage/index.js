import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { postSessionLogIn } from "../../store/session";

export default function LoginFormPage() {
	const dispatch = useDispatch();
	const history = useHistory();
	const sessionUser = useSelector(state => state.user);
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});

	if (sessionUser) {
		return <Redirect to="/" />;
	}
	const handleSubmit = async e => {
		e.preventDefault();

		const payload = {
			credential,
			password
		};
		const res = await dispatch(postSessionLogIn(payload));
		if (res.user) {
			console.log(res);
			history.push("/");
			return history.push("/");
		} else if (res.statusCode === 400) {
			setErrors(res.errors);
			return;
		} else if (res.statusCode === 401) {
			const errObj = { ...res };
			if (errObj.stack) delete errObj.stack;
			setErrors(errObj);
			return;
		}
	};
	const errorArr = Object.keys(errors);

	return (
		<form onSubmit={handleSubmit}>
			<ul>
				{errorArr.map(err => (
					<li key={errors[err]}>{errors[err]}</li>
				))}
			</ul>
			<input
				type="text"
				placeholder="username/email"
				onChange={e => setCredential(e.target.value)}
			/>
			<input
				type="text"
				placeholder="password"
				onChange={e => setPassword(e.target.value)}
			/>
			<button type="submit">Login</button>
		</form>
	);
}

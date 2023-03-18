// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Profile from '../routes/profile';
import { Router } from 'preact-router';
import { h } from 'preact';

const App = () => (
	<div id="app">
		<main>
			<Router>
				<Home path="/" />
				<Profile path="/profile/" user="me" />
				<Profile path="/profile/:user" />
			</Router>
		</main>
	</div>
);

export default App;

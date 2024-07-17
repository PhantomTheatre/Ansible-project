import React from "react";
import { Link, usePage } from '@inertiajs/react';

export default function MainComponent(props) {
	const { auth } = usePage().props;
	return (
		<div>
			<h1>Main Page</h1>
			<h1>Selected user: {props.user}</h1>
			{props.local != "none" &&
			<h1>Selected local: {props.local}</h1>}
			<div><Link href="/hosts">
				Hosts
			</Link></div>
			<div><Link href="/roles">
				Roles
			</Link></div>
			<div><Link href="/user">
				User
			</Link></div>
			<div><Link href="/local">
				Local
			</Link></div>
			<div><Link href="/play">
				Play
			</Link></div>
		</div>
	)
}
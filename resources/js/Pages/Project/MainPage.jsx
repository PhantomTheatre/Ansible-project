import React from "react";
import { Link, usePage } from '@inertiajs/react';
			/*<h1>{props.db_post.post}</h1>
			//<h1>{auth.post}</h1> */

export default function MainComponent(props) {
	//const { auth } = usePage().props
	return (
		<div>
			<h1>Main Page</h1>
			<div><Link href="/hosts">
				Hosts
			</Link></div>
			<div><Link href="/roles">
				Roles
			</Link></div>
			<div><Link href="/user">
				User
			</Link></div>
			<div><Link href="/play">
				Play
			</Link></div>
		</div>
	)
}
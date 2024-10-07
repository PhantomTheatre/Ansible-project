import React from "react";
import { Link, usePage } from '@inertiajs/react';

export default function Block(props) {
	const { auth } = usePage().props;
	return (
		<div>
			<h1>{props.print}</h1>
			<Link href="/">Back</Link>
		</div>
	)
}


import React, { useState } from "react";
import { router, usePage} from '@inertiajs/react';

const Primary =() => {
	const { auth } = usePage().props
	
	const [email, setEmail] = useState(" ")
	const [post, setPost] = useState(" ")
	
	
	const saveData = (e) => {
		e.preventDefault();
		router.post("/save", { email, post });
	};
	
	return (
		<div>
			<div>
				<h1>{auth.a}</h1>
			<form onSubmit={saveData}>
				<input 
					value={email} 
					onChange={(e)=>setEmail(e.target.value)} 
					type="email" 
					name="email" 
					id="email" 
					placeholder="Email"/>
				<input 
					value={post}   
					onChange={(e)=>setPost(e.target.value)}   
					type="post" 
					name="post" 
					id="post" 
					placeholder="Напишите что-нибудь здесь"/>
				<button>Опубликовать</button>
			</form>
			</div>
		</div>
	)
}
export default Primary;
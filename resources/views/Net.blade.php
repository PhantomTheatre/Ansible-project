@extends('Net_global')

@section('style')
	<style>
		textarea{resize: none;}
		.but { display:flex; font-size: 15px;   margin-top: 2vh; justify-content: flex-end}
		a  { text-decoration: none; color: black; border: 3px solid black; padding: 10px;}
	</style>
@endsection

@section('main_content')
	<h1> Создайте пост </h1>
	<form method="post" action="/Net/check" style="height: 30vh; width: 15vw; display: flex; flex-direction: column; padding: 15%;border: 3px solid black;">
		@csrf
		<textarea type="email" name="email" id="email" placeholder="Email"  style="white-space: nowrap; overflow: hidden"; rows="1" cols="1" maxlength="38"></textarea>
		<textarea type="post" name="post" id="post" placeholder="Напишите что-нибудь здесь" cols="40" rows="10"  maxlength="380"}></textarea>
		<button type="submit">Опубликовать </button>
		@if($errors->any())
			<div><ul>
				@foreach($errors->all() as $error)
					<li>{{ $error}}</li>
				@endforeach
			</ul></div>
		@endif
	</form>
	@foreach($posts as $post)
		<h3>{{ $post->email }} </h3>
		<h4>{{ $post->post }} </h4>
	@endforeach
@endsection
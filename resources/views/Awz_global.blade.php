<!DOCTYPE html>
<html lang="en">
 <head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Awz</title>
	@yield('style')
</head>
 <body>
	<div style = "overflow: hidden; width:98vw; height: 68vh; display: flex; align-items: center; justify-content: space-evenly; flex-direction: column; padding-bottom: 30vh;">
		<div>
			@yield('main_content')
		</div>
	</div>
	
 </body>
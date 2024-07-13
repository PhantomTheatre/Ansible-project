<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\DB;
use App\Models\ContactModel;
use App\Models\host;
use App\Models\role;
use Inertia\Inertia;

class MainController extends Controller
{
    public function MainPage() {
		//$posts = new ContactModel();
		//$user = $posts::find(12);
		return Inertia::render('Project/MainPage'); //['db_post' => $user]);
	}
	
	public function hosts() {
		return Inertia::render('Project/hosts');
	}
	public function save_hosts(Request $request) {
		$host = new host();
		$data = array(
			'name' => $request->input('name'),
			'ip' => $request->input('ip'),
			'login' => $request->input('login'),
			'password' => $request->input('password'),
			'group' => $request->input('group'),
			'local' => $request->input('local'),
		);
		$host->create($data);
		//Storage::disk('local')->put('/ansible/hosts', 'a');
		
		return redirect('/');
	}
	public function roles() {
		return Inertia::render('Project/roles');
	}
	public function save_roles(Request $request) {
		$role = new role();
		$data = array(
			'name' => $request->input('name'),
			'group' => $request->input('group'),
			'local' => $request->input('local'),
		);
		$role->create($data);
		$request->file('tasks')->storeAs(path: "/ansible/roles/{$request->input('name')}/tasks/", name: 'main.yml');
		return redirect('/');
	}
	public function play() {
		$hosts = new host();
		$roles = new role();
		return Inertia::render('Project/play', ['roles' =>$roles->all(), 'hosts' => $hosts->all()]);
	}
	public function play_launch(Request $request) {
		$host = DB::table('hosts')->where('id', $request->host)->first();
		$role = DB::table('roles')->where('id', $request->role)->first();
		
		Storage::disk('local')->put('/ansible/hosts', "{$host->ip} ansible_connection=ssh ansible_ssh_user={$host->login} ansible_ssh_pass={$host->password}");
		Storage::disk('local')->put('/ansible/first.yml', 
"- name: 'First step'
  hosts: all
  roles:
   - {$role->name}"
		);
		$result = Process::run('cd ../storage/app/ansible && ansible-playbook ./first.yml -i ./hosts ');
		return $result->output();
	}
	
	public function Primary() {
		return Inertia::render('Project/Primary');
	}
	public function save(Request $request) {
		$post = new ContactModel();
		$data = array(
			'email' => $request->input('email'),
			'post' => $request->input('post'),
		);
		$post->create($data);
		return redirect('/');
	}
	
	
	
	public function Net() {
		$posts = new ContactModel();
		return view('Net', ['posts' => $posts->all()]);
	}
	public function Net_check(Request $request) {
		$valid = $request->validate([
			"email" => 'required|min:4',
			"post" => 'required|min:4',
		]);
		$content = new ContactModel();
		$content->email= $request->input(key: 'email');
		$content->post= $request->input(key: 'post');
		$content->save();
		return redirect('/Net');
	}
		public function Awz_main() {
		return view('Awz_main');
	}
		public function Projects() {
		return view('Projects');
	}
	public function About() {
		return view('About');
	}
}


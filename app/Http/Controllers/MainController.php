<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\ContactModel;
use App\Models\host;
use App\Models\role;
use App\Models\myuser;
use App\Models\local;
use Inertia\Inertia;
use Cookie;


class MainController extends Controller
{
    public function MainPage() {
		if (Cache::store('database')->get('user') == null){
			Cache::store('database')->put('user', Cookie::get('user', 'none'), 1800);
		$user = DB::table('myusers')->where('login', Cache::store('database')->get('user'))->first();
		Cache::store('database')->put('local', $user->local, 1800);}
		return Inertia::render('Project/MainPage', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local')]); 
	}
	
	public function hosts() {
		$hosts = new host();
		$selected_hosts = array();
		foreach ($hosts->all() as $host) {
			if (Cache::store('database')->get('local') == "none") {
				if ($host->created_by == Cache::store('database')->get('user')) {
					array_push($selected_hosts,$host);
				}
			} else {
				if ($host->local == Cache::store('database')->get('local')) {
					array_push($selected_hosts,$host);
				}
			}
		}
		return Inertia::render('Project/hosts',  ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local'),  'hosts' => $selected_hosts]);
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
			'right' => $request->input('right'),
			'created_by' => $request->input('created_by'),
		);
		$host->create($data);
		
		return redirect('/');
	}
	public function hosts_edit(Request $request) {
		$host = DB::table('hosts')->where('name', "Port my")->first();			//Not work without change
		return Inertia::render('Project/host-edit',  ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local'),  'host' => $host]);
	}
	public function hosts_edit_save(Request $request) {
		DB::table('hosts')->where('id', $request->id)->update(array('name'=>$request->name,"ip"=>$request->ip, "login"=>$request->login, 'password'=>$request->password, 'group'=>$request->group, 'right'=>$request->right));
		return redirect('/');
	}
	
	public function roles() {
		$roles = new role();
		$selected_roles = array();
		foreach ($roles->all() as $role) {
			if (Cache::store('database')->get('local') == "none") {
				if ($role->created_by == Cache::store('database')->get('user')) {
					array_push($selected_roles,$role);
				}
			} else {
				if ($role->local == Cache::store('database')->get('local')) {
					array_push($selected_roles,$role);
				}
			}
		}
		return Inertia::render('Project/roles', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local'), 'roles'=>$selected_roles]);
	}
	public function save_roles(Request $request) {
		$role = new role();
		$data = array(
			'name' => $request->input('name'),
			'group' => $request->input('group'),
			'local' => $request->input('local'),
			'right' => $request->input('right'),
			'created_by' => $request->input('created_by'),
		);
		$role->create($data);
		if ($request->type =="file") {
			$request->file('tasks')->storeAs(path: "/ansible/roles/{$request->input('name')}/tasks/", name: 'main.yml');
		} else {
			Storage::disk('local')->put("/ansible/roles/{$request->input('name')}/tasks/main.yml", "{$request->input('code')}");
		}
		return redirect('/');
	}
	public function roles_edit(Request $request) {
		$role = DB::table('roles')->where('name', "For")->first();	
		$code = Storage::disk('local')->get("/ansible/roles/{$role->name}/tasks/main.yml");
		return Inertia::render('Project/role-edit', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local'), 'role'=>$role, 'code'=>$code]);
	}
	public function roles_edit_save(Request $request) {
		$role = DB::table('roles')->where('id', $request->id)->first();
		if ($request->type == "file" and $request->file('task') != null) {
			Storage::disk('local')->delete("/ansible/roles/{$role->name}/tasks/main.yml");
			Storage::disk('local')->delete("/ansible/roles/{$role->name}/tasks/");
			Storage::disk('local')->delete("/ansible/roles/{$role->name}/");
			$request->file('task')->storeAs(path: "/ansible/roles/{$request->input('name')}/tasks/", name: 'main.yml');
		} else if ($request->type == "write") {
			Storage::disk('local')->delete("/ansible/roles/{$role->name}/tasks/main.yml");
			Storage::disk('local')->delete("/ansible/roles/{$role->name}/tasks/");
			Storage::disk('local')->delete("/ansible/roles/{$role->name}/");
			Storage::disk('local')->put("/ansible/roles/{$request->input('name')}/tasks/main.yml", "{$request->input('code')}");
		}
		DB::table('roles')->where('id', $request->id)->update(array('name'=>$request->name,  'group'=>$request->group, 'right'=>$request->right));
		if ($request->type == "file" and $request->file('task') != null) {
			$request->file('task')->storeAs(path: "/ansible/roles/{$request->input('name')}/tasks/", name: 'main.yml');}
		return redirect('/');
	}
	public function play() {
		$hosts = new host();
		$selected_hosts = array();
		foreach ($hosts->all() as $host) {
			if (Cache::store('database')->get('local') == "none") {
				if ($host->created_by == Cache::store('database')->get('user')) {
					array_push($selected_hosts,$host);
				}
			} else {
				if ($host->local == Cache::store('database')->get('local')) {
					array_push($selected_hosts,$host);
				}
			}
		}
		$roles = new role();
		$selected_roles = array();
		foreach ($roles->all() as $role) {
			if (Cache::store('database')->get('local') == "none") {
				if ($role->created_by == Cache::store('database')->get('user')) {
					array_push($selected_roles,$role);
				}
			} else {
				if ($role->local == Cache::store('database')->get('local')) {
					array_push($selected_roles,$role);
				}
			}
		}
		return Inertia::render('Project/play', ['user' =>Cache::store('database')->get('user'), 'roles' =>$selected_roles, 'hosts' => $selected_hosts, 'local' =>Cache::store('database')->get('local')]);
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
	
	
	
	public function local() {
		return Inertia::render('Project/local', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local') ] ); 
	}
	public function local_exit() {
		DB::table('myusers')->where('login', Cache::store('database')->get('user'))->update(array('local'=>"none"));
		Cache::store('database')->put('local', "none", 1800);
		return redirect('/local');
	}
	public function local_login(Request $request) {
		$local = DB::table('locals')->where('name', $request->name)->first();
		if ($local->password == $request->password){
			Cache::store('database')->put('local', $local->name, 1800);
			DB::table('myusers')->where('login', Cache::store('database')->get('user'))->update(array('local'=>$local->name));
		}
		return redirect('/');
	}
	public function local_create() {
		return Inertia::render('Project/local-create', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local')]); 
	}
	public function local_create_save(Request $request) {
		$local = new local();
		$data = array(
			'name' => $request->input('name'),
			'password' => $request->input('password'),
			'created_by' => $request->input('created_by'),
		);
		$local->create($data);
		return redirect('/local');
	}
	
	
	
	
	public function user() {
		return Inertia::render('Project/user', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local')] ); 
	}
	public function user_exit() {
		cookie::queue(Cookie::forever('user', "none"));
		Cache::store('database')->put('user', "none", 1800);
		Cache::store('database')->put('local', "none", 1800);
		return redirect('/user');
	}
	public function user_login(Request $request) {
		$user = DB::table('myusers')->where('email', $request->login)->first();
		if ($user->password == $request->password){
			cookie::queue(Cookie::forever('user', $user->login));
			Cache::store('database')->put('user', $user->login, 1800);
			Cache::store('database')->put('local', $user->local, 1800);
		}
		return redirect('/');
	}
	public function user_registration() {
		return Inertia::render('Project/registration', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local')]); 
	}
	public function user_registration_save(Request $request) {
		$user = new myuser();
		$data = array(
			'login' => $request->input('login'),
			'password' => $request->input('password'),
			'email' => $request->input('email'),
			'right' => $request->input('right'),
			'local' => $request->input('local'),
		);
		$user->create($data);
		return Inertia::render('Project/user'); 
	}
	public function user_edit() {
		$user = DB::table('myusers')->where('login', Cache::store('database')->get('user'))->first();
		return Inertia::render('Project/user-edit', ['db' => $user, 'user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local')]); 
	}
	public function user_edit_save(Request $request) {
		DB::table('myusers')->where('login', Cache::store('database')->get('user'))->update(array('login'=>$request->login, 'password'=>$request->password, 'email'=>$request->email));
		return redirect('/');
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


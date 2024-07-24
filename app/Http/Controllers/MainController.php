<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use App\Models\ContactModel;
use App\Models\host;
use App\Models\role;
use App\Models\myuser;
use App\Models\local;
use Inertia\Inertia;
use Cookie;


class MainController extends Controller
{
	public function SelectedHosts_update() {
		$hosts = new host();
		$selected_hosts = array();
		foreach ($hosts->all() as $host) {
			if (Cache::store('database')->get('local') == "none") {
				if ($host->created_by == Cache::store('database')->get('user') and $host->local == "none") {
					array_push($selected_hosts,$host);
				}
			} else {
				if ($host->local == Cache::store('database')->get('local')) {
					array_push($selected_hosts,$host);
				}
			}
		}
		Cache::store('database')->put('selected_hosts', $selected_hosts, 1800);
	}
	
	public function SelectedRoles_update() {
		$roles = new role();
		$selected_roles = array();
		foreach ($roles->all() as $role) {
			if (Cache::store('database')->get('local') == "none") {
				if ($role->created_by == Cache::store('database')->get('user')  and $role->local == "none") {
					array_push($selected_roles,$role);
				}
			} else {
				if ($role->local == Cache::store('database')->get('local')) {
					array_push($selected_roles,$role);
				}
			}
		}
		Cache::store('database')->put('selected_roles', $selected_roles, 1800);
	}
   
   public function MainPage() {
		if (Cache::store('database')->get('user') == null){
			Cache::store('database')->put('user', Cookie::get('user', 'none'), 1800);
			if (Cache::store('database')->get('user') != "none") {
				$user = DB::table('myusers')->where('login', Cache::store('database')->get('user'))->first();
				Cache::store('database')->put('local', $user->local, 1800);
				Cache::store('database')->put('right', $user->right, 1800);
			} else { Cache::store('database')->put('local', "none", 1800);}
			$this->SelectedHosts_update();
			$this->SelectedRoles_update();
		}
		return Inertia::render('Project/MainPage', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local')]); 
	}
	
	public function hosts() {
		if (Cache::store('database')->get('local') != "none" and (Cache::store('database')->get('right') == "read" or Cache::store('database')->get('right') == "none")) {
			return Inertia::render('Project/block', ['print' => 'Недостаточно прав']);
		} else {
			$this->SelectedHosts_update();
			return Inertia::render('Project/hosts',  ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local'),  'hosts' => Cache::store('database')->get('selected_hosts')]);
		}
	}
	public function save_hosts(Request $request) {
		$host = new host();
		$data = array(
			'name' => $request->input('name'),
			'ip' => $request->input('ip'),
			'login' => $request->input('login'),
			'password' => $request->input('password'),
			'group' => $request->input('group'),
			'local' => Cache::store('database')->get('local'),
			'global' => $request->input('global_'),
			'created_by' => Cache::store('database')->get('user'),
		);
		$host->create($data);
		
		return redirect('/');
	}	
	public function hosts_edit(Request $request) {
		DB::table('hosts')->where('id', $request->id)->update(array('name'=>$request->name,"ip"=>$request->ip, "login"=>$request->login, 'password'=>$request->password, 'group'=>$request->group, 'global'=>$request->global_));
		return redirect('/');
	}
	public function hosts_delete(Request $request) {
		DB::table('hosts')->where('id', $request->host)->delete();
		return redirect('/');
	}
	
	public function roles() {
		if (Cache::store('database')->get('local') != "none" and (Cache::store('database')->get('right') == "read" or Cache::store('database')->get('right') == "none"))  {
			return Inertia::render('Project/block', ['print' => 'Недостаточно прав']);
		} else {
			$this->SelectedRoles_update();
			$codes = [];
			foreach (Cache::store('database')->get('selected_roles') as $role) {
				$code = Storage::disk('local')->get("/ansible/roles/{$role->name}/tasks/main.yml");
				$codes[$role->id] = $code;
			}
			return Inertia::render('Project/roles', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local'), 'roles'=>Cache::store('database')->get('selected_roles'), 'codes' => $codes]);
		}
	}
	public function save_roles(Request $request) {
		$role = new role();
		$role->create(array('global' => $request->global_, 'name' => $request->name, 'group' => $request->group, 'local' => Cache::store('database')->get('local'), 'created_by' => Cache::store('database')->get('user')));
		if ($request->type =="file") {
			$request->file('task')->storeAs(path: "/ansible/roles/{$request->name}/tasks/", name: 'main.yml');
		} else {
			Storage::disk('local')->put("/ansible/roles/{$request->name}/tasks/main.yml", "{$request->code}");
		}
		return redirect('/');
	}
	
	public function roles_edit(Request $request) {
		$role = DB::table('roles')->where('id', $request->id)->first();
		if ($request->type == "file" and $request->file('task') != null) {
			Storage::disk('local')->delete("/ansible/roles/{$role->name}/tasks/main.yml");
			Storage::disk('local')->deleteDirectory("/ansible/roles/{$role->name}/tasks/");
			Storage::disk('local')->deleteDirectory("/ansible/roles/{$role->name}/");
			$request->file('task')->storeAs(path: "/ansible/roles/{$request->name}/tasks/", name: 'main.yml');
		} else if ($request->type == "write") {
			Storage::disk('local')->delete("/ansible/roles/{$role->name}/tasks/main.yml");
			Storage::disk('local')->deleteDirectory("/ansible/roles/{$role->name}/tasks/");
			Storage::disk('local')->deleteDirectory("/ansible/roles/{$role->name}/");
			Storage::disk('local')->put("/ansible/roles/{$request->name}/tasks/main.yml", "{$request->code}");
		}
		DB::table('roles')->where('id', $request->id)->update(array('name'=>$request->name, 'group'=>$request->group, 'global'=>$request->global_));
		return redirect('/');
	}
	
	public function roles_delete(Request $request) {
		$role = DB::table('roles')->where('id', $request->role)->first();
		Storage::disk('local')->delete("/ansible/roles/{$role->name}/tasks/main.yml");
		Storage::disk('local')->deleteDirectory("/ansible/roles/{$role->name}/tasks/");
		Storage::disk('local')->deleteDirectory("/ansible/roles/{$role->name}/");
		DB::table('roles')->where('id', $request->role)->delete();
		return redirect('/');
	}
	
	public function play() {
		$hosts = new host();
		$selected_hosts = array();
		foreach ($hosts->all() as $host) {
			if (Cache::store('database')->get('local') != "none") {
				if ($host->local == Cache::store('database')->get('local')) {
					if  (Cache::store('database')->get('right') == "none"){
						if ($host->global == 'true') {
							array_push($selected_hosts,$host);
						}
					} else { array_push($selected_hosts,$host);}
				} else if ($host->local == 'none' and $host->created_by == Cache::store('database')->get('user')) {
					array_push($selected_hosts,$host);
				}
			} else if ($host->created_by == Cache::store('database')->get('user')){ array_push($selected_hosts,$host);}
		}
		$roles = new role();
		$selected_roles = array();
		foreach ($roles->all() as $role) {
			if (Cache::store('database')->get('local') != "none") {
				if ($role->local == Cache::store('database')->get('local')) {
					if  (Cache::store('database')->get('right') == "none"){
						if ($role->global == 'true') {
							array_push($selected_roles,$role);
						}
					} else { array_push($selected_roles,$role);}
				} else if ($role->local == 'none' and $role->created_by == Cache::store('database')->get('user')) {
					array_push($selected_roles,$role);
				}
			} else if ($role->created_by == Cache::store('database')->get('user')){ array_push($selected_roles,$role);}
		}
		return Inertia::render('Project/play', ['user' =>Cache::store('database')->get('user'), 'roles' =>$selected_roles, 'hosts' => $selected_hosts, 'local' =>Cache::store('database')->get('local')]);
	}
	public function play_launch(Request $request) {
		$host = DB::table('hosts')->where('id', $request->host)->first();
		$role = DB::table('roles')->where('id', $request->role)->first();
		if ($request->typeHost == 'single') {
			Storage::disk('local')->put('/ansible/hosts', "{$host->ip} ansible_connection=ssh ansible_ssh_user={$host->login} ansible_ssh_pass={$host->password}");
		}
		else {
			$hosts = new host();
			Storage::disk('local')->put('/ansible/hosts', "");
			foreach ($hosts->all() as $host) {
				if (Cache::store('database')->get('local') != "none") {
					if ($host->local == Cache::store('database')->get('local') and $host->group == $request->host) {
						Storage::disk('local')->append('/ansible/hosts', "{$host->ip} ansible_connection=ssh ansible_ssh_user={$host->login} ansible_ssh_pass={$host->password}");
					}
				} else if ($host->local == "none" and $host->created_by== Cache::store('database')->get('user') and $host->group == $request->host) {
					Storage::disk('local')->append('/ansible/hosts', "{$host->ip} ansible_connection=ssh ansible_ssh_user={$host->login} ansible_ssh_pass={$host->password}");
				}
			}
		}
		if ($request->typeRole == 'single') {
		Storage::disk('local')->put('/ansible/first.yml', 
"- name: 'First step'
  hosts: all
  roles:
   - {$role->name}"
		);
		}
		else {
			$roles = new role();
			Storage::disk('local')->put('/ansible/first.yml', 
"- name: 'First step'
  hosts: all
  roles:");
			foreach ($roles->all() as $role) {
				if (Cache::store('database')->get('local') != "none") {
					if ($role->local == Cache::store('database')->get('local') and $role->group == $request->role) {
						Storage::disk('local')->append('/ansible/first.yml', "   - {$role->name}");
					}
				} else if ($role->local == "none" and $role->created_by== Cache::store('database')->get('user') and $role->group == $request->role) {
					Storage::disk('local')->append('/ansible/first.yml', "   - {$role->name}");
				}
			}
		}
		$result = Process::run('cd ../storage/app/ansible && ansible-playbook ./first.yml -i ./hosts ');
		return $result->output();
	}
	
	
	
	public function local() {
		$this->SelectedHosts_update();
		$this->SelectedRoles_update();
		$local_name = "none";
		if (Cache::store('database')->get('local') != "none") {
			$admin = DB::table('locals')->where('name', Cache::store('database')->get('local'))->first()->admin;
			$local_name = DB::table('locals')->where('name', Cache::store('database')->get('local'))->first()->name;
			if (Cache::store('database')->get('right') == "admin" || Cache::store('database')->get('user') == $admin)  {
				$actors = array();
				$local = DB::table('locals')->where('name', Cache::store('database')->get('local'))->first();
				$file = json_decode(json: (File::get( base_path("storage/app/locals/{$local->name}.json"))), associative: true);
				foreach (array_keys($file) as $actor) {
					$actors[$actor] = $file[$actor];
				}
				return Inertia::render('Project/local', ['local_name' => $local_name,'right'=>"admin", 'admin'=>$admin, 'user' =>Cache::store('database')->get('user'), 'local' =>$local, "actors"=>$actors, 'roles' =>Cache::store('database')->get('selected_roles'), 'hosts' => Cache::store('database')->get('selected_hosts'),] ); 
			} else if (Cache::store('database')->get('right') == "write") {
				return Inertia::render('Project/local', ['local_name' => $local_name, 'right'=>"write",'admin'=>$admin, 'user' =>Cache::store('database')->get('user'), 'roles' =>Cache::store('database')->get('selected_roles'), 'hosts' => Cache::store('database')->get('selected_hosts'),] ); 
			} else if (Cache::store('database')->get('right') == "read"){
				return Inertia::render('Project/local', ['local_name' => $local_name, 'right'=>"read",'admin'=>$admin, 'user' =>Cache::store('database')->get('user')] ); 
			} else {
				return Inertia::render('Project/local', ['local_name' => $local_name, 'right'=>"none",'admin'=>$admin, 'user' =>Cache::store('database')->get('user')] ); 
			}
		} else  {
			return Inertia::render('Project/local', ['local_name' => $local_name,  'right'=>"local", 'user' =>Cache::store('database')->get('user')] ); 
		}
	}
	public function local_exit() {
		DB::table('myusers')->where('login', Cache::store('database')->get('user'))->update(array('local'=>"none"));
		Cache::store('database')->put('local', "none", 1800);
		return redirect('/local');
	}
	public function local_login(Request $request) {
		$local = DB::table('locals')->where('name', $request->name)->first();
		$user = DB::table('myusers')->where('login', Cache::store('database')->get('user'));
		if ($local->password == $request->password){
			Cache::store('database')->put('local', $local->name, 1800);
			$user->update(array('local'=>$local->name));
			$file = json_decode(json: (File::get( base_path("storage/app/locals/{$local->name}.json"))), associative: true);
			$get_user = Cache::store('database')->get('user');
			if (array_key_exists($get_user, $file)) {
				$user->update(array('right'=>($file[$get_user])));
				Cache::store('database')->put('right', $file[$get_user], 1800);
			} else {
				$user->update(array('right'=>"read"));
				Cache::store('database')->put('right', "read", 1800);
			}
			
		}
		return redirect('/');
	}
	public function local_create(Request $request) {
		$local = new local();
		$data = array(
			'name' => $request->input('name'),
			'password' => $request->input('password'),
			'admin' => Cache::store('database')->get('user'),
		);
		$local->create($data);
		$file =  array(
			Cache::store('database')->get('user') => 'admin',
		);
		Storage::disk('local')->put("/locals/{$request->input('name')}.json", json_encode($file));
		return redirect('/');           // redirect('/local') не обновляет страницу
	}
	public function local_edit_local(Request $request) {
		$local = DB::table('locals')->where('name', Cache::store('database')->get('local'));
		if ($request->name != $local->first()->name) {
			foreach ((DB::table('myusers')->where('local', Cache::store('database')->get('local')) ->get()) as $actor) {
				DB::table('myusers')->where('id', $actor->id)->update(array('local'=>($request->name)));
			}
			Storage::move("/locals/{$local->first()->name}.json/", "/locals/{$request->name}.json/");
		}
		$local->update(array('name'=>($request->name), 'password'=>($request->password)));
		Cache::store('database')->put('local', $request->name, 1800);
		return redirect('/');
	}
	public function local_edit_user(Request $request) {
		$local = Cache::store('database')->get('local');
		$file = json_decode(json: (File::get( base_path("storage/app/locals/{$local}.json"))), associative: true);
		$user = DB::table('myusers')->where('login', $request->user);
		if ($user->first()->local == $local) {
			$user->update(array('right'=>($request->user_right)));
		}
		$file[$user->first()->login] = $request->user_right;
		Storage::disk('local')->put("/locals/{$local}.json", json_encode($file));
		Cache::store('database')->put('right', $user->first()->right, 1800);
		return redirect('/');         // redirect('/local') не обновляет страницу
	}
	public function local_edit_host(Request $request) {
		DB::table('hosts')->where('id', $request->host)->update(array('global'=>($request->host_right)));
		return redirect('/');
	}
	public function local_edit_role(Request $request) {
		DB::table('roles')->where('id', $request->role)->update(array('global'=>($request->role_right)));
		return redirect('/');
	}
	
	
	
	public function user() {
		$user = DB::table('myusers')->where('login', Cache::store('database')->get('user'))->first();
		return Inertia::render('Project/user', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local'), 'db_user'=>$user] ); 
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
			if ($user->local != "none") {
				$file = json_decode(json: (File::get( base_path("storage/app/locals/{$user->local}.json"))), associative: true);
				if (array_key_exists ($user->login, $file)){
					Cache::store('database')->put('right', $file[$user->login], 1800);
				} else { 
					Cache::store('database')->put('right', "read", 1800);
				}
			}
		}
		return redirect('/');
	}
	public function user_registration(Request $request) {
		$user = new myuser();
		$data = array(
			'login' => $request->input('login'),
			'password' => $request->input('password'),
			'email' => $request->input('email'),
			'right' => "read",
			'local' => "none",
		);
		$user->create($data);
		return redirect('/');   // redirect('/local') не обновляет страницу
	}
	public function user_edit(Request $request) {
			if (Cache::store('database')->get('user') != $request->login) {
				foreach (DB::table('hosts')->where('created_by', Cache::store('database')->get('user')) ->get() as $host) {
					DB::table('hosts')->where('id', $host->id)->update(array('created_by'=>$request->login));
				}
				foreach (DB::table('roles')->where('created_by', Cache::store('database')->get('user')) ->get() as $role) {
					DB::table('roles')->where('id', $role->id)->update(array('created_by'=>$request->login));
				}
				foreach (DB::table('locals')->where('admin', Cache::store('database')->get('user')) ->get() as $local) {
					DB::table('locals')->where('id', $local->id)->update(array('created_by'=>$request->login));
				}
			}
			
		DB::table('myusers')->where('login', Cache::store('database')->get('user'))->update(array('login'=>$request->login, 'password'=>$request->password, 'email'=>$request->email));
		Cache::store('database')->put('user', $request->login, 1800);
		return redirect('/');
	}
	public function user_delete(Request $request) {
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


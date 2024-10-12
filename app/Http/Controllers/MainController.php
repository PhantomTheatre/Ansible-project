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
use Redirect;
use Exception;


class MainController extends Controller
{
	public function SelectedHosts_update() {
		$user = Cache::store('database')->get('user');
		$hosts = new host();
		$selected_hosts = array();
		foreach ($hosts->all() as $host) {
			if (Cache::store('database')->get('local') != "none") {
				if ($host->local == Cache::store('database')->get('local')) {
					if  (Cache::store('database')->get('right') == "none"){
						if ($host->global == 'true') {
							$selected_hosts[$host->name] = ['id'=>$host->id, 'ip'=>$host->ip, 'name'=>$host->name, 'login'=>$host->login,
								'password'=>$host->password, 'group'=>$host->group, 'local'=>$host->local, 'global'=>$host->global,
								'created_by'=>$host->created_by, 'created_at'=>$host->created_at, 'updated_at'=>$host->updated_at];
						}
					} else {
						$selected_hosts[$host->name] = ['id'=>$host->id, 'ip'=>$host->ip, 'name'=>$host->name, 'login'=>$host->login,
							'password'=>$host->password, 'group'=>$host->group, 'local'=>$host->local, 'global'=>$host->global,
							'created_by'=>$host->created_by, 'created_at'=>$host->created_at, 'updated_at'=>$host->updated_at];}
				} else if ($host->local == 'none' and $host->created_by == $user) {
					$selected_hosts[$host->name] = ['id'=>$host->id, 'ip'=>$host->ip, 'name'=>$host->name, 'login'=>$host->login,
						'password'=>$host->password, 'group'=>$host->group, 'local'=>$host->local, 'global'=>$host->global,
						'created_by'=>$host->created_by, 'created_at'=>$host->created_at, 'updated_at'=>$host->updated_at];
				}
			} else if ($host->created_by == $user){
				$selected_hosts[$host->name] = ['id'=>$host->id, 'ip'=>$host->ip, 'name'=>$host->name, 'login'=>$host->login,
					'password'=>$host->password, 'group'=>$host->group, 'local'=>$host->local, 'global'=>$host->global,
					'created_by'=>$host->created_by, 'created_at'=>$host->created_at, 'updated_at'=>$host->updated_at];
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
	public function SelectedLocals_update() {
		$selected_locals = array();
		$get_user = Cache::store('database')->get('user');
		if ($get_user != "none") {
            $fileUser = json_decode(json: (File::get( base_path("storage/app/private/users/{$get_user}/locals.json"))), associative: true);
            if (gettype($fileUser)!= gettype(NULL)){
                foreach (array_keys($fileUser) as $local) {
                    $members=array();
                    if ($fileUser[$local]=="admin") {
                        $fileLocal = json_decode(json: (File::get( base_path("storage/app/private/locals/{$local}.json"))), associative: true);
                        foreach (array_keys($fileLocal) as $username) {
                            $members[$username]=$fileLocal[$username];
                        }
                    }
                    $pass = DB::table('locals')->where('name', $local)->first()->password;
                    $selected_locals[$local] = ['Name'=>$local, 'Right'=>$fileUser[$local], 'members' => $members, 'password'=> $pass, 'Count-of-members' =>count($members)];
                }
            }
        }
		Cache::store('database')->put('selected_locals', $selected_locals, 1800);
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
		return Inertia::render('Project/MainPage');
	}

	public function hosts() {
        $this->SelectedHosts_update();
        $this->SelectedLocals_update();
        $new_locals = array();
        foreach (Cache::store('database')->get('selected_locals') as $local) {
            if ($local['Right'] == "admin" or $local['Right'] == "write") {
                array_push($new_locals,$local['Name']);
            }
        }
        return Inertia::render('Project/hosts',  ['hosts' => Cache::store('database')->get('selected_hosts'), 'locals'=>$new_locals]);
	}
	public function save_hosts(Request $request) {
        foreach ($request->new_locals as $local) {
            $host = new host();
            $data = array(
                'name' => $request->input('name'),
                'ip' => $request->input('ip'),
                'login' => $request->input('login'),
                'password' => $request->input('password'),
                'group' => $request->group,
                'local' => $local,
                'global' => $request->input('global_'),
                'created_by' => Cache::store('database')->get('user'),
            );
            $host->create($data);
        }
		return redirect()->back();
	}
	public function hosts_edit(Request $request) {
		DB::table('hosts')->where('id', $request->id)->update(array(
				'name'=>$request->name,
				"ip"=>$request->ip,
				"login"=>$request->login,
				'password'=>$request->password,
				'group'=>$request->group,
				'global'=>$request->global_));
		return redirect()->back();
	}
	public function hosts_delete(Request $request) {
		DB::table('hosts')->where('id', $request->id)->delete();
		return redirect()->back();
	}

	public function roles() {
		if (Cache::store('database')->get('local') != "none" and (Cache::store('database')->get('right') == "read" or Cache::store('database')->get('right') == "none"))  {
			return Inertia::render('Project/block', ['print' => 'Недостаточно прав']);
		} else {

			$user = Cache::store('database')->get('user');
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
					} else if ($role->local == 'none' and $role->created_by == $user) {
						array_push($selected_roles,$role);
					}
				} else if ($role->created_by == $user){ array_push($selected_roles,$role);}
			}
			$codes = [];
			foreach ($selected_roles as $role) {
				$code = Storage::disk('local')->get("/ansible/roles/{$role->name}/tasks/main.yml");
				$codes[$role->id] = $code;
			}
			$this->SelectedLocals_update();
            $new_locals = array();
            foreach (Cache::store('database')->get('selected_locals') as $local) {
                if ($local['Right'] == "admin" or $local['Right'] == "write") {
                    array_push($new_locals,$local['Name']);
                }
            }
			return Inertia::render('Project/roles', [ 'roles'=>$selected_roles, 'codes' => $codes, 'locals' => $new_locals]);
		}
	}
	public function save_roles(Request $request) {
        dd($request->id);
		$role = new role();
        foreach ($request->new_locals as $local) {
            $role->create(array('global' => $request->global_, 'name' => $request->name, 'group' => $request->group,
                'local' => $local, 'created_by' => Cache::store('database')->get('user')));
            if ($request->type =="file") {
                $request->file('task')->storeAs(path: "/ansible/roles/{$request->name}/tasks/", name: 'main.yml');
            } else {
                Storage::disk('local')->put("/ansible/roles/{$request->name}/tasks/main.yml", "{$request->code}");
            }
        }
		return;
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
		return;
	}

	public function roles_delete(Request $request) {
		$role = DB::table('roles')->where('id', $request->id)->first();
		Storage::disk('local')->delete("/ansible/roles/{$role->name}/tasks/main.yml");
		Storage::disk('local')->deleteDirectory("/ansible/roles/{$role->name}/tasks/");
		Storage::disk('local')->deleteDirectory("/ansible/roles/{$role->name}/");
		DB::table('roles')->where('id', $request->id)->delete();
		return;
	}

	public function play() {
		$user = Cache::store('database')->get('user');
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
				} else if ($host->local == 'none' and $host->created_by == $user) {
					array_push($selected_hosts,$host);
				}
			} else if ($host->created_by == $user){ array_push($selected_hosts,$host);}
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
				} else if ($role->local == 'none' and $role->created_by == $user) {
					array_push($selected_roles,$role);
				}
			} else if ($role->created_by == $user){ array_push($selected_roles,$role);}
		}

		$logs = [];
		foreach (Storage::files("/users/{$user}/logs") as $log) {
				array_push($logs, [Storage::disk('local')->get($log), $log]);
		}
		return Inertia::render('Project/play', ['logs'=>$logs, 'roles' =>$selected_roles, 'hosts' => $selected_hosts]);
	}

	public function play_launch(Request $request) {
		Storage::disk('local')->put('/ansible/hosts', "");
		foreach ($request->final_selectedHosts as $el) {
			$host = DB::table('hosts')->where('id', $el)->first();
			Storage::disk('local')->append('/ansible/hosts', "{$host->ip} ansible_connection=ssh ansible_ssh_user={$host->login} ansible_ssh_pass={$host->password}");
		}
		Storage::disk('local')->put('/ansible/first.yml',
"- name: 'First step'
  hosts: all
  become: yes
  roles:");
		foreach ($request->final_selectedRoles as $el) {
			$role = DB::table('roles')->where('id', $el)->first();
			Storage::disk('local')->append('/ansible/first.yml', "   - {$role->name}");
		}
		$result = Process::run('cd ../storage/app/ansible && ansible-playbook ./first.yml -i ./hosts ');

		$user = Cache::store('database')->get('user');
		date_default_timezone_set('UTC');
		$date = date('j-m-Y-h-i-s');
		Storage::disk('local')->put("/users/{$user}/logs/{$date}.txt", "{$result->output()}");
		return $result->output();
	}

	public function local() {
		$this->SelectedLocals_update();
		return Inertia::render('Project/local_create',  ['locals' => Cache::store('database')->get('selected_locals')] );
	}

	public function local_exit(Request $request) {
		$get_user = Cache::store('database')->get('user');
		$fileUser = json_decode(json: (File::get( base_path("storage/app/private/users/{$get_user}/locals.json"))), associative: true);
        unset($fileUser[DB::table('locals')->where('name', $request->name_post)->first()->name]);
        Storage::disk('local')->put("/users/{$get_user}/locals.json", json_encode($fileUser));
		return redirect()->back();
	}
	public function local_delete(Request $request) {
		$get_user = Cache::store('database')->get('user');
		$fileUser = json_decode(json: (File::get( base_path("storage/app/private/users/{$get_user}/locals.json"))), associative: true);
        unset($fileUser[DB::table('locals')->where('name', $request->name_post)->first()->name]);
        Storage::disk('local')->put("/users/{$get_user}/locals.json", json_encode($fileUser));
        Storage::disk('local')->delete("/locals/{$request->name_post}.json");
        DB::table('locals')->where('name', $request->name_post)->delete();
		return redirect()->back();
	}
	public function local_edit(Request $request) {
        if ($request->name_post != $request->name) {
            Storage::disk('local')->move("locals/{$request->name_post}.json", "locals/{$request->name}.json");
            $get_user = Cache::store('database')->get('user');
            $fileUser = json_decode(json: (File::get( base_path("storage/app/private/users/{$get_user}/locals.json"))), associative: true);
            $fileUser[$request->name]=$fileUser[$request->name_post];
            unset($fileUser[$request->name_post]);
            Storage::disk('local')->put("/users/{$get_user}/locals.json", json_encode($fileUser));
            DB::table('locals')->where('name', $request->name_post)->update(array('name'=>$request->name));
        }
        DB::table('locals')->where('name', $request->name_post)->update(array('password'=>$request->password));
        return redirect()->back();
	}

	public function local_login(Request $request) {
		$local = DB::table('locals')->where('name', $request->name)->first();
		$get_user = Cache::store('database')->get('user');
		$user = DB::table('myusers')->where('login', $get_user);
		if ($local != null) {
			if ($local->password == $request->password){
				$fileUser = json_decode(json: (File::get( base_path("storage/app/private/users/{$get_user}/locals.json"))), associative: true);
				$fileLocal = json_decode(json: (File::get( base_path("storage/app/private/locals/{$local->name}.json"))), associative: true);
				if (array_key_exists($get_user, $fileLocal)) {
					$fileUser[$request->name] = $fileLocal[$get_user];
				} else {
					$fileUser[$request->name] = "read";
					$fileLocal[$get_user] = "read";
					Storage::disk('local')->put("/locals/{$request->input('name')}.json", json_encode($fileLocal));
				}
				Storage::disk('local')->put("/users/{$get_user}/locals.json", json_encode($fileUser));
			}
		}
		$this->SelectedLocals_update();
		return redirect()->back();
	}
	public function local_create(Request $request) {
		$local = new local();
		$data = array(
			'name' => $request->input('nameNew'),
			'password' => $request->input('passwordNew'),
			'admin' => Cache::store('database')->get('user'),
		);
		$local->create($data);
		$file =  array(
			Cache::store('database')->get('user') => 'admin',
		);
		Storage::disk('local')->put("/locals/{$request->input('nameNew')}.json", json_encode($file));

		$get_user = Cache::store('database')->get('user');
		$fileUser = json_decode(json: (File::get( base_path("storage/app/private/users/{$get_user}/locals.json"))), associative: true);
		$get_user = Cache::store('database')->get('user');
		$fileUser[$request->nameNew] = "admin";
		Storage::disk('local')->put("/users/{$get_user}/locals.json", json_encode($fileUser));

		return redirect()->back();
	}


	public function local_members(Request $request) {
        $get_user = Cache::store('database')->get('user');
        if ($request->members[$get_user] != Cache::store('database')->get('right')) {
            $fileUser = json_decode(json: (File::get( base_path("storage/app/private/users/{$get_user}/locals.json"))), associative: true);
            $fileUser[$request->name_post]=$request->members[$get_user];
            Storage::disk('local')->put("/users/{$get_user}/locals.json", json_encode($fileUser));
        }
        Storage::disk('local')->put("/locals/{$request->name_post}.json", json_encode($request->members));
        return redirect()->back();
    }



	public function user() {
		if (Cache::store('database')->get('user') == "none") {
			return Inertia::render('Project/user_login', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local')] );
		} else {
			$user = DB::table('myusers')->where('login', Cache::store('database')->get('user'))->first();
			return Inertia::render('Project/user_edit', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local'), 'db_user'=>$user] );
		}
	}
	public function user_exit() {
		cookie::queue(Cookie::forever('user', "none"));
		Cache::store('database')->put('user', "none", 1800);
		Cache::store('database')->put('local', "none", 1800);
		return redirect('/user');
	}
	public function user_login(Request $request) {
		if (str_contains(($request->login), '@')) {
			$user = DB::table('myusers')->where('email', $request->login)->first();
		} else {
			$user = DB::table('myusers')->where('login', $request->login)->first();
		}
		if ($user != null) {
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
				return Inertia::render('Project/user_edit', ['user' =>Cache::store('database')->get('user'), 'local' =>Cache::store('database')->get('local'), 'db_user'=>$user] );
			}
		}
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
		Storage::disk('local')->makeDirectory("/users/{$request->login}/");
		Storage::disk('local')->makeDirectory("/users/{$request->login}/logs");
		Storage::disk('local')->put("/users/{$request->login}/locals.json", "");
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
					DB::table('locals')->where('id', $local->id)->update(array('admin'=>$request->login));
				}
			}

		DB::table('myusers')->where('login', Cache::store('database')->get('user'))->update(array('login'=>$request->login, 'password'=>$request->password, 'email'=>$request->email));
		Cache::store('database')->put('user', $request->login, 1800);
		return;
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


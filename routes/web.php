<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MainController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
/*
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
*/

Route::get('/', [MainController::class, 'MainPage'])->name('MainPage');
Route::get('/Primary', [MainController::class, 'Primary'])->name('Primary');
Route::post('/save', [MainController::class, 'save'])->name('save');

Route::get('/hosts', [MainController::class, 'hosts'])->name('hosts');
Route::post('/hosts/save', [MainController::class, 'save_hosts'])->name('save_hosts');
Route::post('/hosts/edit', [MainController::class, 'hosts_edit'])->name('hosts_edit');
Route::post('/hosts/delete', [MainController::class, 'hosts_delete'])->name('hosts_delete');

Route::get('/roles', [MainController::class, 'roles'])->name('roles');
Route::post('roles/save', [MainController::class, 'save_roles'])->name('save_roles');
Route::post('/roles/edit', [MainController::class, 'roles_edit'])->name('roles_edit');
Route::post('/roles/delete', [MainController::class, 'roles_delete'])->name('roles_delete');

Route::get('/user', [MainController::class, 'user'])->name('user');
Route::post('/user/login', [MainController::class, 'user_login'])->name('user_login');
Route::post('/user/exit', [MainController::class, 'user_exit'])->name('user_exit');
Route::post('/user/edit', [MainController::class, 'user_edit'])->name('user_edit');
Route::post('/user/delete', [MainController::class, 'user_delete'])->name('user_delete');
Route::post('/user/registration', [MainController::class, 'user_registration'])->name('user_registration');

Route::get('/local', [MainController::class, 'local'])->name('local');
Route::post('/local/login', [MainController::class, 'local_login'])->name('local_login');
Route::get('/local/exit', [MainController::class, 'local_exit'])->name('local_exit');
Route::get('/local/create', [MainController::class, 'local_create'])->name('local_create');
Route::post('/local/create/save', [MainController::class, 'local_create_save'])->name('local_create_save');
Route::post('/local/edit', [MainController::class, 'local_edit'])->name('local_edit');
Route::post('/local/edit/save', [MainController::class, 'local_edit_save'])->name('local_edit_save');
Route::get('/local/rights/edit', [MainController::class, 'local_rights_edit'])->name('local_rights_edit');
Route::post('/local/rights/edit/save', [MainController::class, 'local_rights_edit_save'])->name('local_rights_edit_save');



Route::get('/play', [MainController::class, 'play'])->name('play');
Route::post('/play/launch', [MainController::class, 'play_launch'])->name('play_launch');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('destroy');
});

require __DIR__.'/auth.php';

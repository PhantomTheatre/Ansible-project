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
Route::post('/save/hosts', [MainController::class, 'save_hosts'])->name('save_hosts');

Route::get('/roles', [MainController::class, 'roles'])->name('roles');
Route::post('/save/roles', [MainController::class, 'save_roles'])->name('save_roles');

Route::get('/user', [MainController::class, 'user'])->name('user');
Route::post('/save/user', [MainController::class, 'save_user'])->name('save_user');

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

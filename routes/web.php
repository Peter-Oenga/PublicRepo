<?php

use Illuminate\Support\Facades\Route;


Route::get('/public_path',function () {
    return response()->json(['public_path'=>public_path()]);
});

Route::get('/{any}', function () {
    return view('index'); // This will serve the Vue app
})->where('any', '.*');

//  ensures that when the auth middleware redirects unauthenticated users, they are sent to this route.
// Route::get('/login', function () {
//     return view('auth.login'); // Ensure this view exists
// })->name('login');


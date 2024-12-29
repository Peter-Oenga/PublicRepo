<?php

use App\Models\User;
use App\Models\Activity;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Notifications\ReportMissingNotification;

Schedule::call(function () {
    $activities = Activity::whereDate('end_date', '<=', now())
                          ->whereNull('report')
                          ->get();

    foreach ($activities as $activity) {
        $users = User::all();
        foreach ($users as $user) {
            $user->notify(new ReportMissingNotification($activity));
        }
    }
})->everyMinute();

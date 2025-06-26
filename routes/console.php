<?php

use App\Console\Commands\VerifyLicenseAdminStatus;
use Illuminate\Support\Facades\Schedule;

Schedule::command(VerifyLicenseAdminStatus::class)->daily();

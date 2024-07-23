<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hosts', function (Blueprint $table) {
            $table->id();
			$table->ipAddress(column: "ip");
			$table->string(column: "name");
			$table->string(column: "login");
			$table->string(column: "password");
			$table->string(column: "group");
			$table->string(column: "local");
			$table->string(column: "global");
			$table->string(column: "created_by");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hosts');
    }
};

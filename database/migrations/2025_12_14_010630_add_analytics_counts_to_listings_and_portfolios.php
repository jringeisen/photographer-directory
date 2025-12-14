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
        Schema::table('listings', function (Blueprint $table) {
            $table->unsignedBigInteger('views_count')->default(0)->after('description');
            $table->unsignedBigInteger('contacts_count')->default(0)->after('views_count');
            $table->unsignedBigInteger('portfolio_views_count')->default(0)->after('contacts_count');
            $table->timestamp('last_viewed_at')->nullable()->after('portfolio_views_count');
        });

        Schema::table('portfolios', function (Blueprint $table) {
            $table->unsignedBigInteger('views_count')->default(0)->after('description');
            $table->timestamp('last_viewed_at')->nullable()->after('views_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn([
                'views_count',
                'contacts_count',
                'portfolio_views_count',
                'last_viewed_at',
            ]);
        });

        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropColumn([
                'views_count',
                'last_viewed_at',
            ]);
        });
    }
};
